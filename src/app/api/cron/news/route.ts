import { NextRequest, NextResponse } from 'next/server';
import { setNewsCache } from '@/lib/news-cache';
import type { NewsCache } from '@/lib/news-cache';
import type { NewsItem } from '@/app/api/news/route';

export const maxDuration = 60; // Vercel Cron 최대 실행 시간

/**
 * GET /api/cron/news
 *
 * Vercel Cron Job 스케줄 (vercel.json):
 *   - 한국 오전 8시  = UTC 23:00 (전날) → "0 23 * * *"
 *   - 한국 오후 4시  = UTC 07:00       → "0 7 * * *"
 *
 * 보안: CRON_SECRET 환경변수로 보호
 *   Vercel이 Authorization: Bearer <CRON_SECRET> 헤더를 자동 추가합니다.
 */
export async function GET(req: NextRequest) {
  // Vercel Cron 또는 수동 트리거 인증
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  console.log('[cron/news] 뉴스 수집 시작:', new Date().toISOString());

  try {
    // 1. 뉴스 피드 가져오기 (내부 API 재사용)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const newsRes = await fetch(`${baseUrl}/api/news`, {
      cache: 'no-store', // 항상 신선한 데이터
    });

    if (!newsRes.ok) {
      throw new Error(`News API failed: ${newsRes.status}`);
    }

    const newsData = await newsRes.json();
    const items: NewsItem[] = newsData.items ?? [];

    console.log(`[cron/news] ${items.length}개 뉴스 수집 완료`);

    // 2. AI 요약 호출 (SUMMARIZE_API_KEY가 있을 때만)
    let summarizedItems = items;
    if (process.env.ANTHROPIC_API_KEY && process.env.SUMMARIZE_API_KEY) {
      try {
        const summarizeRes = await fetch(`${baseUrl}/api/news/summarize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SUMMARIZE_API_KEY}`,
          },
          body: JSON.stringify({ items: items.slice(0, 15) }),
        });

        if (summarizeRes.ok) {
          const { summaries } = await summarizeRes.json();

          // AI 요약 결과를 뉴스 아이템에 병합
          summarizedItems = items.map(item => {
            const summary = summaries?.find(
              (s: { id: string; aiSummary: string; momentum: string }) => s.id === item.id,
            );
            if (summary) {
              return {
                ...item,
                aiSummary: summary.aiSummary,
                momentum: summary.momentum,
              };
            }
            return item;
          });

          console.log(`[cron/news] AI 요약 ${summaries?.length ?? 0}개 완료`);
        }
      } catch (aiErr) {
        console.error('[cron/news] AI 요약 실패 (뉴스는 정상 저장):', aiErr);
      }
    }

    // 3. 캐시 업데이트
    const cache: NewsCache = {
      items: summarizedItems,
      fetchedAt: new Date().toISOString(),
      source: newsData.source as 'live' | 'curated',
    };
    setNewsCache(cache);

    const elapsed = Date.now() - startTime;
    console.log(`[cron/news] 완료 (${elapsed}ms)`);

    return NextResponse.json({
      success: true,
      itemCount: summarizedItems.length,
      aiSummarized: summarizedItems.filter(i => i.aiSummary).length,
      source: cache.source,
      fetchedAt: cache.fetchedAt,
      elapsedMs: elapsed,
    });
  } catch (err) {
    console.error('[cron/news] 오류:', err);
    return NextResponse.json(
      { error: String(err), success: false },
      { status: 500 },
    );
  }
}
