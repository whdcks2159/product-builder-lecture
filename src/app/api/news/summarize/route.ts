import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { NewsItem, MomentumTag } from '@/app/api/news/route';

export const maxDuration = 30; // Vercel Pro: 최대 30초

const client = new Anthropic();

export interface SummarizedItem {
  id: string;
  aiSummary: string;
  momentum: MomentumTag;
}

/**
 * POST /api/news/summarize
 * Body: { items: NewsItem[], apiKey?: string }
 * Returns: { summaries: SummarizedItem[] }
 *
 * 보안: SUMMARIZE_API_KEY 환경변수로 보호
 */
export async function POST(req: NextRequest) {
  // API 키 검증
  const authHeader = req.headers.get('authorization');
  const expectedKey = process.env.SUMMARIZE_API_KEY;
  if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let items: NewsItem[];
  try {
    const body = await req.json();
    items = body.items ?? [];
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!items.length) {
    return NextResponse.json({ summaries: [] });
  }

  // 최대 15개 처리 (토큰 비용 제한)
  const batch = items.slice(0, 15);

  const newsText = batch
    .map((item, i) =>
      `[${i + 1}] 카테고리: ${item.category} | 제목: ${item.title} | 내용: ${item.description || '(없음)'}`,
    )
    .join('\n');

  const prompt = `당신은 투자 전문가입니다. 아래 ${batch.length}개의 금융/기술 뉴스를 분석하세요.

각 뉴스마다 다음 JSON 형식으로 응답하세요:
{
  "id": 번호(1~${batch.length}),
  "summary": "① 핵심 사실 한 줄\n② 시장/투자 영향 한 줄\n③ 투자자 액션 포인트 한 줄",
  "momentum": "bullish" | "bearish" | "neutral"
}

모든 응답은 한국어로 작성. momentum 기준:
- bullish: 주가 상승 촉매, 섹터 강세, 계약/승인/돌파 호재
- bearish: 주가 하락 위험, 리스크 확대, 하락/취소/경고
- neutral: 방향성 불명확, 중립적 정보

뉴스 목록:
${newsText}

JSON 배열로만 응답 (마크다운, 코드블록 없이):`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001', // 빠르고 비용 효율적
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';

    // JSON 파싱 (모델이 배열을 반환)
    let parsed: Array<{ id: number; summary: string; momentum: string }> = [];
    try {
      // 마크다운 코드블록 제거 후 파싱
      const cleaned = rawText.replace(/```[\w]*\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // 파싱 실패 시 빈 배열 반환 (폴백 데이터 유지)
      console.error('[summarize] JSON parse failed:', rawText.slice(0, 200));
    }

    const summaries: SummarizedItem[] = batch.map((item, i) => {
      const found = parsed.find(p => p.id === i + 1);
      return {
        id: item.id,
        aiSummary: found?.summary ?? '',
        momentum: (found?.momentum as MomentumTag) ?? item.momentum,
      };
    });

    return NextResponse.json({ summaries });
  } catch (err) {
    console.error('[summarize] Claude API error:', err);
    return NextResponse.json(
      { error: 'AI summary failed', summaries: [] },
      { status: 500 },
    );
  }
}
