'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bell, TrendingUp, TrendingDown, ChevronRight,
  Clock, ArrowUpRight, Landmark, Cpu, Rocket, Brain,
  Calculator, RefreshCw,
} from 'lucide-react';
import { articles } from '@/data/articles';
import { sectors } from '@/data/sectors';
import { keyMetrics } from '@/data/market-data';
import NewsSection from '@/components/NewsSection';
import LiveDashboard from '@/components/LiveDashboard';
import HeaderBell from '@/components/HeaderBell';
import EconNewsDashboard from '@/components/EconNewsDashboard';

// ─── Top Banner data ──────────────────────────────────────────────────────────
const bannerCards = [
  {
    id: 1,
    label: 'RWA 온체인 TVL',
    value: '$12.4B',
    change: '+2.3%',
    positive: true,
    sub: '24h 변동',
    color: '#3b82f6',
    bg: 'linear-gradient(135deg,rgba(59,130,246,0.18),rgba(6,182,212,0.08))',
    border: 'rgba(59,130,246,0.25)',
  },
  {
    id: 2,
    label: 'BUIDL 펀드 규모',
    value: '$523M',
    change: '+1.7%',
    positive: true,
    sub: 'BlackRock',
    color: '#06b6d4',
    bg: 'linear-gradient(135deg,rgba(6,182,212,0.18),rgba(59,130,246,0.06))',
    border: 'rgba(6,182,212,0.25)',
  },
  {
    id: 3,
    label: 'Ondo OUSG 수익률',
    value: '5.12%',
    change: '-0.03%',
    positive: false,
    sub: 'APY',
    color: '#a78bfa',
    bg: 'linear-gradient(135deg,rgba(139,92,246,0.18),rgba(236,72,153,0.06))',
    border: 'rgba(139,92,246,0.25)',
  },
  {
    id: 4,
    label: 'IBM 큐비트 수',
    value: '1,121',
    change: 'Condor',
    positive: true,
    sub: '최신 프로세서',
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg,rgba(139,92,246,0.18),rgba(59,130,246,0.06))',
    border: 'rgba(139,92,246,0.22)',
  },
  {
    id: 5,
    label: '민간 우주 발사',
    value: '248회',
    change: '+31%',
    positive: true,
    sub: 'YoY 2024',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg,rgba(245,158,11,0.18),rgba(239,68,68,0.06))',
    border: 'rgba(245,158,11,0.25)',
  },
  {
    id: 6,
    label: 'Neuralink 임상',
    value: '3명',
    change: '진행 중',
    positive: true,
    sub: 'PRIME Study',
    color: '#10b981',
    bg: 'linear-gradient(135deg,rgba(16,185,129,0.18),rgba(6,182,212,0.06))',
    border: 'rgba(16,185,129,0.25)',
  },
];

// ─── Tab config ───────────────────────────────────────────────────────────────
const tabs = [
  { id: 'all',     label: '전체',    icon: null    },
  { id: 'rwa',     label: 'RWA',     icon: Landmark },
  { id: 'quantum', label: '양자',    icon: Cpu      },
  { id: 'space',   label: '우주',    icon: Rocket   },
  { id: 'bci',     label: 'BCI',     icon: Brain    },
];

// ─── Article gradient backgrounds ─────────────────────────────────────────────
const sectorGrad: Record<string, { bg: string; icon: string }> = {
  rwa:     { bg: 'linear-gradient(135deg,#1e3a5f,#0f2240)', icon: '🏦' },
  quantum: { bg: 'linear-gradient(135deg,#2d1b69,#1a0f40)', icon: '⚛️' },
  space:   { bg: 'linear-gradient(135deg,#4a2000,#2a1200)', icon: '🚀' },
  bci:     { bg: 'linear-gradient(135deg,#063626,#021f16)', icon: '🧠' },
};

