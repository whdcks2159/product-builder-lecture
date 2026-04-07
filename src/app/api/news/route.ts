import { NextResponse } from 'next/server';
import { setNewsCache, getNewsCache } from '@/lib/news-cache';
import type { NewsCache } from '@/lib/news-cache';

export const revalidate = 1800; // 30분 캐시

export type MomentumTag = 'bullish' | 'bearish' | 'neutral';

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
  category: 'space' | 'robot' | 'quantum' | 'sto' | 'fed' | 'general';
  momentum: MomentumTag;
  aiSummary?: string;    // AI 3줄 요약 (크론 캐시에서 주입)
  maPriority: boolean;   // 200/240/365일 이평 관련 섹터 뉴스
}

// ── 모멘텀 키워드 스코어링 ──────────────────────────────────────────────────────
const BULLISH_KW = [
  'surges','record','breakthrough','launches','wins contract','rises','jumps',
  'beats','approved','milestone','new high','rally','upgrade','expand',
  '급등','돌파','신고점','상승','수주','승인','호재','반등','강세',
];
const BEARISH_KW = [
  'drops','falls','crash','warning','risk','decline','layoff','miss',
  'concerns','delay','cancel','downgrade','lower','recession','tariff war',
  '급락','하락','경고','위기','손실','적자','침체','약세','우려',
];
// 이동평균선 관련 섹터 키워드 (200/240/365일선 근처 종목과 관련될 가능성 높은 뉴스)
const MA_KEYWORDS = [
  'RKLB','Rocket Lab','AST SpaceMobile','ASTS','IONQ','IonQ',
  'Rigetti','RGTI','D-Wave','QBTS','NVDA','NVIDIA',
  'ARKK','ARKQ','XLK','SMH','QQQ','SPY',
  'moving average','200-day','200MA','technical','support level','resistance',
  'oversold','RSI','breakout','breakdown',
];

function scoreMomentum(text: string): MomentumTag {
  const t = text.toLowerCase();
  const bull = BULLISH_KW.filter(k => t.includes(k.toLowerCase())).length;
  const bear = BEARISH_KW.filter(k => t.includes(k.toLowerCase())).length;
  if (bull > bear) return 'bullish';
  if (bear > bull) return 'bearish';
  return 'neutral';
}

function checkMaPriority(text: string): boolean {
  const t = text.toLowerCase();
  return MA_KEYWORDS.some(k => t.toLowerCase().includes(k.toLowerCase()));
}

function makeId(title: string, pubDate: string): string {
  return Buffer.from(`${title}${pubDate}`).toString('base64').slice(0, 16);
}

// ── RSS 파서 ────────────────────────────────────────────────────────────────────
function parseRSS(
  xml: string,
  source: string,
  category: NewsItem['category'],
  limit = 6,
): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const raw = match[1];

    const extract = (tag: string) => {
      const cd = raw.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
      if (cd) return cd[1].trim();
      const pl = raw.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return pl ? pl[1].replace(/<[^>]+>/g, '').trim() : '';
    };

    const title = extract('title');
    const link =
      extract('link') ||
      raw.match(/<link\s+href="([^"]+)"/)?.[1] ||
      '';
    const pubDate = extract('pubDate') || extract('dc:date') || new Date().toUTCString();
    const description = extract('description').slice(0, 250);

    if (title && link) {
      const combined = `${title} ${description}`;
      items.push({
        id: makeId(title, pubDate),
        title,
        link,
        pubDate,
        description,
        source,
        category,
        momentum: scoreMomentum(combined),
        maPriority: checkMaPriority(combined),
      });
    }
    if (items.length >= limit) break;
  }
  return items;
}

// ── RSS 소스 정의 ───────────────────────────────────────────────────────────────
const RSS_SOURCES = [
  // 우주항공
  {
    url: 'https://www.nasa.gov/news-release/feed/',
    source: 'NASA',
    category: 'space' as const,
  },
  {
    url: 'https://spacenews.com/feed/',
    source: 'SpaceNews',
    category: 'space' as const,
  },
  // 로봇
  {
    url: 'https://spectrum.ieee.org/feeds/topic/robotics.rss',
    source: 'IEEE Spectrum',
    category: 'robot' as const,
  },
  {
    url: 'https://techcrunch.com/tag/robotics/feed/',
    source: 'TechCrunch',
    category: 'robot' as const,
  },
  // 양자컴퓨팅
  {
    url: 'https://feeds.feedburner.com/TheHackersNews',
    source: 'Hacker News',
    category: 'quantum' as const,
  },
  {
    url: 'https://quantumcomputingreport.com/feed/',
    source: 'QC Report',
    category: 'quantum' as const,
  },
  // STO / RWA
  {
    url: 'https://cointelegraph.com/rss',
    source: 'CoinTelegraph',
    category: 'sto' as const,
  },
  {
    url: 'https://decrypt.co/feed',
    source: 'Decrypt',
    category: 'sto' as const,
  },
  // 연준 / 금리
  {
    url: 'https://www.federalreserve.gov/feeds/press_all.xml',
    source: 'Federal Reserve',
    category: 'fed' as const,
  },
  {
    url: 'https://feeds.marketwatch.com/marketwatch/topstories/',
    source: 'MarketWatch',
    category: 'fed' as const,
  },
];

