import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import EconNewsDashboard from '@/components/EconNewsDashboard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = genMeta({
  title: '경제 뉴스 AI 대시보드 — 우주항공·로봇·양자·STO·연준',
  description:
    'Claude AI가 우주항공, 로봇, 양자컴퓨팅, STO/RWA, 미 연준 금리 관련 뉴스를 투자자 관점에서 3줄 요약. 상승/하락/중립 모멘텀 태그 제공.',
});

export default function NewsDashboardPage() {
  return (
    <div
      className="max-w-lg mx-auto min-h-screen"
      style={{ background: '#050505' }}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <Link
          href="/"
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-opacity hover:opacity-60"
          style={{ background: '#111111', border: '1px solid #222222' }}
        >
          <ArrowLeft size={16} style={{ color: '#888888' }} />
        </Link>
        <div>
          <h1 className="text-base font-bold" style={{ color: '#f0f0f0' }}>
            경제 뉴스 AI 요약
          </h1>
          <p className="text-[11px]" style={{ color: '#555555' }}>
            Claude AI · 매일 2회 자동 갱신
          </p>
        </div>
      </div>

      {/* 대시보드 */}
      <div className="px-4 pb-8">
        <EconNewsDashboard />
      </div>
    </div>
  );
}
