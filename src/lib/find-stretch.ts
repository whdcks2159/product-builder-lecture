import { exercises } from '@/data/exercises';
import { painAreas } from '@/data/pain-areas';
import { backPainData } from '@/data/back-pain';
import { withPhotos } from '@/lib/stretch-photos';
import { withMedia } from '@/data/stretch-media';
import type { Stretch } from '@/types';

export interface StretchWithContext {
  stretch: Stretch;
  categoryName: string;
  categorySlug: string;
  type: 'exercise-before' | 'exercise-after' | 'pain' | 'back-pain';
}

/** 모든 stretch ID 목록 (generateStaticParams용) */
export function getAllStretchIds(): string[] {
  const ids = new Set<string>();
  for (const ex of exercises) {
    [...ex.beforeStretches, ...ex.afterStretches].forEach((s) => ids.add(s.id));
  }
  for (const pa of painAreas) {
    pa.stretches.forEach((s) => ids.add(s.id));
  }
  [...backPainData.reliefStretches, ...backPainData.coreStretches].forEach((s) => ids.add(s.id));
  return Array.from(ids);
}

/** ID로 스트레칭 + 컨텍스트 조회 */
export function findStretchById(id: string): StretchWithContext | null {
  for (const ex of exercises) {
    for (const s of ex.beforeStretches) {
      if (s.id === id) return {
        stretch: withMedia(withPhotos([s]))[0],
        categoryName: `${ex.name} (운동 전)`,
        categorySlug: `/exercise/${ex.slug}`,
        type: 'exercise-before',
      };
    }
    for (const s of ex.afterStretches) {
      if (s.id === id) return {
        stretch: withMedia(withPhotos([s]))[0],
        categoryName: `${ex.name} (운동 후)`,
        categorySlug: `/exercise/${ex.slug}`,
        type: 'exercise-after',
      };
    }
  }
  for (const pa of painAreas) {
    for (const s of pa.stretches) {
      if (s.id === id) return {
        stretch: withMedia(withPhotos([s]))[0],
        categoryName: pa.name,
        categorySlug: `/pain/${pa.slug}`,
        type: 'pain',
      };
    }
  }
  for (const s of [...backPainData.reliefStretches, ...backPainData.coreStretches]) {
    if (s.id === id) return {
      stretch: withMedia(withPhotos([s]))[0],
      categoryName: '허리 디스크 예방',
      categorySlug: '/back-pain',
      type: 'back-pain',
    };
  }
  return null;
}