// ── 폴백 뉴스 (피드 불가 시) ────────────────────────────────────────────────────
const FALLBACK: NewsItem[] = [
  {
    id: 'fb-001', title: 'SpaceX Starlink, 글로벌 구독자 700만 돌파 — IPO 밸류에이션 상향 기대',
    link: '#', pubDate: new Date(Date.now() - 3_600_000).toUTCString(),
    description: 'Starlink 위성 인터넷이 전 세계 700만 구독자를 넘어서며 연간 매출 70억 달러 전망.',
    source: 'NexusInsight', category: 'space', momentum: 'bullish', maPriority: false,
    aiSummary: '① Starlink 구독자 700만 돌파로 SpaceX IPO 기대감 상승\n② 위성 통신 섹터 전반에 긍정 신호\n③ 관련 ETF(ARKQ 등) 단기 반등 모멘텀 주목',
  },
  {
    id: 'fb-002', title: 'Rocket Lab, NASA 달 탐사 계약 5억 달러 수주 — RKLB 200일선 돌파 시도',
    link: '#', pubDate: new Date(Date.now() - 7_200_000).toUTCString(),
    description: 'CLPS 프로그램 일환으로 5억 달러 규모 달 화물 운송 계약 수주.',
    source: 'NexusInsight', category: 'space', momentum: 'bullish', maPriority: true,
    aiSummary: '① RKLB 5억 달러 NASA 계약으로 매출 가시성 급상승\n② 기술적으로 200일 이평선 돌파 시도 중 — 핵심 저항 구간\n③ 우주 소형 발사체 경쟁 심화 속 차별화 포인트 확보',
  },
  {
    id: 'fb-003', title: 'Boston Dynamics, 완전 자율 산업 로봇 Spot 4.0 발표 — 물류 시장 공략',
    link: '#', pubDate: new Date(Date.now() - 10_800_000).toUTCString(),
    description: '새 버전 Spot은 AI 비전 기반 완전 자율 작업이 가능하며 국내 물류센터 파일럿 시작.',
    source: 'NexusInsight', category: 'robot', momentum: 'bullish', maPriority: false,
    aiSummary: '① 산업 로봇의 AI 자율화가 빠르게 상용화 단계 진입\n② 물류/제조 자동화 테마 강세 기조 유지\n③ 관련 ETF(ROBO, BOTZ) 중기 상승 모멘텀 유효',
  },
  {
    id: 'fb-004', title: 'Figure AI, BMW 공장 로봇 배치 확대 — 시리즈B 2억 달러 클로징',
    link: '#', pubDate: new Date(Date.now() - 14_400_000).toUTCString(),
    description: '휴머노이드 로봇 스타트업 Figure AI가 BMW와 공장 자동화 파트너십 확장.',
    source: 'NexusInsight', category: 'robot', momentum: 'bullish', maPriority: false,
    aiSummary: '① 휴머노이드 로봇 상용화 속도 예상보다 빠름\n② 제조업체들의 자동화 투자 사이클 진입 확인\n③ 비상장사이나 관련 공개 기업(TSLA, ABB) 간접 수혜 주목',
  },
  {
    id: 'fb-005', title: 'IBM Quantum Condor 1,121 큐비트 — 금융 포트폴리오 최적화 2027 상용화 전망',
    link: '#', pubDate: new Date(Date.now() - 18_000_000).toUTCString(),
    description: 'IBM Quantum Condor 칩이 기존 대비 10배 오류율 감소 달성.',
    source: 'NexusInsight', category: 'quantum', momentum: 'bullish', maPriority: false,
    aiSummary: '① 양자 오류 수정 기술 임계점 근접 — 실용화 타임라인 단축\n② 금융 최적화 첫 상용 적용은 2027년 예상, 관련주 중장기 모멘텀\n③ IonQ·Rigetti 등 퓨어플레이 양자주 기술 진척 비교 필요',
  },
  {
    id: 'fb-006', title: 'IonQ, NSA 양자 네트워크 계약 수주 — IONQ 주가 240일선 지지 확인',
    link: '#', pubDate: new Date(Date.now() - 21_600_000).toUTCString(),
    description: '미국 국가안보국과의 계약으로 IonQ 매출 기반 강화.',
    source: 'NexusInsight', category: 'quantum', momentum: 'bullish', maPriority: true,
    aiSummary: '① IONQ 240일 이평선 지지 구간에서 정부 계약 호재 — 강한 지지 신호\n② 양자 섹터 내 정부 수요 증가는 펀더멘털 개선 지속 확인\n③ RSI 과매도 구간 탈출 중 — 단기 바운스 가능성 높음',
  },
  {
    id: 'fb-007', title: 'BlackRock BUIDL 온체인 펀드 5억 달러 돌파 — 기관 RWA 수요 급증',
    link: '#', pubDate: new Date(Date.now() - 25_200_000).toUTCString(),
    description: 'BlackRock의 토큰화 머니마켓 펀드 BUIDL이 5억 달러를 넘어섰음.',
    source: 'NexusInsight', category: 'sto', momentum: 'bullish', maPriority: false,
    aiSummary: '① 전통 자산운용사의 온체인 진입 본격화 — RWA 시장 구조적 성장\n② 토큰화 규제 불확실성 감소가 기관 자금 유입 견인\n③ Ondo, Centrifuge 등 퓨어플레이 RWA 프로토콜 수혜 지속',
  },
  {
    id: 'fb-008', title: 'SEC, STO 발행 새 가이드라인 발표 — 토큰증권 합법화 로드맵 공개',
    link: '#', pubDate: new Date(Date.now() - 28_800_000).toUTCString(),
    description: 'SEC가 증권형 토큰 발행에 관한 새 규정 초안을 공개했음.',
    source: 'NexusInsight', category: 'sto', momentum: 'bullish', maPriority: false,
    aiSummary: '① STO 규제 명확화는 기관 참여 확대의 결정적 촉매\n② 단기적으로 규제 불확실성 해소로 RWA 관련 토큰 가격 상승 압력\n③ 실물자산 토큰화 플랫폼들의 IPO/상장 기대감 재점화',
  },
  {
    id: 'fb-009', title: 'Fed, 기준금리 3.5~3.75% 동결 — Musalem "당분간 유지 적절"',
    link: '#', pubDate: new Date(Date.now() - 32_400_000).toUTCString(),
    description: '연준 FOMC 3월 회의에서 기준금리 동결 결정. 위원들 인플레이션 지속 우려 표명.',
    source: 'Federal Reserve', category: 'fed', momentum: 'neutral', maPriority: true,
    aiSummary: '① 금리 동결 장기화 시나리오 강화 — 성장주 밸류에이션 부담 지속\n② 나스닥 200일선 하회 상태에서 촉매 부재 — 추가 하락 방어 실패 시 위험\n③ 4월 CPI 결과가 다음 분기 방향성 결정할 핵심 변수',
  },
  {
    id: 'fb-010', title: '3월 고용 178,000명 증가 — 실업률 4.3% 상승, 엇갈린 신호',
    link: '#', pubDate: new Date(Date.now() - 36_000_000).toUTCString(),
    description: '3월 비농업 고용 178,000명으로 예상 상회했지만 실업률 소폭 상승.',
    source: 'MarketWatch', category: 'fed', momentum: 'neutral', maPriority: true,
    aiSummary: '① 고용 서프라이즈로 조기 금리 인하 기대 다시 낮아짐\n② 실업률 4.3% 상승은 소비 둔화 시작의 선행 신호일 수 있음\n③ S&P 500 200일선 지지 여부 — 이번 주 CPI 전까지 관망 전략 유효',
  },
];

