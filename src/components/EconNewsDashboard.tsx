'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp, TrendingDown, Minus, RefreshCw,
  ExternalLink, Clock, Wifi, WifiOff, ChevronDown, ChevronUp,
  Rocket, Bot, Atom, Landmark, Building2,
} from 'lucide-react';
import type { NewsItem, MomentumTag } from '@/app/api/news/route';

// ── 카테고리 설정 ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',     label: '전체',      Icon: null,      accent: '#e2e8f0' },
  { id: 'space',   label: '우주항공',  Icon: Rocket,    accent: '#f59e0b' },
  { id: 'robot',   label: '로봇',      Icon: Bot,       accent: '#06b6d4' },
  { id: 'quantum', label: '양자컴퓨팅',Icon: Atom,      accent: '#a78bfa' },
  { id: 'sto',     label: 'STO/RWA',   Icon: Landmark,  accent: '#3b82f6' },
  { id: 'fed',     label: '연준/금리', Icon: Building2, accent: '#f87171' },
] as const;

// ── 모멘텀 태그 설정 ───────────────────────────────────────────────────────────
const MOMENTUM_CONFIG: Record<
  MomentumTag,
  { label: string; Icon: typeof TrendingUp; color: string; bg: string; border: string }
> = {
  bullish: {
    label: '상승 모멘텀',
    Icon: TrendingUp,
    color: '#00d084',
    bg: 'rgba(0,208,132,0.08)',
    border: 'rgba(0,208,132,0.25)',
  },
  bearish: {
    label: '하락 주의',
    Icon: TrendingDown,
    color: '#ff4d4d',
    bg: 'rgba(255,77,77,0.08)',
    border: 'rgba(255,77,77,0.25)',
  },
  neutral: {
    label: '중립',
    Icon: Minus,
    color: '#888888',
    bg: 'rgba(136,136,136,0.08)',
    border: 'rgba(136,136,136,0.2)',
  },
};

// ── 유틸 ───────────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