// ─── RWA Simulator ────────────────────────────────────────────────────────────
function RwaSimulator() {
  const [amount, setAmount]   = useState(10_000_000);
  const [cagr, setCagr]       = useState(42);
  const [years, setYears]     = useState(5);

  const finalValue  = useMemo(() => amount * Math.pow(1 + cagr / 100, years), [amount, cagr, years]);
  const profit      = finalValue - amount;
  const returnPct   = ((profit / amount) * 100).toFixed(1);

  const fmt = (n: number) =>
    n >= 1_000_000_000 ? `${(n / 100_000_000).toFixed(1)}억`
    : n >= 10_000      ? `${Math.round(n / 10_000).toLocaleString()}만`
    : n.toLocaleString();

  const sliderStyle = (color: string) => ({ accentColor: color });

  return (
    <section className="mx-4 rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(145deg,#0a1628,#0d1f3c)', border: '1px solid rgba(59,130,246,0.2)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>
            <Calculator size={14} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-none">RWA 수익률 시뮬레이터</h2>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(148,163,184,0.7)' }}>실물 자산 토큰화 투자 예상 수익</p>
          </div>
        </div>
        <button
          onClick={() => { setAmount(10_000_000); setCagr(42); setYears(5); }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] transition-opacity hover:opacity-80"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.8)' }}>
          <RefreshCw size={10} /> 초기화
        </button>
      </div>

      {/* Result card */}
      <div className="mx-5 mb-4 rounded-xl p-4"
        style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(6,182,212,0.08))', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-[10px] mb-1" style={{ color: 'rgba(148,163,184,0.7)' }}>투자원금</p>
            <p className="text-base font-bold text-white">{fmt(amount)}원</p>
          </div>
          <div>
            <p className="text-[10px] mb-1" style={{ color: 'rgba(148,163,184,0.7)' }}>{years}년 후 자산</p>
            <p className="text-base font-bold" style={{ color: '#60a5fa' }}>{fmt(Math.round(finalValue))}원</p>
          </div>
          <div>
            <p className="text-[10px] mb-1" style={{ color: 'rgba(148,163,184,0.7)' }}>총 수익률</p>
            <p className="text-base font-bold" style={{ color: '#34d399' }}>+{returnPct}%</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((profit / finalValue) * 100, 100)}%`,
              background: 'linear-gradient(90deg,#3b82f6,#06b6d4)',
            }} />
        </div>
        <div className="flex justify-between text-[10px] mt-1.5" style={{ color: 'rgba(148,163,184,0.6)' }}>
          <span>원금</span>
          <span style={{ color: '#34d399' }}>수익 +{fmt(Math.round(profit))}원</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="px-5 pb-5 space-y-4">
        {/* Amount */}
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span style={{ color: 'rgba(148,163,184,0.8)' }}>투자금액</span>
            <span className="font-semibold text-white">{fmt(amount)}원</span>
          </div>
          <input type="range" min={1_000_000} max={100_000_000} step={1_000_000}
            value={amount} onChange={e => setAmount(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={sliderStyle('#3b82f6')} />
          <div className="flex justify-between text-[10px] mt-1" style={{ color: 'rgba(148,163,184,0.4)' }}>
            <span>100만</span><span>1억</span>
          </div>
        </div>

        {/* CAGR */}
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span style={{ color: 'rgba(148,163,184,0.8)' }}>예상 CAGR</span>
            <span className="font-semibold" style={{ color: '#a78bfa' }}>{cagr}%</span>
          </div>
          <input type="range" min={5} max={80} step={1}
            value={cagr} onChange={e => setCagr(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={sliderStyle('#8b5cf6')} />
          <div className="flex justify-between text-[10px] mt-1" style={{ color: 'rgba(148,163,184,0.4)' }}>
            <span>5%</span><span className="text-yellow-500/60">42% (RWA 평균)</span><span>80%</span>
          </div>
        </div>

        {/* Years */}
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span style={{ color: 'rgba(148,163,184,0.8)' }}>투자기간</span>
            <span className="font-semibold" style={{ color: '#34d399' }}>{years}년</span>
          </div>
          <div className="flex gap-2">
            {[3, 5, 7, 10].map(y => (
              <button key={y} onClick={() => setYears(y)}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: years === y ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)',
                  color: years === y ? '#34d399' : 'rgba(148,163,184,0.6)',
                  border: years === y ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.06)',
                }}>
                {y}년
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-4 text-[10px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.4)' }}>
        ※ 본 시뮬레이션은 교육·참고 목적이며 투자 조언이 아닙니다.
      </div>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomeClient() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredArticles = useMemo(() =>
    activeTab === 'all' ? articles : articles.filter(a => a.sector === activeTab),
    [activeTab]
  );

  return (
    <div className="max-w-lg mx-auto" style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-lg font-bold leading-tight"
          style={{ background: 'linear-gradient(90deg,#e2e8f0,#94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          오늘의 시장 인사이트
        </h1>
        <HeaderBell />
      </div>

      {/* ── Hero Image ───────────────────────────────────────────────────── */}
      <div className="mx-4 mb-4 rounded-2xl overflow-hidden relative"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <Image
          src="/mainImage.png"
          alt="Future Growth Sector — NexusInsight"
          width={800}
          height={450}
          className="w-full h-auto object-cover"
          priority
        />
        {/* 하단 그라디언트 오버레이 + 텍스트 */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3"
          style={{ background: 'linear-gradient(transparent, rgba(5,10,20,0.85))' }}>
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
            RWA · 양자 컴퓨팅 · 우주 경제 · BCI
          </p>
          <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.7)' }}>
            전문가 분석 · 실시간 데이터
          </p>
        </div>
      </div>

      {/* ── Top Banner: horizontal scroll cards ─────────────────────────── */}
      <div className="mt-3 mb-5">
        <div className="flex items-center justify-between px-4 mb-2.5">
          <span className="text-xs font-semibold" style={{ color: 'rgba(148,163,184,0.7)' }}>
            오늘의 RWA 시장 인사이트
          </span>
          <span className="flex items-center gap-0.5 text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" />
            실시간
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {bannerCards.map(card => (
            <div key={card.id}
              className="flex-shrink-0 rounded-2xl p-4 transition-transform active:scale-95"
              style={{
                width: 148,
                background: card.bg,
                border: `1px solid ${card.border}`,
              }}>
              <p className="text-[10px] font-medium mb-2 leading-tight"
                style={{ color: 'rgba(255,255,255,0.55)' }}>
                {card.label}
              </p>
              <p className="text-xl font-bold leading-none mb-1" style={{ color: '#f1f5f9' }}>
                {card.value}
              </p>
              <div className="flex items-center gap-1 mt-2">
                {card.positive
                  ? <TrendingUp size={11} style={{ color: '#34d399' }} />
                  : <TrendingDown size={11} style={{ color: '#f87171' }} />}
                <span className="text-[11px] font-semibold"
                  style={{ color: card.positive ? '#34d399' : '#f87171' }}>
                  {card.change}
                </span>
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{card.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick metrics strip ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2.5 px-4 mb-6">
        {keyMetrics.map(m => (
          <div key={m.label}
            className="rounded-xl p-3 flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${m.color}18`, border: `1px solid ${m.color}25` }}>
              <span className="text-base">{sectors.find(s => s.name === m.sector || s.id === m.sector.toLowerCase())?.icon ?? '📊'}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] truncate leading-none mb-0.5" style={{ color: 'rgba(148,163,184,0.6)' }}>{m.label}</p>
              <p className="text-sm font-bold leading-none" style={{ color: m.color }}>{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab Buttons ──────────────────────────────────────────────────── */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab => {
            const active = activeTab === tab.id;
            const sector = sectors.find(s => s.id === tab.id);
            const color  = sector?.color ?? '#60a5fa';
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: active
                    ? `linear-gradient(135deg,${color}30,${color}15)`
                    : 'rgba(255,255,255,0.04)',
                  border: active ? `1px solid ${color}50` : '1px solid rgba(255,255,255,0.06)',
                  color: active ? color : 'rgba(148,163,184,0.6)',
                  boxShadow: active ? `0 2px 12px ${color}20` : 'none',
                }}>
                {tab.icon && <tab.icon size={12} />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Article List ─────────────────────────────────────────────────── */}
      <div className="px-4 space-y-3 mb-6">
        {filteredArticles.length === 0 && (
          <div className="text-center py-10 text-sm" style={{ color: 'rgba(148,163,184,0.4)' }}>
            아티클이 없습니다
          </div>
        )}
        {filteredArticles.map((article, i) => {
          const grad  = sectorGrad[article.sector];
          const color = sectors.find(s => s.id === article.sector)?.color ?? '#3b82f6';
          return (
            <Link key={article.slug} href={`/insights/${article.slug}`}>
              <div className="rounded-2xl overflow-hidden transition-transform active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {/* Image area */}
                <div className="relative h-36 flex items-center justify-center overflow-hidden"
                  style={{ background: grad.bg }}>
                  {/* Grid overlay */}
                  <div className="absolute inset-0"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',
                      backgroundSize: '28px 28px',
                    }} />
                  {/* Glow */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div style={{ width: 80, height: 80, background: `${color}20`, borderRadius: '50%', filter: 'blur(20px)' }} />
                  </div>
                  {/* Icon */}
                  <div className="relative z-10 text-5xl select-none" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }}>
                    {grad.icon}
                  </div>
                  {/* Featured badge */}
                  {article.featured && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: 'rgba(245,158,11,0.25)', border: '1px solid rgba(245,158,11,0.4)', color: '#fbbf24' }}>
                      ★ 추천
                    </div>
                  )}
                  {/* Sector chip */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: `${color}25`, border: `1px solid ${color}40`, color }}>
                    {sectors.find(s => s.id === article.sector)?.name}
                  </div>
                  {/* Bottom fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-12"
                    style={{ background: 'linear-gradient(transparent,rgba(10,15,30,0.8))' }} />
                </div>

                {/* Text area */}
                <div className="p-4">
                  <h3 className="text-sm font-bold leading-snug mb-1.5 line-clamp-2" style={{ color: '#f1f5f9' }}>
                    {article.title}
                  </h3>
                  <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                        style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                        {grad.icon}
                      </div>
                      <span className="text-[11px] font-medium" style={{ color: 'rgba(148,163,184,0.7)' }}>
                        {article.author}
                      </span>
                      <span className="text-[10px]" style={{ color: 'rgba(148,163,184,0.35)' }}>·</span>
                      <span className="flex items-center gap-0.5 text-[10px]" style={{ color: 'rgba(148,163,184,0.5)' }}>
                        <Clock size={9} />{article.readTime}
                      </span>
                    </div>
                    <ArrowUpRight size={15} style={{ color }} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── RWA Simulator ────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-sm font-bold" style={{ color: '#e2e8f0' }}>실물 자산 토큰화 수익률 시뮬레이터</h2>
          <Link href="/calculator" className="flex items-center gap-1 text-[11px]" style={{ color: '#60a5fa' }}>
            상세 <ChevronRight size={12} />
          </Link>
        </div>
        <RwaSimulator />
      </div>

      {/* ── Live Dashboard ───────────────────────────────────────────────── */}
      <div className="px-4 mb-6">
        <LiveDashboard />
      </div>

      {/* ── Econ News AI Dashboard ───────────────────────────────────────── */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold" style={{ color: '#e2e8f0' }}>
            경제 뉴스 AI 요약
          </h2>
          <Link href="/news-dashboard" className="flex items-center gap-1 text-[11px]" style={{ color: '#60a5fa' }}>
            전체 보기 <ChevronRight size={12} />
          </Link>
        </div>
        <EconNewsDashboard />
      </div>

      {/* ── News Section ─────────────────────────────────────────────────── */}
      <div className="px-4 mb-6">
        <NewsSection />
      </div>

      {/* ── Ad Placeholder ───────────────────────────────────────────────── */}
      <div className="mx-4 mb-6 rounded-2xl flex items-center justify-center text-[11px]"
        style={{ height: 72, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', color: 'rgba(148,163,184,0.3)' }}>
        Advertisement
      </div>

      {/* ── Footer info ──────────────────────────────────────────────────── */}
      <div className="px-4 pb-8 text-center">
        <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.3)' }}>
          본 플랫폼의 모든 분석 및 시뮬레이션은 정보 제공 목적이며 투자 조언이 아닙니다.<br />
          NexusInsight © 2026
        </p>
      </div>
    </div>
  );
}
