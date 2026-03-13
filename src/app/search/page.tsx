import type { Metadata } from 'next';
import Link from 'next/link';
import AdUnit from '@/components/AdUnit';
import StretchCard from '@/components/StretchCard';
import { searchAll } from '@/lib/search';

export const metadata: Metadata = {
  title: '스트레칭 검색',
  description: '운동 이름, 근육 부위, 통증 부위로 스트레칭을 검색하세요.',
  robots: { index: false, follow: true }, // 검색 결과 페이지는 인덱싱 제외
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim() ?? '';
  const results = query.length >= 2 ? searchAll(query) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          🔍 검색 결과: &quot;{query}&quot;
        </h1>
        <p className="text-sm text-gray-500">
          {results.length > 0 ? `총 ${results.length}개의 스트레칭을 찾았습니다` : '검색 결과가 없습니다'}
        </p>
      </div>

      {results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {results.slice(0, 4).map((r) => (
              <StretchCard key={`${r.stretch.id}-${r.type}`} stretch={r.stretch} categoryName={r.categoryName} />
            ))}
          </div>

          {results.length > 4 && (
            <>
              <AdUnit slot="rectangle" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {results.slice(4).map((r) => (
                  <StretchCard key={`${r.stretch.id}-${r.type}`} stretch={r.stretch} categoryName={r.categoryName} />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-lg font-bold text-gray-700 mb-2">검색 결과가 없습니다</h2>
          <p className="text-sm text-gray-400 mb-6">
            다른 키워드로 검색해 보세요.<br />
            예: 햄스트링, 종아리, 허리, 어깨 등
          </p>
          <Link href="/" className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-6 py-2.5 rounded-full transition">
            홈으로 돌아가기
          </Link>
        </div>
      )}

      <AdUnit slot="leaderboard" className="mt-8" />
    </div>
  );
}