// ── MomentumBadge ──────────────────────────────────────────────────────────────
function MomentumBadge({ tag }: { tag: MomentumTag }) {
  const cfg = MOMENTUM_CONFIG[tag];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
    >
      <cfg.Icon size={9} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

// ── NewsCard ───────────────────────────────────────────────────────────────────
function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isExternal = item.link.startsWith('http');
  const catCfg = CATEGORIES.find(c => c.id === item.category);
  const accent = catCfg?.accent ?? '#888888';

  return (
    <article
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: '#111111',
        border: '1px solid #222222',
        borderLeft: `3px solid ${item.maPriority ? accent : '#222222'}`,
      }}
    >
      {/* MA 우선순위 배지 */}
      {item.maPriority && (
        <div
          className="px-3 py-1 text-[10px] font-semibold tracking-wide"
          style={{ background: `${accent}12`, color: accent, borderBottom: '1px solid #222222' }}
        >
          ★ 이평선 관련 핵심 종목/섹터
        </div>
      )}

      <div className="p-3">
        {/* 상단 메타 */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
          >
            {catCfg?.label ?? item.category}
          </span>
          <MomentumBadge tag={item.momentum} />
          <span className="text-[10px] ml-auto" style={{ color: '#555555' }}>
            {item.source}
          </span>
          {timeAgo(item.pubDate) && (
            <span className="text-[10px] flex items-center gap-0.5" style={{ color: '#444444' }}>
              <Clock size={9} />
              {timeAgo(item.pubDate)}
            </span>
          )}
        </div>

        {/* 제목 */}
        {isExternal ? (
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="group">
            <h3
              className="text-sm font-semibold leading-snug mb-1.5 flex items-start gap-1.5 group-hover:opacity-70 transition-opacity"
              style={{ color: '#f0f0f0' }}
            >
              <span className="flex-1 line-clamp-2">{item.title}</span>
              <ExternalLink size={12} className="flex-shrink-0 mt-0.5" style={{ color: '#555555' }} />
            </h3>
          </a>
        ) : (
          <h3 className="text-sm font-semibold leading-snug mb-1.5" style={{ color: '#f0f0f0' }}>
            <span className="line-clamp-2">{item.title}</span>
          </h3>
        )}

        {/* AI 요약 or 설명 */}
        {item.aiSummary ? (
          <div>
            <div
              className={`text-xs leading-relaxed space-y-0.5 transition-all ${
                expanded ? '' : 'line-clamp-3'
              }`}
              style={{ color: '#888888' }}
            >
              {item.aiSummary.split('\n').map((line, i) => (
                <p key={i} className="flex items-start gap-1">
                  <span style={{ color: accent, flexShrink: 0, fontWeight: 700 }}>
                    {line.match(/^[①②③]/) ? '' : '•'}
                  </span>
                  {line}
                </p>
              ))}
            </div>
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-1 text-[10px] mt-1.5 transition-opacity hover:opacity-60"
              style={{ color: '#555555' }}
            >
              {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              {expanded ? '접기' : 'AI 요약 전체 보기'}
            </button>
          </div>
        ) : item.description ? (
          <p className="text-xs line-clamp-2" style={{ color: '#666666' }}>
            {item.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}

// ── 요약 통계 바 ───────────────────────────────────────────────────────────────
function MomentumSummaryBar({ items }: { items: NewsItem[] }) {
  const bull = items.filter(i => i.momentum === 'bullish').length;
  const bear = items.filter(i => i.momentum === 'bearish').length;
  const neut = items.filter(i => i.momentum === 'neutral').length;
  const total = items.length || 1;

  return (
    <div
      className="rounded-xl p-3 mb-4"
      style={{ background: '#111111', border: '1px solid #222222' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold" style={{ color: '#888888' }}>
          오늘의 시장 센티먼트
        </span>
        <span className="text-[10px]" style={{ color: '#444444' }}>
          {items.length}개 뉴스 분석
        </span>
      </div>

      {/* 진행바 */}
      <div className="flex rounded-full overflow-hidden h-2 mb-2.5" style={{ background: '#1a1a1a' }}>
        <div
          className="transition-all duration-500"
          style={{ width: `${(bull / total) * 100}%`, background: '#00d084' }}
        />
        <div
          className="transition-all duration-500"
          style={{ width: `${(neut / total) * 100}%`, background: '#333333' }}
        />
        <div
          className="transition-all duration-500"
          style={{ width: `${(bear / total) * 100}%`, background: '#ff4d4d' }}
        />
      </div>

      <div className="flex gap-4 text-[10px]">
        <span style={{ color: '#00d084' }}>
          <span className="font-bold">{bull}</span> 상승
        </span>
        <span style={{ color: '#888888' }}>
          <span className="font-bold">{neut}</span> 중립
        </span>
        <span style={{ color: '#ff4d4d' }}>
          <span className="font-bold">{bear}</span> 하락주의
        </span>
        <span className="ml-auto" style={{ color: '#444444' }}>
          {bull > bear ? '전반적 강세' : bear > bull ? '전반적 약세' : '혼조세'}
        </span>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────────
export default function EconNewsDashboard() {
  const [news, setNews]             = useState<NewsItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [isLive, setIsLive]         = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeMomentum, setActiveMomentum] = useState<MomentumTag | 'all'>('all');

  const fetchNews = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/news', { cache: 'no-store' });
      const data = await res.json();
      setNews(data.items ?? []);
      setIsLive(data.source === 'live');
      setLastUpdate(new Date(data.fetchedAt).toLocaleString('ko-KR', {
        month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      }));
    } catch {
      // 오프라인 — 기존 상태 유지
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const timer = setInterval(() => fetchNews(true), 30 * 60 * 1000);
    return () => clearInterval(timer);
  }, [fetchNews]);

  // 필터링
  const filtered = news.filter(item => {
    const catMatch = activeCategory === 'all' || item.category === activeCategory;
    const momMatch = activeMomentum === 'all' || item.momentum === activeMomentum;
    return catMatch && momMatch;
  });

  // MA 우선순위 정렬
  const sorted = [...filtered].sort((a, b) => {
    if (a.maPriority !== b.maPriority) return a.maPriority ? -1 : 1;
    return 0;
  });

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
    >
      {/* ── 헤더 ─────────────────────────────────────────────────────────── */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1a1a1a' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: isLive ? '#00d084' : '#555555',
              boxShadow: isLive ? '0 0 6px #00d08480' : 'none',
            }}
          />
          <h2 className="text-sm font-bold" style={{ color: '#f0f0f0' }}>
            경제 뉴스 AI 요약 대시보드
          </h2>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full"
            style={{
              background: isLive ? 'rgba(0,208,132,0.1)' : 'rgba(85,85,85,0.15)',
              color: isLive ? '#00d084' : '#555555',
              border: isLive ? '1px solid rgba(0,208,132,0.25)' : '1px solid #222222',
            }}
          >
            {isLive ? <Wifi size={9} className="inline mr-0.5" /> : <WifiOff size={9} className="inline mr-0.5" />}
            {isLive ? 'LIVE' : 'CURATED'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-[10px]" style={{ color: '#444444' }}>
              {lastUpdate} 갱신
            </span>
          )}
          <button
            onClick={() => fetchNews()}
            className="p-1.5 rounded-lg transition-opacity hover:opacity-60"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} style={{ color: '#666666' }} />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* ── 자동 업데이트 안내 ──────────────────────────────────────────── */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-[10px]"
          style={{ background: '#111111', border: '1px solid #1e1e1e', color: '#555555' }}
        >
          <Clock size={10} />
          <span>자동 갱신: 매일 한국 시간 <strong style={{ color: '#888888' }}>오전 8시</strong> (장 시작 전) · <strong style={{ color: '#888888' }}>오후 4시</strong> (장 마감 후)</span>
        </div>

        {/* ── 카테고리 필터 ────────────────────────────────────────────────── */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex-shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-full transition-all"
                style={{
                  background: active ? `${cat.accent}15` : '#111111',
                  border: active ? `1px solid ${cat.accent}40` : '1px solid #222222',
                  color: active ? cat.accent : '#555555',
                }}
              >
                {cat.Icon && <cat.Icon size={9} />}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── 모멘텀 필터 ─────────────────────────────────────────────────── */}
        <div className="flex gap-1.5 mb-4">
          {([['all', '전체', '#888888'], ['bullish', '상승', '#00d084'], ['neutral', '중립', '#555555'], ['bearish', '하락주의', '#ff4d4d']] as const).map(
            ([id, label, color]) => {
              const active = activeMomentum === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveMomentum(id as typeof activeMomentum)}
                  className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full transition-all"
                  style={{
                    background: active ? `${color}15` : 'transparent',
                    border: `1px solid ${active ? `${color}40` : '#222222'}`,
                    color: active ? color : '#444444',
                  }}
                >
                  {label}
                </button>
              );
            },
          )}
        </div>

        {/* ── 센티먼트 바 ─────────────────────────────────────────────────── */}
        {news.length > 0 && <MomentumSummaryBar items={filtered} />}

        {/* ── 뉴스 목록 ────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="rounded-xl h-24 animate-pulse"
                style={{ background: '#111111' }}
              />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div
            className="text-center py-12 text-sm"
            style={{ color: '#444444' }}
          >
            해당 조건의 뉴스가 없습니다
          </div>
        ) : (
          <div className="space-y-2.5">
            {sorted.map((item, idx) => (
              <NewsCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        )}

        {/* ── 면책 조항 ────────────────────────────────────────────────────── */}
        <p className="text-[10px] mt-4 text-center leading-relaxed" style={{ color: '#333333' }}>
          본 대시보드의 AI 요약은 정보 제공 목적이며 투자 조언이 아닙니다.<br />
          Claude AI(Anthropic) 분석 · NexusInsight © 2026
        </p>
      </div>
    </div>
  );
}
