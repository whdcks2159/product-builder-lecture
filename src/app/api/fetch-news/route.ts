import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';
import type { Sector, Sentiment } from '@/lib/supabase';

export const maxDuration = 60;

// ── 타입 ──────────────────────────────────────────────────────────────────────
interface NewsAPIArticle {
  title:       string;
  description: string | null;
  content:     string | null;
  url:         string;
  source:      { name: string };
  publishedAt: string;
}

interface GeminiSummary {
  title_ko:     string;             // 한국어 번역 제목
  summary:      [string, string, string];
  impact_score: number;
  sentiment:    Sentiment;
  sector:       Sector;
}

// ── 섹터 키워드 매핑 ───────────────────────────────────────────────────────────
const SECTOR_QUERIES: Array<{ q: string; sector: Sector }> = [
  { q: '"quantum computing" OR "quantum computer" OR IonQ OR Rigetti', sector: 'quantum' },
  { q: '"space economy" OR SpaceX OR "Rocket Lab" OR "Blue Origin" OR Starlink', sector: 'space' },
  { q: 'robotics OR "humanoid robot" OR "Boston Dynamics" OR "Figure AI"', sector: 'robot' },
  { q: '"security token" OR "tokenized asset" OR RWA OR "real world asset" OR STO', sector: 'sto' },
  { q: '"Federal Reserve" OR FOMC OR "interest rate" OR "Jerome Powell"', sector: 'fed' },
];

// ── NewsAPI 뉴스 수집 ──────────────────────────────────────────────────────────
async function fetchFromNewsAPI(
  query: string,
  apiKey: string,
): Promise<NewsAPIArticle[]> {
  const params = new URLSearchParams({
    q:          query,
    language:   'en',
    sortBy:     'publishedAt',
    pageSize:   '5',
    apiKey,
  });

  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?${params}`,
      { signal: ctrl.signal },
    );
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[fetch-news] NewsAPI ${res.status} for query: ${query.slice(0, 40)}`);
      return [];
    }

    const data = await res.json();
    return (data.articles ?? []).filter(
      (a: NewsAPIArticle) => a.title && !a.title.includes('[Removed]'),
    );
  } catch {
    clearTimeout(timer);
    return [];
  }
}

// ── Gemini 1.5 Flash API 호출 (REST, SDK 불필요) ─────────────────────────────
async function summarizeWithGemini(
  title:       string,
  content:     string,
  sector:      Sector,
  apiKey:      string,
): Promise<GeminiSummary | null> {
  const prompt = `당신은 월가 출신 투자 분석가입니다. 다음 영어 뉴스를 분석하여 아래 JSON 형식으로만 응답하세요 (마크다운 없이, 모든 텍스트는 한국어).

뉴스 제목(영어): ${title}
뉴스 내용(영어): ${content ? content.slice(0, 1500) : '(본문 없음 — 제목만으로 분석)'}
예상 섹터: ${sector}

응답 형식:
{
  "title_ko": "제목을 자연스러운 한국어로 번역",
  "summary": [
    "① 핵심 사실 (아빠도 이해할 쉬운 한국어로)",
    "② 시장/투자에 미칠 직접 영향",
    "③ 투자자 액션 포인트"
  ],
  "impact_score": 1~10 숫자,
  "sentiment": "긍정" | "부정" | "중립",
  "sector": "quantum" | "space" | "robot" | "sto" | "fed" | "general"
}`;

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature:     0.2,
          maxOutputTokens: 600,
        },
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[fetch-news] Gemini ${res.status}`);
      return null;
    }

    const data     = await res.json();
    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // 코드블록 제거 후 JSON 파싱
    const cleaned = rawText
      .replace(/```[\w]*\n?/g, '')
      .trim()
      .slice(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);

    const parsed = JSON.parse(cleaned) as GeminiSummary;

    // 유효성 보정
    return {
      title_ko: parsed.title_ko ?? title,
      summary: Array.isArray(parsed.summary) && parsed.summary.length === 3
        ? parsed.summary as [string, string, string]
        : ['요약 생성 실패', '다시 시도해주세요', ''],
      impact_score: typeof parsed.impact_score === 'number'
        ? Math.min(10, Math.max(1, Math.round(parsed.impact_score)))
        : 5,
      sentiment: ['긍정', '부정', '중립'].includes(parsed.sentiment)
        ? parsed.sentiment
        : '중립',
      sector: parsed.sector ?? sector,
    };
  } catch (err) {
    clearTimeout(timer);
    console.error('[fetch-news] Gemini error:', err);
    return null;
  }
}

