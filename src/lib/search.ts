import { exercises } from '@/data/exercises';
import { painAreas } from '@/data/pain-areas';
import { backPainData } from '@/data/back-pain';
import type { SearchResult } from '@/types';

export function searchAll(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return [];

  const results: SearchResult[] = [];

  // Search exercise stretches
  for (const exercise of exercises) {
    for (const stretch of exercise.beforeStretches) {
      if (matchStretch(stretch, q)) {
        results.push({
          stretch,
          categoryName: exercise.name,
          categorySlug: `/exercise/${exercise.slug}`,
          type: 'exercise-before',
        });
      }
    }
    for (const stretch of exercise.afterStretches) {
      if (matchStretch(stretch, q)) {
        results.push({
          stretch,
          categoryName: exercise.name,
          categorySlug: `/exercise/${exercise.slug}`,
          type: 'exercise-after',
        });
      }
    }
  }

  // Search pain area stretches
  for (const pain of painAreas) {
    for (const stretch of pain.stretches) {
      if (matchStretch(stretch, q)) {
        results.push({
          stretch,
          categoryName: pain.name,
          categorySlug: `/pain/${pain.slug}`,
          type: 'pain',
        });
      }
    }
  }

  // Search back pain stretches
  for (const stretch of [...backPainData.reliefStretches, ...backPainData.coreStretches]) {
    if (matchStretch(stretch, q)) {
      results.push({
        stretch,
        categoryName: '허리 디스크 예방',
        categorySlug: '/back-pain',
        type: 'back-pain',
      });
    }
  }

  // Deduplicate by stretch id
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.stretch.id)) return false;
    seen.add(r.stretch.id);
    return true;
  });
}

function matchStretch(
  stretch: { name: string; description: string; muscles: string[] },
  q: string,
): boolean {
  return (
    stretch.name.toLowerCase().includes(q) ||
    stretch.description.toLowerCase().includes(q) ||
    stretch.muscles.some((m) => m.toLowerCase().includes(q))
  );
}
