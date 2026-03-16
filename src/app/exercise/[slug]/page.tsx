import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import AdUnit from '@/components/AdUnit';
import StretchCard from '@/components/StretchCard';
import RelatedStretches from '@/components/RelatedStretches';
import { getExerciseBySlug, getAllExerciseSlugs } from '@/data/exercises';
import { buildMetadata, buildArticleJsonLd } from '@/lib/seo';
import { withPhotos } from '@/lib/stretch-photos';

// ── SSG: 모든 운동 경로를 빌드 타임에 생성 ───────────────────
export function generateStaticParams() {
  return getAllExerciseSlugs().map((slug) => ({ slug }));
}

// ── SEO: 페이지별 동적 메타데이터 ────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const exercise = getExerciseBySlug(params.slug);
  if (!exercise) return {};

  return buildMetadata({
    title: exercise.seoTitle,
    description: exercise.seoDescription,
    path: `/exercise/${exercise.slug}`,
    keywords: exercise.keywords,
  });
}

export default function ExercisePage({ params }: { params: { slug: string } }) {
  const raw = getExerciseBySlug(params.slug);
  if (!raw) notFound();
  const exercise = {
    ...raw,
    beforeStretches: withPhotos(raw.beforeStretches),
    afterStretches: withPhotos(raw.afterStretches),
  };

  const jsonLd = buildArticleJsonLd({
    title: exercise.seoTitle,
    description: exercise.seoDescription,
    path: `/exercise/${exercise.slug}`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── 카테고리 히어로 ───────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-green-600 transition mb-5">
            ← 전체 운동
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{exercise.icon}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {exercise.name} 스트레칭
              </h1>
              <p className="text-sm text-gray-500 mt-1">{exercise.shortDesc}</p>
            </div>
          </div>
          <p
            className="text-sm text-gray-600 leading-relaxed bg-white border-l-4 pl-4 py-3 rounded-r-lg"
            style={{ borderLeftColor: exercise.accentColor }}
          >
            {exercise.intro}
          </p>

          {/* 관련 근육 태그 */}
          {exercise.relatedMuscles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {exercise.relatedMuscles.map((m) => (
                <span key={m} className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-500">
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── 광고: 상단 ─────────────────────────────────────── */}
        <AdUnit slot="banner" />

        {/* ── 운동 전 스트레칭 ─────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-green-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="badge-before">운동 전</span>
              준비운동 스트레칭
            </h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">본 운동 5~10분 전에 실시하세요</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exercise.beforeStretches.map((stretch) => (
              <StretchCard key={stretch.id} stretch={stretch} />
            ))}
          </div>
        </section>

        {/* ── 광고: 전/후 사이 ──────────────────────────────── */}
        <AdUnit slot="rectangle" />

        {/* ── 운동 후 스트레칭 ─────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-blue-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="badge-after">운동 후</span>
              쿨다운 스트레칭
            </h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">운동 종료 직후 10~15분 이내에 실시하세요</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exercise.afterStretches.map((stretch) => (
              <StretchCard key={stretch.id} stretch={stretch} />
            ))}
          </div>
        </section>

        {/* ── 광고: 하단 ────────────────────────────────────── */}
        <AdUnit slot="leaderboard" />

        {/* ── 추천 스트레칭 ───────────────────────────────── */}
        <RelatedStretches
          currentId={exercise.beforeStretches[0]?.id ?? ''}
          muscles={exercise.relatedMuscles}
        />

        {/* ── 다른 운동 보기 ──────────────────────────────── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">다른 운동 스트레칭</h2>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition"
          >
            ← 전체 카테고리 보기
          </Link>
        </section>
      </div>
    </>
  );
}
