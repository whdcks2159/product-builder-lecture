import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import AdUnit from '@/components/AdUnit';
import RelatedStretches from '@/components/RelatedStretches';
import StretchSteps from '@/components/StretchSteps';
import YoutubeEmbed from '@/components/YoutubeEmbed';
import StretchDetailClient from '@/components/StretchDetailClient';
import { getAllStretchIds, findStretchById } from '@/lib/find-stretch';

// ── SSG ──────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return getAllStretchIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const result = findStretchById(params.id);
  if (!result) return {};
  const { stretch } = result;
  return {
    title: `${stretch.name} 스트레칭 방법 | DailyStretch`,
    description: stretch.description,
    keywords: [stretch.name, ...stretch.muscles, '스트레칭 방법', '스트레칭 자세'],
    openGraph: {
      title: `${stretch.name} 스트레칭 방법`,
      description: stretch.description,
      images: stretch.photo_url ? [{ url: stretch.photo_url, alt: stretch.name }] : [],
    },
  };
}

const difficultyStyle: Record<string, string> = {
  쉬움: 'bg-green-100 text-green-700',
  보통: 'bg-amber-100 text-amber-700',
  어려움: 'bg-red-100 text-red-700',
};

export default function StretchViewPage({ params }: { params: { id: string } }) {
  const result = findStretchById(params.id);
  if (!result) notFound();

  const { stretch, categoryName, categorySlug } = result;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${stretch.name} 스트레칭 방법`,
    description: stretch.description,
    step: stretch.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: s,
    })),
    ...(stretch.youtubeId && {
      video: {
        '@type': 'VideoObject',
        name: `${stretch.name} 스트레칭 영상`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${stretch.youtubeId}`,
      },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* ── 브레드크럼 ──────────────────────────────────── */}
        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-5 flex-wrap">
          <Link href="/" className="hover:text-green-600 transition">홈</Link>
          <span>›</span>
          <Link href={categorySlug} className="hover:text-green-600 transition">{categoryName}</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">{stretch.name}</span>
        </nav>

        {/* ── 타이틀 헤더 ──────────────────────────────── */}
        <header className="mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl shrink-0">
              {stretch.icon || '🤸'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">{stretch.name}</h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {stretch.difficulty && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${difficultyStyle[stretch.difficulty]}`}>
                    {stretch.difficulty}
                  </span>
                )}
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                  ⏱ {stretch.holdTime}
                </span>
                {stretch.youtubeId && (
                  <span className="text-xs font-bold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
                    ▶ 영상 가이드
                  </span>
                )}
                {stretch.gifUrl && (
                  <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full">
                    🎬 GIF
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{stretch.description}</p>

          {/* 타겟 근육 */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {stretch.muscles.map((m) => (
              <span key={m} className="text-xs bg-gray-100 text-gray-500 border border-gray-200 rounded-full px-2.5 py-0.5">
                {m}
              </span>
            ))}
          </div>
        </header>

        <AdUnit slot="banner" />

        {/* ── YouTube 영상 ─────────────────────────────── */}
        {stretch.youtubeId && (
          <section className="mt-5">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
              </span>
              스트레칭 영상
            </h2>
            <YoutubeEmbed
              videoId={stretch.youtubeId}
              title={`${stretch.name} 스트레칭 방법`}
            />
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">
              영상을 클릭하면 YouTube에서 자세한 방법을 확인할 수 있습니다
            </p>
          </section>
        )}

        {/* ── 대표 사진 (영상 없을 때) ──────────────────── */}
        {!stretch.youtubeId && stretch.photo_url && (
          <section className="mt-5">
            <h2 className="text-base font-bold text-gray-900 mb-3">스트레칭 자세</h2>
            <div className="relative w-full rounded-2xl overflow-hidden bg-gray-100" style={{ aspectRatio: '16/9' }}>
              <img
                src={stretch.photo_url}
                alt={`${stretch.name} 스트레칭 자세`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {stretch.photo_credit && (
                <a
                  href={stretch.photo_credit_url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 text-[9px] text-white/70 bg-black/30 rounded px-1.5 py-0.5 backdrop-blur-sm hover:text-white transition"
                >
                  📷 {stretch.photo_credit} / {stretch.photo_source}
                </a>
              )}
            </div>
          </section>
        )}

        {/* ── GIF 애니메이션 ────────────────────────────── */}
        {stretch.gifUrl && (
          <section className="mt-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              🎬 동작 애니메이션
            </h2>
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={stretch.gifUrl}
                alt={`${stretch.name} 동작 GIF`}
                className="w-full object-contain max-h-72 mx-auto"
                loading="lazy"
              />
            </div>
          </section>
        )}

        {/* ── 단계별 동작 ──────────────────────────────── */}
        <section className="mt-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">단계별 방법</h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <StretchSteps
              steps={stretch.steps}
              detailedSteps={stretch.detailedSteps}
              stretchName={stretch.name}
            />
          </div>
        </section>

        {/* ── 타이머 (클라이언트 컴포넌트) ──────────────── */}
        <section className="mt-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">⏱ 스트레칭 타이머</h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <StretchDetailClient holdTime={stretch.holdTime} stretchName={stretch.name} />
          </div>
        </section>

        <div className="mt-6">
          <AdUnit slot="rectangle" />
        </div>

        {/* ── 추천 스트레칭 ─────────────────────────────── */}
        <RelatedStretches
          currentId={stretch.id}
          muscles={stretch.muscles}
          limit={4}
        />

        {/* ── 돌아가기 ──────────────────────────────────── */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link
            href={categorySlug}
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition"
          >
            ← {categoryName} 전체 보기
          </Link>
        </div>
      </div>
    </>
  );
}
