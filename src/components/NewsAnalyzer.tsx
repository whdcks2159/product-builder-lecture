'use client';

import { useState, useRef } from 'react';
import {
  Search, Loader2, TrendingUp, TrendingDown, Minus,
  AlertTriangle, ChevronDown, ChevronUp, Copy, Check,
  Rocket, Bot, Atom, Landmark, Building2, Layers, HelpCircle,
  Target, BarChart2, Zap, ShieldAlert,
} from 'lucide-react';
import type { AnalysisResult, Sector, MASignal, Sentiment } from '@/app/api/news/analyze/route';

// ── 상수 ───────────────────────────────────────────────────────────────────────
const SECTOR_CFG: Record<Sector, { icon: typeof Rocket; color: string; bg: string }> = {
  '우주':      { icon: Rocket,    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  '로봇':      { icon: Bot,       color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  '양자':      { icon: Atom,      color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  'STO':       { icon: Landmark,  color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  '연준/금리': { icon: Building2, color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  '복합':      { icon: Layers,    color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  '기타':      { icon: HelpCircle,color: '#888888', bg: 'rgba(136,136,136,0.1)' },
};

const SENTIMENT_CFG: Record<Sentiment, { Icon: typeof TrendingUp; color: string; bg: string; border: string; label: string }> = {
  긍정: { Icon: TrendingUp,   color: '#00d084', bg: 'rgba(0,208,132,0.08)',  border: 'rgba(0,208,132,0.3)',  label: '긍정' },
  부정: { Icon: TrendingDown, color: '#ff4d4d', bg: 'rgba(255,77,77,0.08)',  border: 'rgba(255,77,77,0.3)',  label: '부정' },
  중립: { Icon: Minus,        color: '#888888', bg: 'rgba(136,136,136,0.08)',border: 'rgba(136,136,136,0.2)',label: '중립' },
};

const MA_SIGNAL_CFG: Record<MASignal, { label: string; color: string; desc: string }> = {
  bullish_cross:    { label: '이평선 상향 돌파', color: '#00d084', desc: '200/240/365일선 위로 올라설 가능성' },
  bearish_cross:    { label: '이평선 하향 이탈', color: '#ff4d4d', desc: '주요 이평선 아래로 떨어질 위험' },
  support_test:     { label: '이평선 지지 테스트', color: '#f59e0b', desc: '이평선에서 반등 기대 구간' },
  resistance_test:  { label: '이평선 저항 테스트', color: '#a78bfa', desc: '이평선이 저항선으로 작용 중' },
  neutral:          { label: '이평선 무관', color: '#555555', desc: '기술적 이평선 신호 없음' },
};

const SAMPLE_NEWS = [
  {
    label: '우주 예시',
    text: 'Rocket Lab secured a $515 million contract with NASA for its ESCAPADE mission to Mars, marking the largest government contract in the company\'s history. The deal involves two Electron rockets and is scheduled for launch in 2026. RKLB shares surged 18% in after-hours trading as investors cheered the contract win. Analysts at Morgan Stanley raised their price target from $8 to $14, citing strong government demand for small-lift launch vehicles.',
  },
  {
    label: '양자 예시',
    text: 'IonQ announced a breakthrough in quantum error correction, achieving a logical error rate below 1% for the first time. This milestone brings commercial quantum computing significantly closer to reality. The company also revealed partnerships with three major banks for portfolio optimization trials in 2026. IONQ stock has been testing its 200-day moving average at $12.40, and this announcement could provide the catalyst needed for a sustained breakout.',
  },
  {
    label: '연준 예시',
    text: 'Federal Reserve Chair Jerome Powell signaled that the central bank is in no hurry to cut interest rates, citing persistent inflation pressures despite recent progress. In remarks at the Economic Club of Washington, Powell stated that policy will remain restrictive until there is greater confidence inflation is sustainably moving toward the 2% target. The S&P 500 fell 1.2% following the comments, with the index now testing its 200-day moving average at 5,750.',
  },
];

// ── 점수 게이지 ────────────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const color =
    score >= 8 ? '#ff4d4d' :
    score >= 6 ? '#f59e0b' :
    score >= 4 ? '#00d084' : '#555555';

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-[10px]" style={{ color: '#666666' }}>중요도</span>
        <span className="text-2xl font-black leading-none" style={{ color }}>
          {score}
          <span className="text-xs font-normal ml-0.5" style={{ color: '#555555' }}>/10</span>
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
      <div className="flex justify-between text-[9px] mt-1" style={{ color: '#333333' }}>
        <span>낮음</span>
        <span>보통</span>
        <span>높음</span>
        <span>매우 높음</span>
      </div>
    </div>
  );
}

// ── 결과 카드 ──────────────────────────────────────────────────────────────────
function ResultCard({ result }: { result: AnalysisResult }) {
  const [showTickers, setShowTickers] = useState(false);
  const [copied, setCopied] = useState(false);

  const sectorCfg = SECTOR_CFG[result.sector] ?? SECTOR_CFG['기타'];
  const sentCfg   = SENTIMENT_CFG[result.sentiment];
  const maCfg     = MA_SIGNAL_CFG[result.ma_signal];

  const copyJSON = async () => {
    const json = JSON.stringify({
      title: result.title,
      summary: result.summary,
      sector: result.sector,
      impact_score: result.impact_score,
      sentiment: result.sentiment,
    }, null, 2);
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      {/* ── 제목 + 섹터 ─────────────────────────────────────────────────────── */}
      <div
        className="rounded-xl p-4"
        style={{ background: '#111111', border: '1px solid #222222' }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* 섹터 아이콘 */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: sectorCfg.bg, border: `1px solid ${sectorCfg.color}30` }}
          >
            <sectorCfg.icon size={18} style={{ color: sectorCfg.color }} />
          </div>
          {/* 제목 */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] mb-1" style={{ color: sectorCfg.color }}>
              {result.sector}
              {result.related_sectors.length > 0 && (
                <span style={{ color: '#444444' }}>
                  {' '}· {result.related_sectors.join(' · ')}
                </span>
              )}
            </p>
            <h3 className="text-sm font-bold leading-snug" style={{ color: '#f0f0f0' }}>
              {result.title}
            </h3>
          </div>
          {/* JSON 복사 버튼 */}
          <button
            onClick={copyJSON}
            className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-opacity hover:opacity-60"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#555555' }}
          >
            {copied ? <Check size={10} style={{ color: '#00d084' }} /> : <Copy size={10} />}
            {copied ? '복사됨' : 'JSON'}
          </button>
        </div>

        {/* 감성 + 중요도 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: sentCfg.bg, border: `1px solid ${sentCfg.border}`, color: sentCfg.color }}
          >
            <sentCfg.Icon size={9} strokeWidth={2.5} />
            {sentCfg.label}
          </span>
          <span className="text-[10px]" style={{ color: '#444444' }}>
            {new Date(result.analyzedAt).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })} 분석
          </span>
        </div>
      </div>

      {/* ── 3줄 요약 ─────────────────────────────────────────────────────────── */}
      <div
        className="rounded-xl p-4"
        style={{ background: '#111111', border: '1px solid #222222' }}
      >
        <div className="flex items-center gap-1.5 mb-3">
          <Search size={12} style={{ color: '#888888' }} />
          <span className="text-xs font-semibold" style={{ color: '#888888' }}>AI 3줄 요약</span>
          <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded" style={{ background: '#1a1a1a', color: '#555555' }}>
            아빠도 이해하는 쉬운 설명
          </span>
        </div>
        <div className="space-y-2.5">
          {result.summary.map((line, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black mt-0.5"
                style={{
                  background: i === 0 ? 'rgba(0,208,132,0.15)' : i === 1 ? 'rgba(59,130,246,0.15)' : 'rgba(167,139,250,0.15)',
                  color: i === 0 ? '#00d084' : i === 1 ? '#60a5fa' : '#a78bfa',
                }}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: '#d0d0d0' }}>
                {line.replace(/^[①②③]\s*/, '')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 중요도 스코어 ────────────────────────────────────────────────────── */}
      <div
        className="rounded-xl p-4"
        style={{ background: '#111111', border: '1px solid #222222' }}
      >
        <div className="flex items-center gap-1.5 mb-3">
          <BarChart2 size={12} style={{ color: '#888888' }} />
          <span className="text-xs font-semibold" style={{ color: '#888888' }}>중요도 스코어</span>
        </div>
        <ScoreGauge score={result.impact_score} />
      </div>

      {/* ── 차트 타점 / 이평선 분석 ─────────────────────────────────────────── */}
      <div
        className="rounded-xl p-4"
        style={{ background: '#111111', border: '1px solid #222222' }}
      >
        <div className="flex items-center gap-1.5 mb-3">
          <Target size={12} style={{ color: '#888888' }} />
          <span className="text-xs font-semibold" style={{ color: '#888888' }}>차트 타점 힌트</span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-semibold ml-auto"
            style={{
              background: `${maCfg.color}15`,
              border: `1px solid ${maCfg.color}35`,
              color: maCfg.color,
            }}
          >
            {maCfg.label}
          </span>
        </div>

        {/* MA 분석 */}
        {result.ma_analysis && (
          <div
            className="flex items-start gap-2 p-3 rounded-lg mb-3"
            style={{ background: '#0d0d0d', border: `1px solid ${maCfg.color}20` }}
          >
            <Zap size={12} className="flex-shrink-0 mt-0.5" style={{ color: maCfg.color }} />
            <p className="text-xs leading-relaxed" style={{ color: '#888888' }}>
              {result.ma_analysis}
            </p>
          </div>
        )}

        {/* 차트 힌트 */}
        {result.chart_hint && (
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ color: '#555555' }}>
              ▶
            </span>
            <p className="text-xs font-medium" style={{ color: '#c0c0c0' }}>
              {result.chart_hint}
            </p>
          </div>
        )}
      </div>

      {/* ── 관련 티커 ────────────────────────────────────────────────────────── */}
      {result.related_tickers.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{ background: '#111111', border: '1px solid #222222' }}
        >
          <button
            className="flex items-center justify-between w-full"
            onClick={() => setShowTickers(v => !v)}
          >
            <div className="flex items-center gap-1.5">
              <Layers size={12} style={{ color: '#888888' }} />
              <span className="text-xs font-semibold" style={{ color: '#888888' }}>관련 종목/ETF</span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{ background: '#1a1a1a', color: '#555555' }}
              >
                {result.related_tickers.length}개
              </span>
            </div>
            {showTickers
              ? <ChevronUp size={14} style={{ color: '#555555' }} />
              : <ChevronDown size={14} style={{ color: '#555555' }} />
            }
          </button>

          {showTickers && (
            <div className="flex flex-wrap gap-2 mt-3">
              {result.related_tickers.map(ticker => (
                <a
                  key={ticker}
                  href={`https://finance.yahoo.com/quote/${ticker}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
                  style={{
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    color: '#60a5fa',
                  }}
                >
                  ${ticker}
                </a>
              ))}
              <p className="w-full text-[10px] mt-1" style={{ color: '#333333' }}>
                ↑ 클릭 시 Yahoo Finance로 이동 (투자 조언 아님)
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── 리스크 경고 ──────────────────────────────────────────────────────── */}
      {result.risk_warning && (
        <div
          className="flex items-start gap-2.5 rounded-xl p-4"
          style={{ background: 'rgba(255,77,77,0.06)', border: '1px solid rgba(255,77,77,0.2)' }}
        >
          <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#ff4d4d' }} />
          <p className="text-xs leading-relaxed" style={{ color: '#ff8080' }}>
            <span className="font-bold">리스크 주의: </span>
            {result.risk_warning}
          </p>
        </div>
      )}

      {/* 면책 조항 */}
      <p className="text-[10px] text-center leading-relaxed" style={{ color: '#2a2a2a' }}>
        본 분석은 Claude AI(Anthropic)가 생성한 정보 제공용 콘텐츠이며 투자 조언이 아닙니다.
      </p>
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────────
export default function NewsAnalyzer() {
  const [text, setText]           = useState('');
  const [result, setResult]       = useState<AnalysisResult | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const textareaRef               = useRef<HTMLTextAreaElement>(null);

  const charCount = text.length;
  const isValid   = charCount >= 50 && charCount <= 8000;

  const analyze = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/news/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '분석에 실패했습니다.');
      } else {
        setResult(data);
        // 결과 영역으로 스크롤
        setTimeout(() => {
          document.getElementById('analyzer-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sampleText: string) => {
    setText(sampleText);
    textareaRef.current?.focus();
  };

  return (
    <div className="space-y-4">
      {/* ── 입력 영역 ─────────────────────────────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#111111', border: '1px solid #222222' }}
      >
        {/* 툴바 */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ borderBottom: '1px solid #1a1a1a' }}
        >
          <span className="text-xs font-semibold" style={{ color: '#888888' }}>
            뉴스 텍스트 입력
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[10px]"
              style={{ color: charCount > 8000 ? '#ff4d4d' : charCount >= 50 ? '#00d084' : '#444444' }}
            >
              {charCount.toLocaleString()} / 8,000자
            </span>
            {text && (
              <button
                onClick={() => { setText(''); setResult(null); setError(''); }}
                className="text-[10px] px-2 py-0.5 rounded transition-opacity hover:opacity-60"
                style={{ background: '#1a1a1a', color: '#555555' }}
              >
                초기화
              </button>
            )}
          </div>
        </div>

        {/* 텍스트 영역 */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="분석할 뉴스 기사 전문 또는 핵심 내용을 붙여넣으세요.
영문/한국어 모두 가능합니다. (최소 50자)

예시) Rocket Lab secured a $515 million contract with NASA..."
          rows={7}
          className="w-full resize-none p-4 text-sm leading-relaxed outline-none"
          style={{
            background: 'transparent',
            color: '#e0e0e0',
            caretColor: '#60a5fa',
          }}
        />

        {/* 샘플 버튼 */}
        <div
          className="px-4 py-2.5 flex items-center gap-2"
          style={{ borderTop: '1px solid #1a1a1a' }}
        >
          <span className="text-[10px]" style={{ color: '#444444' }}>예시 로드:</span>
          {SAMPLE_NEWS.map(sample => (
            <button
              key={sample.label}
              onClick={() => loadSample(sample.text)}
              className="text-[10px] px-2 py-1 rounded-lg transition-opacity hover:opacity-60"
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666666' }}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 분석 버튼 ─────────────────────────────────────────────────────────── */}
      <button
        onClick={analyze}
        disabled={!isValid || loading}
        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
        style={{
          background: isValid && !loading
            ? 'linear-gradient(135deg, #ffffff, #d0d0d0)'
            : '#1a1a1a',
          color: isValid && !loading ? '#000000' : '#444444',
          border: isValid && !loading ? 'none' : '1px solid #2a2a2a',
          cursor: isValid && !loading ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Claude AI 분석 중...
          </>
        ) : (
          <>
            <Search size={15} />
            {!text ? '뉴스를 입력하세요' :
             charCount < 50 ? `${50 - charCount}자 더 입력하세요` :
             'AI 분석 시작'}
          </>
        )}
      </button>

      {/* ── 에러 ───────────────────────────────────────────────────────────────── */}
      {error && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{ background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.2)', color: '#ff8080' }}
        >
          <AlertTriangle size={14} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── 로딩 스켈레톤 ─────────────────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-3">
          {[80, 120, 70, 90].map((h, i) => (
            <div
              key={i}
              className="rounded-xl animate-pulse"
              style={{ height: h, background: '#111111' }}
            />
          ))}
          <p className="text-center text-xs" style={{ color: '#333333' }}>
            Claude Sonnet이 투자 관점에서 뉴스를 분석하고 있습니다...
          </p>
        </div>
      )}

      {/* ── 결과 ───────────────────────────────────────────────────────────────── */}
      {result && !loading && (
        <div id="analyzer-result">
          <div
            className="flex items-center gap-2 mb-3 px-1"
          >
            <div className="h-px flex-1" style={{ background: '#222222' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#444444' }}>
              분석 완료
            </span>
            <div className="h-px flex-1" style={{ background: '#222222' }} />
          </div>
          <ResultCard result={result} />
        </div>
      )}
    </div>
  );
}