// ── 중복 제거 ─────────────────────────────────────────────────────────────────
function deduplicateArticles(
  articles: Array<NewsAPIArticle & { sector: Sector }>,
): Array<NewsAPIArticle & { sector: Sector }> {
  const seen = new Set<string>();
  return articles.filter(a => {
    const key = a.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── GET /api/fetch-news ───────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // ── 보안: CRON_SECRET 검증 ────────────────────────────────────────────────
  const authHeader  = req.headers.get('authorization');
  const cronSecret  = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── 환경 변수 확인 ────────────────────────────────────────────────────────
  const newsApiKey   = process.env.NEWS_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!newsApiKey || !geminiApiKey) {
    return NextResponse.json(
      { error: 'NEWS_API_KEY 또는 GEMINI_API_KEY 환경변수가 설정되지 않았습니다.' },
      { status: 503 },
    );
  }

  const startTime = Date.now();
  console.log('[fetch-news] 뉴스 수집 시작:', new Date().toISOString());

  // ── 1. NewsAPI 병렬 수집 ─────────────────────────────────────────────────
  const rawResults = await Promise.allSettled(
    SECTOR_QUERIES.map(({ q, sector }) =>
      fetchFromNewsAPI(q, newsApiKey).then(articles =>
        articles.map(a => ({ ...a, sector })),
      ),
    ),
  );

  let allArticles: Array<NewsAPIArticle & { sector: Sector }> = [];
  rawResults.forEach(r => {
    if (r.status === 'fulfilled') allArticles = [...allArticles, ...r.value];
  });

  const articles = deduplicateArticles(allArticles).slice(0, 20); // 최대 20개
  console.log(`[fetch-news] 수집된 기사: ${articles.length}개`);

  if (!articles.length) {
    return NextResponse.json({
      success: false,
      message: 'NewsAPI에서 기사를 가져오지 못했습니다.',
    });
  }

  // ── 2. Gemini 요약 + Supabase upsert ────────────────────────────────────
  const db = getAdminClient();
  let savedCount    = 0;
  let summarizedCount = 0;

  // 병렬 처리 (Gemini rate limit 고려: 최대 5개 동시)
  const CHUNK_SIZE = 5;
  for (let i = 0; i < articles.length; i += CHUNK_SIZE) {
    const chunk = articles.slice(i, i + CHUNK_SIZE);

    await Promise.allSettled(
      chunk.map(async article => {
        // Gemini 번역+요약 (본문 없어도 제목만으로 분석)
        const body = [article.description, article.content]
          .filter(Boolean)
          .join(' ');

        const gemini = await summarizeWithGemini(
          article.title, body, article.sector, geminiApiKey,
        );

        if (gemini) summarizedCount++;

        // Supabase upsert (title 중복 시 업데이트)
        const { error } = await db
          .from('daily_news')
          .upsert(
            {
              // 한국어 번역 제목 우선 저장, 없으면 영어 원문
              title:           (gemini?.title_ko ?? article.title).slice(0, 500),
              content_summary: gemini
                ? gemini.summary.join('\n')
                : article.description?.slice(0, 500) ?? null,
              target_sector:   gemini?.sector ?? article.sector,
              impact_score:    gemini?.impact_score ?? null,
              sentiment:       gemini?.sentiment ?? '중립',
              source_url:      article.url,
              source_name:     article.source.name,
              published_at:    article.publishedAt,
            },
            { onConflict: 'title' },
          );

        if (error) {
          console.error('[fetch-news] Supabase upsert error:', error.message);
        } else {
          savedCount++;
        }
      }),
    );

    // Rate limit 방지: 청크 사이 100ms 대기
    if (i + CHUNK_SIZE < articles.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(`[fetch-news] 완료: 저장 ${savedCount}개, 요약 ${summarizedCount}개 (${elapsed}ms)`);

  return NextResponse.json({
    success:        true,
    total:          articles.length,
    saved:          savedCount,
    aiSummarized:   summarizedCount,
    elapsedMs:      elapsed,
    runAt:          new Date().toISOString(),
  });
}
