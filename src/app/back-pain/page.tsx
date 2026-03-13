import type { Metadata } from 'next';
import Link from 'next/link';
import AdUnit from '@/components/AdUnit';
import StretchCard from '@/components/StretchCard';
import { backPainData } from '@/data/back-pain';
import { buildMetadata, buildArticleJsonLd } from '@/lib/seo';
import { withPhotos } from '@/lib/stretch-photos';

export const metadata: Metadata = buildMetadata({
  title: '허리 디스크 예방·완화 스트레칭 - 통증 완화 + 코어 강화 완전 가이드',
  description:
    '허리 디스크 환자를 위한 스트레칭 가이드입니다. 통증 완화 스트레칭 4가지와 코어 강화 운동 5가지, 운동 시 주의사항을 단계별로 안내합니다.',
  path: '/back-pain',
  keywords: ['허리 디스크 스트레칭', '허리 디스크 운동', '허리 통증 완화', '코어 강화 운동', '요통 스트레칭'],
});

export default function BackPainPage() {
  const reliefStretches = withPhotos(backPainData.reliefStretches);
  const coreStretches = withPhotos(backPainData.coreStretches);

  const jsonLd = buildArticleJsonLd({
    title: '허리 디스크 예방·완화 스트레칭',
    description: '허리 디스크 환자를 위한 통증 완화 및 코어 강화 스트레칭 가이드',
    path: '/back-pain',
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="px-4 py-8 border-b border-rose-900/20" style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)' }}>
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-rose-400 transition mb-5">
            ← 홈으로
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">🦴</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
                허리 디스크 예방 · 완화 스트레칭
              </h1>
              <p className="text-sm text-white/50 mt-1">통증 완화부터 코어 강화까지 단계별 가이드</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── 주의사항 ─────────────────────────────────────── */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⚠️</span>
            <strong className="text-sm text-amber-800">운동 전 반드시 확인하세요</strong>
          </div>
          <ul className="space-y-2">
            {backPainData.cautions.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-700">
                <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── 광고: 주의사항 아래 ────────────────────────────── */}
        <AdUnit slot="banner" />

        {/* ── 통증 완화 스트레칭 ───────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-rose-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="badge-relief">통증 완화</span>
              허리 통증 완화 스트레칭
            </h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">통증이 있을 때 부드럽게 시작할 수 있는 스트레칭</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reliefStretches.map((stretch) => (
              <StretchCard key={stretch.id} stretch={stretch} />
            ))}
          </div>
        </section>

        {/* ── 광고: 중간 ────────────────────────────────────── */}
        <AdUnit slot="rectangle" />

        {/* ── 코어 강화 운동 ──────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-violet-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="badge-core">코어 강화</span>
              코어 강화 운동
            </h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">허리를 지지하는 코어 근육을 강화하여 재발을 예방합니다</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coreStretches.map((stretch) => (
              <StretchCard key={stretch.id} stretch={stretch} />
            ))}
          </div>
        </section>

        {/* ── 광고: 하단 ────────────────────────────────────── */}
        <AdUnit slot="leaderboard" />
      </div>
    </>
  );
}
