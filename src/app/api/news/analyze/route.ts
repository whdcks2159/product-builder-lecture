import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 30;

const client = new Anthropic();

export type Sentiment = '긍정' | '부정' | '중립';
export type Sector = '우주' | '로봇' | '양자' | 'STO' | '연준/금리' | '복합' | '기타';
export type MASignal = 'bullish_cross' | 'bearish_cross' | 'support_test' | 'resistance_test' | 'neutral';

export interface AnalysisResult {
  title: string;
  summary: [string, string, string];
  sector: Sector;
  related_sectors: Sector[];
  impact_score: number;           // 1~10
  sentiment: Sentiment;
  ma_signal: MASignal;            // 200/240/365일선 관련 신호
  ma_analysis: string;            // 이동평균선 기술적 해석 (1~2문장)
  chart_hint: string;             // 차트 타점 힌트 (1문장)
  related_tickers: string[];      // 관련 종목/ETF 티커
  risk_warning: string | null;    // 하락 리스크 경고 (부정 뉴스 시)
  analyzedAt: string;
}

const SYSTEM_PROMPT = `당신은 월가 출신 주식 분석가이자 데이터 경제학자입니다.
사용자가 뉴스 텍스트를 제공하면 반드시 아래 JSON 형식으로만 응답하세요.
절대로 마크다운, 코드블록, 추가 텍스트 없이 순수 JSON만 출력합니다.

응답 JSON 스키마:
{
  "title": "뉴스 핵심 제목 (30자 이내, 한국어)",
  "summary": [
    "① 핵심 사실 (아빠도 이해할 쉬운 언어, 전문 용어 배제)",
    "② 시장/투자에 미칠 직접 영향 (구체적 수치 포함 시 명시)",
    "③ 투자자 액션 포인트 (지금 무엇을 주목해야 하나)"
  ],
  "sector": "우주|로봇|양자|STO|연준/금리|복합|기타 중 하나",
  "related_sectors": ["연관 섹터 배열, 없으면 []"],
  "impact_score": 1~10 숫자 (1=무관심, 10=시장 판도 변화급 충격),
  "sentiment": "긍정|부정|중립 중 하나",
  "ma_signal": "bullish_cross|bearish_cross|support_test|resistance_test|neutral 중 하나",
  "ma_analysis": "200일/240일/365일 이동평균선 관점에서 이 뉴스가 기술적으로 어떤 의미인지 1~2문장",
  "chart_hint": "차트상 매수/매도 타점 힌트 1문장 (예: '200일선 재탈환 시 추가 상승 구간 진입')",
  "related_tickers": ["관련 미국 주식 티커 또는 ETF, 최대 5개, 없으면 []"],
  "risk_warning": "하락 리스크가 있다면 1문장 경고, 없으면 null"
}

impact_score 기준:
1~3: 단기 노이즈, 섹터 무관
4~5: 섹터 내 보통 뉴스
6~7: 섹터 방향성에 유의미한 영향
8~9: 분기 트렌드 바꿀 수 있는 큰 뉴스
10: 구조적 패러다임 전환 (IPO, 첫 상용화, 규제 전환 등)

ma_signal 기준:
bullish_cross: 200/240/365일선 상향 돌파 가능성
bearish_cross: 이평선 하향 이탈 위험
support_test: 이평선 지지 테스트 중 (반등 기대)
resistance_test: 이평선 저항 테스트 중 (돌파 실패 가능)
neutral: 이평선과 무관`;

function sanitizeJSON(raw: string): string {
  // 코드블록 제거
  let s = raw.replace(/```[\w]*\n?/g, '').trim();
  // 앞뒤 불필요한 텍스트 제거 (JSON 시작/끝 탐색)
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    s = s.slice(start, end + 1);
  }
  return s;
}

/**
 * POST /api/news/analyze
 * Body: { text: string }
 * Returns: AnalysisResult
 */
export async function POST(req: NextRequest) {
  let text: string;
  try {
    const body = await req.json();
    text = (body.text ?? '').trim();
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  if (!text) {
    return NextResponse.json({ error: '분석할 뉴스 텍스트를 입력해주세요.' }, { status: 400 });
  }

  if (text.length > 8000) {
    return NextResponse.json({ error: '텍스트가 너무 깁니다. 8,000자 이내로 입력해주세요.' }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI 분석 서비스가 설정되지 않았습니다.' }, { status: 503 });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',   // Sonnet: 더 정확한 투자 분석
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `다음 뉴스를 분석해줘:\n\n${text}`,
        },
      ],
    });

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';

    let result: AnalysisResult;
    try {
      const cleaned = sanitizeJSON(rawText);
      const parsed = JSON.parse(cleaned);

      // 필드 유효성 보정
      result = {
        title: parsed.title ?? '제목 없음',
        summary: Array.isArray(parsed.summary) && parsed.summary.length === 3
          ? parsed.summary
          : ['요약 생성 실패', '다시 시도해주세요', ''],
        sector: parsed.sector ?? '기타',
        related_sectors: Array.isArray(parsed.related_sectors) ? parsed.related_sectors : [],
        impact_score: typeof parsed.impact_score === 'number'
          ? Math.min(10, Math.max(1, Math.round(parsed.impact_score)))
          : 5,
        sentiment: ['긍정', '부정', '중립'].includes(parsed.sentiment) ? parsed.sentiment : '중립',
        ma_signal: parsed.ma_signal ?? 'neutral',
        ma_analysis: parsed.ma_analysis ?? '',
        chart_hint: parsed.chart_hint ?? '',
        related_tickers: Array.isArray(parsed.related_tickers) ? parsed.related_tickers.slice(0, 5) : [],
        risk_warning: parsed.risk_warning ?? null,
        analyzedAt: new Date().toISOString(),
      };
    } catch {
      console.error('[analyze] JSON parse error. raw:', rawText.slice(0, 300));
      return NextResponse.json(
        { error: 'AI 응답 파싱 실패. 다시 시도해주세요.' },
        { status: 500 },
      );
    }

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[analyze] Claude API error:', message);
    return NextResponse.json(
      { error: 'AI 분석 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
