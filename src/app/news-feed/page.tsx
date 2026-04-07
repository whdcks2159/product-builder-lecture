// ISR: 1시간마다 Supabase 재조회 (서버 컴포넌트)
export const revalidate = 3600;

import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import DailyNewsCards from '@/components/DailyNewsCards';
import Link from 'next/link';
import { ArrowLeft, Database, RefreshCw } from 'lucide-react';
import type { Sector } from '@/lib/supabase';

export const metadata: Metadata = genMeta({
  title: '일일 AI 뉴스 피드 — 양자·우주·로봇·STO 투자 요약',
  description:
    'NewsAPI + Gemini AI가 매일 2회 수집·요약하는 우주항공, 로봇, 양자컴퓨팅, STO 투자 뉴스. 3줄 요약과 중요도 스코어 제공.',
});

const SECTOR_TABS: Array<{ id: Sector | 'all'; label: string; emoji: string }> = [
  { id: 'all',     label: '전체',      emoji: '📰' },
  { id: 'space',   label: '우주항공',  emoji: '🚀' },
  { id: 'robot',   label: '로봇',      emoji: '🤖' },
  { id: 'quantum', label: '양자',      emoji: '⚛️' },
  { id: 'sto',     label: 'STO/RWA',  emoji: '🏦' },
  { id: 'fed',     label: '연준/금리', emoji: '🏛️' },
];

export default function NewsFeedPage({
  searchParams,
}: {
  searchParams: { sector?: string };
}) {
  const activeSector = (searchParams.sector as Sector) ?? undefined;

  return (
    <div className="max-w-lg mx-auto min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* ── 헤더 ──────────────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 px-4 pt-5 pb-3"
        style={{
          background: 'rgba(5,10,20,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-opacity hover:opacity-60"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <ArrowLeft size={16} className="text-slate-400" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold text-slate-100">일일 AI 뉴스 피드</h1>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <Database size={9} />
              <span>Supabase · Gemini AI · NewsAPI</span>
              <span>·</span>
              <RefreshCw size={9} />
              <span>1시간 ISR 캐시</span>
            </div>
          </div>
        </div>

        {/* 섹터 탭 */}
        <div
          className="flex gap-1.5 overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: 'none' }}
        >
          {SECTOR_TABS.map(tab => {
            const isActive =
              tab.id === 'all' ? !activeSector : activeSector === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.id === 'all' ? '/news-feed' : `/news-feed?sector=${tab.id}`}
                className="flex-shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-full transition-all"
                style={{
                  background: isActive
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(255,255,255,0.03)',
                  border: isActive
                    ? '1px solid rgba(255,255,255,0.2)'
                    : '1px solid rgba(255,255,255,0.06)',
                  color: isActive ? '#f1f5f9' : 'rgba(148,163,184,0.6)',
                }}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── 뉴스 카드 목록 (Supabase ISR) ─────────────────────────────────── */}
      <div className="px-4 pt-4 pb-8">
        <DailyNewsCards sector={activeSector} limit={20} />
      </div>
    </div>
  );
}
