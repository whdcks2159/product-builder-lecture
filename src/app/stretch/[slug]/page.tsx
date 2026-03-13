import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { COMBO_MAP, ALL_COMBOS, EXERCISES, BODY_PARTS } from '@/data/seo-combos';
import { exercises } from '@/data/exercises';
import { painAreas } from '@/data/pain-areas';
import { withPhotos } from '@/lib/stretch-photos';
import StretchCard from '@/components/StretchCard';
import type { Stretch } from '@/types';

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return ALL_COMBOS.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const combo = COMBO_MAP.get(params.slug);
  if (!combo) return {};
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://productbuilder-1.vercel.app';
  return {
    title: combo.title,
    description: combo.description,
    keywords: combo.keywords,
    alternates: { canonical: `${baseUrl}/stretch/${combo.slug}` },
    openGraph: {
      title: combo.title,
      description: combo.description,
      type: 'article',
      locale: 'ko_KR',
    },
  };
}

function getStretches(combo: ReturnType<typeof COMBO_MAP.get>): Stretch[] {
  if (!combo) return [];
  const results: Stretch[] = [];
  const seen = new Set<string>();

  function addStretch(s: Stretch) {
    if (!seen.has(s.id)) {
      seen.add(s.id);
      results.push(s);
    }
  }

  const muscleFilter = combo.muscleFilter;

  function matchesMuscle(s: Stretch) {
    return s.muscles.some(m =>
      muscleFilter.some(f => m.includes(f) || f.includes(m))
    );
  }

  // From exercise data
  if (combo.exerciseId) {
    const ex = exercises.find(e => e.id === combo.exerciseId);
    if (ex) {
      const pool = combo.timing === 'after'
        ? ex.afterStretches
        : combo.timing === 'before'
        ? ex.beforeStretches
        : [...ex.beforeStretches, ...ex.afterStretches];
      pool.filter(matchesMuscle).forEach(addStretch);
      // Fill with more from the exercise if fewer than 4
      if (results.length < 4) {
        pool.filter(s => !seen.has(s.id)).slice(0, 4 - results.length).forEach(addStretch);
      }
    }
  }

  // From pain area data
  if (combo.bodyPartId) {
    const pa = painAreas.find(p => p.id === combo.bodyPartId);
    if (pa) {
      pa.stretches.filter(matchesMuscle).forEach(addStretch);
      if (results.length < 4) {
        pa.stretches.filter(s => !seen.has(s.id)).slice(0, 4 - results.length).forEach(addStretch);
      }
    }
  }

  // General fallback from all exercises
  if (results.length < 3) {
    for (const ex of exercises) {
      const pool = [...ex.beforeStretches, ...ex.afterStretches];
      pool.filter(matchesMuscle).filter(s => !seen.has(s.id)).slice(0, 2).forEach(addStretch);
      if (results.length >= 6) break;
    }
  }

  return withPhotos(results.slice(0, 8));
}

export default function StretchSeoPage({ params }: Props) {
  const combo = COMBO_MAP.get(params.slug);
  if (!combo) notFound();

  const stretches = getStretches(combo);

  const exerciseData = combo.exerciseId ? exercises.find(e => e.id === combo.exerciseId) : null;
  const bodyPartData = combo.bodyPartId ? BODY_PARTS.find(b => b.id === combo.bodyPartId) : null;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: combo.title,
    description: combo.description,
    author: { '@type': 'Organization', name: 'DailyStretch' },
    publisher: { '@type': 'Organization', name: 'DailyStretch' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://productbuilder-1.vercel.app/stretch/${combo.slug}` },
  };

  // Breadcrumb
  const breadcrumbs = [
    { name: '홈', href: '/' },
    ...(exerciseData ? [{ name: exerciseData.name, href: `/exercise/${exerciseData.slug}` }] : []),
    ...(bodyPartData ? [{ name: bodyPartData.name + ' 통증', href: `/pain/${bodyPartData.painSlug}` }] : []),
    { name: combo.h1, href: `/stretch/${combo.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-300">›</span>}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-gray-700 font-medium">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-green-600 transition">{crumb.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            {combo.h1}
          </h1>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base max-w-2xl">
            {combo.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {exerciseData && (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold">
                {exerciseData.icon} {exerciseData.name}
              </span>
            )}
            {bodyPartData && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold">
                💪 {bodyPartData.name}
              </span>
            )}
            {combo.timing && (
              <span className="inline-flex items-center bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1 text-xs font-semibold">
                ⏱ {combo.timing === 'before' ? '운동 전' : '운동 후'}
              </span>
            )}
          </div>
        </header>

        {/* Stretches */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            추천 스트레칭 {stretches.length > 0 && <span className="text-sm font-normal text-gray-400">({stretches.length}개)</span>}
          </h2>

          {stretches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stretches.map((stretch) => (
                <StretchCard key={stretch.id} stretch={stretch} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-8 text-center">
              해당 조건의 스트레칭을 준비 중입니다.
            </p>
          )}
        </section>

        {/* Related links */}
        <section className="mt-10 pt-8 border-t border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4">관련 페이지</h2>
          <div className="flex flex-wrap gap-3">
            {exerciseData && (
              <Link
                href={`/exercise/${exerciseData.slug}`}
                className="inline-flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl px-4 py-2 text-sm font-medium transition"
              >
                {exerciseData.icon} {exerciseData.name} 전체 스트레칭 보기 →
              </Link>
            )}
            {bodyPartData && (
              <Link
                href={`/pain/${bodyPartData.painSlug}`}
                className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl px-4 py-2 text-sm font-medium transition"
              >
                💊 {bodyPartData.name} 통증 완화 가이드 →
              </Link>
            )}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium transition"
            >
              🏠 전체 운동 카테고리 →
            </Link>
          </div>
        </section>

        {/* More combos in same exercise */}
        {exerciseData && (
          <section className="mt-8">
            <h2 className="text-base font-bold text-gray-900 mb-3">{exerciseData.name} 관련 스트레칭</h2>
            <div className="flex flex-wrap gap-2">
              {ALL_COMBOS
                .filter(c => c.exerciseId === exerciseData.id && c.slug !== combo.slug)
                .slice(0, 8)
                .map(c => (
                  <Link
                    key={c.slug}
                    href={`/stretch/${c.slug}`}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-3 py-1.5 transition"
                  >
                    {c.h1}
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
