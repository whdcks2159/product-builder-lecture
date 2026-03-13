import photosData from '@/data/stretch-photos.json';
import type { Stretch, StretchPhoto } from '@/types';

type PhotosMap = Record<string, StretchPhoto>;
const photos = photosData as PhotosMap;

/** 스트레칭 객체에 사진 정보를 병합해 반환합니다 */
export function withPhoto(stretch: Stretch): Stretch {
  const p = photos[stretch.id];
  if (!p) return stretch;
  return {
    ...stretch,
    photo_url: p.photo_url,
    photo_credit: p.photo_credit,
    photo_credit_url: p.photo_credit_url,
    photo_source: p.photo_source,
    photo_source_url: p.photo_source_url,
  };
}

/** 스트레칭 배열 전체에 사진 정보를 병합합니다 */
export function withPhotos(stretches: Stretch[]): Stretch[] {
  return stretches.map(withPhoto);
}

/** ID로 사진 정보만 조회합니다 */
export function getPhoto(id: string): StretchPhoto | null {
  return photos[id] ?? null;
}