// ── RSS fetch ──────────────────────────────────────────────────────────────────
async function fetchRSS(src: (typeof RSS_SOURCES)[0]): Promise<NewsItem[]> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(src.url, {
      headers: { 'User-Agent': 'NexusInsight/2.0' },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSS(xml, src.source, src.category);
  } catch {
    return [];
  }
}

// ── GET ────────────────────────────────────────────────────────────────────────
export async function GET() {
  // 캐시 히트
  const cached = getNewsCache();
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=300' },
    });
  }

  // 실시간 RSS 수집
  const results = await Promise.allSettled(RSS_SOURCES.map(fetchRSS));
  let liveItems: NewsItem[] = [];
  results.forEach(r => {
    if (r.status === 'fulfilled') liveItems = [...liveItems, ...r.value];
  });

  // MA 우선순위 정렬 → 시간 순
  liveItems.sort((a, b) => {
    if (a.maPriority !== b.maPriority) return a.maPriority ? -1 : 1;
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  const isLive = liveItems.length >= 5;
  const items = isLive ? liveItems.slice(0, 20) : FALLBACK;

  const payload: NewsCache = {
    items,
    fetchedAt: new Date().toISOString(),
    source: isLive ? 'live' : 'curated',
  };

  setNewsCache(payload);

  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=300' },
  });
}
