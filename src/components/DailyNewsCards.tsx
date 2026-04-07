// 서버 컴포넌트 — ISR로 Supabase 직접 조회
import { getSupabase } from '@/lib/supabase';
import type { DailyNews, Sector, Sentiment } from '@/lib/supabase';
import Link from 'next/link';
import {
  Rocket, Bot, Atom, Landmark, Building2, HelpCircle,
  TrendingUp, TrendingDown, Minus, ExternalLink, Clock,
} from 'lucide-react';

// ── 섹터 설정 ──────────────────────────────────────────────────────────────────
const SECTOR_CFG: Record<Sector, { label: string; Icon: typeof Rocket; color: string }> = {
  quantum: { label: '양자컴퓨팅', Icon: Atom,      color: '#a78bfa' },
  space:   { label: '우주항공',   Icon: Rocket,    color: '#f59e0b' },
  robot:   { label: '로봇',       Icon: Bot,       color: '#06b6d4' },
  sto:     { label: 'STO/RWA',   Icon: Landmark,  color: '#3b82f6' },
  fed:     { label: '연준/금리',  Icon: Building2, color: '#f87171' },
  general: { label: '일반',       Icon: HelpCircle,color: '#94a3b8' },
};

// ── 감성 설정 ──────────────────────────────────────────────────────────────────
const SENTIMENT_CFG: Record<Sentiment, {
  Icon: typeof TrendingUp; color: string; bg: string; label: string;
}> = {
  긍정: { Icon: TrendingUp,   color: '#34d399', bg: 'rgba(52,211,153,0.08)',  label: '긍정' },
  부정: { Icon: TrendingDown, color: '#f87171', bg: 'rgba(248,113,113,0.08)', label: '부정' },
  중립: { Icon: Minus,        color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', label: '중립' },
};

// ── 점수 색상 ──────────────────────────────────────────────────────────────────
function scoreColor(score: number | null): string {
  if (!score) return '#94a3b8';
  if (score >= 8) return '#f87171';
  if (score >= 6) return '#fbbf24';
  return '#34d399';
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

// ── 빈 상태 ───────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="text-center py-14 px-4">
      <div className="text-4xl mb-3">📭</div>
      <p className="text-sm font-semibold text-slate-400">아직 수집된 뉴스가 없습니다</p>
      <p className="text-xs text-slate-600 mt-1">크론잡이 실행되면 자동으로 채워집니다</p>
    </div>
  );
}

// ── 개별 카드 ──────────────────────────────────────────────────────────────────
function NewsCard({ item }: { item: DailyNews }) {
  const sector  = SECTOR_CFG[item.target_sector] ?? SECTOR_CFG.general;
  const sent    = SENTIMENT_CFG[item.sentiment]  ?? SENTIMENT_CFG['중립'];
  const lines   = (item.content_summary ?? '').split('\n').filter(Boolean);
  const score   = item.impact_score;

  return (
    <article className="group relative flex flex-col rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12]">
      {/* 상단 컬러 바 */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${sector.color}, transparent)` }} />

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* 메타 행 */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 섹터 배지 */}
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: `${sector.color}18`,
              border:     `1px solid ${sector.color}35`,
              color:       sector.color,
            }}
          >
            <sector.Icon size={9} />
            {sector.label}
          </span>

          {/* 감성 배지 */}
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: sent.bg, color: sent.color, border: `1px solid ${sent.color}35` }}
          >
            <sent.Icon size={9} />
            {sent.label}
          </span>

          {/* 중요도 점수 */}
          {score !== null && (
            <span
              className="ml-auto text-xs font-black tabular-nums"
              style={{ color: scoreColor(score) }}
            >
              {score}
              <span className="text-[9px] font-normal text-slate-600">/10</span>
            </span>
          )}
        </div>

        {/* 제목 */}
        <h3 className="text-sm font-semibold leading-snug text-slate-100 line-clamp-2">
          {item.title}
        </h3>

        {/* AI 요약 */}
        {lines.length > 0 && (
          <ul className="space-y-1.5">
            {lines.slice(0, 3).map((line, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black mt-0.5"
                  style={{
                    background: i === 0 ? 'rgba(52,211,153,0.15)'  : i === 1 ? 'rgba(96,165,250,0.15)'  : 'rgba(167,139,250,0.15)',
                    color:      i === 0 ? '#34d399' : i === 1 ? '#60a5fa' : '#a78bfa',
                  }}
                >
                  {i + 1}
                </span>
                <p className="text-xs leading-relaxed text-slate-400">
                  {line.replace(/^[①②③]\s*/, '')}
                </p>
              </li>
            ))}
          </ul>
        )}

        {/* 하단: 출처 + 시간 + 링크 */}
        <div className="flex items-center gap-2 pt-1 mt-auto">
          <Clock size={10} className="text-slate-600 flex-shrink-0" />
          <span className="text-[10px] text-slate-600">
            {item.source_name ?? '알 수 없음'}
            {timeAgo(item.created_at) && ` · ${timeAgo(item.created_at)}`}
          </span>
          {item.source_url && (
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-0.5 text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              원문 <ExternalLink size={9} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ── 메인 서버 컴포넌트 ────────────────────────────────────────────────────────
export default async function DailyNewsCards({
  sector,
  limit = 12,
}: {
  sector?: Sector;
  limit?: number;
}) {
  let data: DailyNews[] = [];
  try {
    const db = getSupabase();
    let query = db
      .from('daily_news')
      .select('*')
      .order('impact_score', { ascending: false })
      .order('created_at',   { ascending: false })
      .limit(limit);

    if (sector) query = query.eq('target_sector', sector);

    const { data: rows, error } = await query.returns<DailyNews[]>();
    if (error) {
      console.error('[DailyNewsCards] Supabase error:', error.message);
      return <EmptyState />;
    }
    data = rows ?? [];
  } catch (err) {
    console.error('[DailyNewsCards] Supabase unavailable:', err);
    return <EmptyState />;
  }

  if (!data.length) return <EmptyState />;

  return (
    <div className="space-y-3">
      {data.map(item => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
