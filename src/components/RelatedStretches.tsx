import Link from 'next/link';
import { exercises } from '@/data/exercises';
import { painAreas } from '@/data/pain-areas';
import type { Stretch } from '@/types';

interface RelatedStretchItem {
  stretch: Stretch;
  label: string;
  href: string;
}

interface Props {
  currentId: string;
  muscles: string[];
  limit?: number;
}

export default function RelatedStretches({ currentId, muscles, limit = 4 }: Props) {
  const scored: Array<RelatedStretchItem & { score: number }> = [];

  const allPools: Array<{ stretch: Stretch; label: string; href: string }> = [
    ...exercises.flatMap((ex) => [
      ...(ex.beforeStretches ?? []).map((s) => ({ stretch: s, label: `${ex.name} 전`, href: `/exercise/${ex.slug}` })),
      ...(ex.afterStretches ?? []).map((s) => ({ stretch: s, label: `${ex.name} 후`, href: `/exercise/${ex.slug}` })),
    ]),
    ...painAreas.flatMap((pa) =>
      (pa.stretches ?? []).map((s) => ({ stretch: s, label: pa.name, href: `/pain/${pa.slug}` }))
    ),
  ];

  for (const item of allPools) {
    if (item.stretch.id === currentId) continue;
    const overlap = item.stretch.muscles.filter((m) => muscles.includes(m)).length;
    if (overlap > 0) scored.push({ ...item, score: overlap });
  }

  scored.sort((a, b) => b.score - a.score);
  const unique = scored.filter((item, i, arr) => arr.findIndex((x) => x.stretch.id === item.stretch.id) === i);
  const results = unique.slice(0, limit);

  if (results.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-base font-bold text-gray-900 mb-4">추천 스트레칭</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map(({ stretch, label, href }) => (
          <Link
            key={stretch.id}
            href={href}
            className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 transition-all hover:-translate-y-0.5"
          >
            <span className="text-2xl shrink-0">{stretch.icon ?? '🤸'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{stretch.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-gray-400">{label}</span>
                <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">
                  {stretch.muscles.slice(0, 2).join(' · ')}
                </span>
              </div>
            </div>
            <span className="text-gray-300 text-sm">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
