import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import AdUnit from '@/components/AdUnit';
import StretchCard from '@/components/StretchCard';
import { getPainAreaBySlug, getAllPainSlugs } from '@/data/pain-areas';
import { buildMetadata, buildArticleJsonLd } from '@/lib/seo';
import { withPhotos } from '@/lib/stretch-photos';
import { withMedia } from '@/data/stretch-media';

export function generateStaticParams() {
  return getAllPainSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const pain = getPainAreaBySlug(params.slug);
  if (!pain) return {};
  return buildMetadata({
    title: pain.seoTitle,
    description: pain.seoDescription,
    path: `/pain/${pain.slug}`,
    keywords: pain.keywords,
  });
}

export default function PainPage({ params }: { params: { slug: string } }) {
  const raw = getPainAreaBySlug(params.slug);
  if (!raw) notFound();
  const pain = { ...raw, stretches: withMedia(withPhotos(raw.stretches)) };

  const jsonLd = buildArticleJsonLd({
    title: pain.seoTitle,
    description: pain.seoDescription,
    path: `/pain/${pain.slug}`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-green-600 transition mb-5">
            ← 홈으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{pain.icon}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {pain.name} 스트레칭
              </h1>
              <p className="text-sm text-gray-500 mt-1">{pain.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <AdUnit slot="banner" />

        <section>
          <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-green-200">
            <h2 className="text-lg font-bold text-gray-900">
              {pain.name} 완화 스트레칭
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pain.stretches.slice(0, 2).map((stretch) => (
              <StretchCard key={stretch.id} stretch={stretch} />
            ))}
          </div>

          {/* 광고: 스트레칭 리스트 사이 */}
          {pain.stretches.length > 2 && (
            <>
              <AdUnit slot="rectangle" className="my-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pain.stretches.slice(2).map((stretch) => (
                  <StretchCard key={stretch.id} stretch={stretch} />
                ))}
              </div>
            </>
          )}
        </section>

        <AdUnit slot="leaderboard" />

        <div className="text-center py-4">
          <Link href="/back-pain" className="inline-flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700 font-medium transition bg-rose-50 border border-rose-200 rounded-full px-4 py-2">
            🦴 허리 디스크 전용 스트레칭 보기 →
          </Link>
        </div>
      </div>
    </>
  );
}
