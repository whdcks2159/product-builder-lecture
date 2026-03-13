import type { Stretch } from '@/types';

export const EXERCISES = [
  { id: 'running', name: '러닝', en: 'Running', slug: 'running-stretching', muscles: ['햄스트링', '종아리', '고관절', '무릎', '허리'] },
  { id: 'weight', name: '헬스·웨이트', en: 'Weight Training', slug: 'weight-training-stretching', muscles: ['어깨', '허리', '가슴', '삼두근', '이두근'] },
  { id: 'soccer', name: '축구', en: 'Soccer', slug: 'soccer-stretching', muscles: ['햄스트링', '종아리', '고관절', '무릎', '허벅지'] },
  { id: 'golf', name: '골프', en: 'Golf', slug: 'golf-stretching', muscles: ['어깨', '허리', '고관절', '손목', '목'] },
  { id: 'cycling', name: '자전거', en: 'Cycling', slug: 'cycling-stretching', muscles: ['햄스트링', '종아리', '무릎', '허리', '목'] },
  { id: 'hiking', name: '등산', en: 'Hiking', slug: 'hiking-stretching', muscles: ['종아리', '무릎', '고관절', '허벅지', '허리'] },
  { id: 'basketball', name: '농구', en: 'Basketball', slug: 'basketball-stretching', muscles: ['고관절', '무릎', '종아리', '어깨', '햄스트링'] },
  { id: 'tennis', name: '테니스', en: 'Tennis', slug: 'tennis-stretching', muscles: ['어깨', '손목', '팔꿈치', '허리', '종아리'] },
] as const;

export const BODY_PARTS = [
  { id: 'hamstring', name: '햄스트링', en: 'Hamstring', ko: '햄스트링', muscles: ['햄스트링', '허벅지 뒤쪽'], painSlug: 'hamstring-pain' },
  { id: 'calf', name: '종아리', en: 'Calf', ko: '종아리', muscles: ['종아리', '아킬레스건'], painSlug: 'calf-pain' },
  { id: 'lower-back', name: '허리', en: 'Lower Back', ko: '허리', muscles: ['허리', '요추', '척추'], painSlug: 'lower-back-pain' },
  { id: 'shoulder', name: '어깨', en: 'Shoulder', ko: '어깨', muscles: ['어깨', '삼각근', '회전근개'], painSlug: 'shoulder-pain' },
  { id: 'hip', name: '고관절', en: 'Hip', ko: '고관절', muscles: ['고관절', '둔근', '엉덩이'], painSlug: 'hip-pain' },
  { id: 'knee', name: '무릎', en: 'Knee', ko: '무릎', muscles: ['무릎', '대퇴사두근', '슬개골'], painSlug: 'knee-pain' },
  { id: 'neck', name: '목', en: 'Neck', ko: '목', muscles: ['목', '승모근', '경추'], painSlug: 'neck-pain' },
] as const;

export const PURPOSES = [
  { id: 'before', name: '운동 전', en: 'Pre-workout', desc: '운동 전 워밍업' },
  { id: 'after', name: '운동 후', en: 'Post-workout', desc: '운동 후 쿨다운' },
  { id: 'pain-relief', name: '통증 완화', en: 'Pain Relief', desc: '통증 완화 및 회복' },
  { id: 'flexibility', name: '유연성 향상', en: 'Flexibility', desc: '유연성 및 가동성 향상' },
] as const;

export type ExerciseId = (typeof EXERCISES)[number]['id'];
export type BodyPartId = (typeof BODY_PARTS)[number]['id'];
export type PurposeId = (typeof PURPOSES)[number]['id'];

export type SeoPageType =
  | { type: 'exercise-body'; exerciseId: ExerciseId; bodyPartId: BodyPartId }
  | { type: 'exercise-timing'; exerciseId: ExerciseId; timing: 'before' | 'after' }
  | { type: 'body-purpose'; bodyPartId: BodyPartId; purposeId: PurposeId };

export interface SeoCombo {
  slug: string;
  type: SeoPageType['type'];
  title: string;
  titleEn: string;
  description: string;
  h1: string;
  keywords: string[];
  exerciseId?: ExerciseId;
  bodyPartId?: BodyPartId;
  purposeId?: PurposeId;
  timing?: 'before' | 'after';
  relatedExerciseSlug?: string;
  relatedPainSlug?: string;
  muscleFilter: readonly string[];
}

export function generateAllCombos(): SeoCombo[] {
  const combos: SeoCombo[] = [];

  // 1. exercise × body-part (56 pages)
  for (const ex of EXERCISES) {
    for (const bp of BODY_PARTS) {
      combos.push({
        slug: `${ex.id}-${bp.id}`,
        type: 'exercise-body',
        title: `${ex.name} ${bp.name} 스트레칭 | 부상 예방 가이드`,
        titleEn: `${ex.en} ${bp.en} Stretch Guide`,
        description: `${ex.name} 시 ${bp.name} 부상을 예방하는 효과적인 스트레칭 방법을 알아보세요. 전문가가 추천하는 ${bp.name} 스트레칭으로 운동 성능을 높이세요.`,
        h1: `${ex.name} ${bp.name} 스트레칭`,
        keywords: [`${ex.name} ${bp.name} 스트레칭`, `${ex.name} 부상 예방`, `${bp.name} 스트레칭`, `${ex.en.toLowerCase()} ${bp.en.toLowerCase()} stretch`],
        exerciseId: ex.id,
        bodyPartId: bp.id,
        relatedExerciseSlug: ex.slug,
        relatedPainSlug: bp.painSlug,
        muscleFilter: [...bp.muscles, ...ex.muscles.filter(m => bp.muscles.some(bm => m.includes(bm) || bm.includes(m)))],
      });
    }
  }

  // 2. exercise × timing (16 pages)
  for (const ex of EXERCISES) {
    for (const timing of ['before', 'after'] as const) {
      const timingKo = timing === 'before' ? '전' : '후';
      const timingDesc = timing === 'before' ? '워밍업으로 부상을 예방하고 운동 성능을 높이세요' : '쿨다운으로 근육 피로를 빠르게 회복하세요';
      combos.push({
        slug: `${ex.id}-${timing}`,
        type: 'exercise-timing',
        title: `${ex.name} 운동 ${timingKo} 스트레칭 | 필수 ${timing === 'before' ? '워밍업' : '쿨다운'}`,
        titleEn: `${ex.en} ${timing === 'before' ? 'Pre-workout' : 'Post-workout'} Stretching Guide`,
        description: `${ex.name} 운동 ${timingKo} ${timingDesc}. 전문가가 추천하는 ${ex.name} ${timing === 'before' ? '준비운동' : '마무리운동'} 루틴을 확인하세요.`,
        h1: `${ex.name} 운동 ${timingKo} 스트레칭`,
        keywords: [`${ex.name} 운동 ${timingKo} 스트레칭`, `${ex.name} ${timing === 'before' ? '준비운동' : '마무리운동'}`, `${ex.en.toLowerCase()} ${timing} stretch`],
        exerciseId: ex.id,
        timing,
        relatedExerciseSlug: ex.slug,
        muscleFilter: ex.muscles,
      });
    }
  }

  // 3. body-part × purpose (28 pages)
  for (const bp of BODY_PARTS) {
    for (const purpose of PURPOSES) {
      combos.push({
        slug: `${bp.id}-${purpose.id}`,
        type: 'body-purpose',
        title: `${bp.name} ${purpose.name} 스트레칭 | 효과적인 방법`,
        titleEn: `${bp.en} ${purpose.en} Stretching Guide`,
        description: `${bp.name} ${purpose.desc}에 효과적인 스트레칭을 소개합니다. ${bp.name} 통증 완화와 유연성 향상을 위한 최적의 스트레칭 루틴을 확인하세요.`,
        h1: `${bp.name} ${purpose.name} 스트레칭`,
        keywords: [`${bp.name} ${purpose.name}`, `${bp.name} 스트레칭`, `${bp.en.toLowerCase()} ${purpose.en.toLowerCase()}`, `${bp.name} 통증`],
        bodyPartId: bp.id,
        purposeId: purpose.id,
        relatedPainSlug: bp.painSlug,
        muscleFilter: bp.muscles,
      });
    }
  }

  return combos;
}

export const ALL_COMBOS = generateAllCombos();
export const COMBO_MAP = new Map(ALL_COMBOS.map(c => [c.slug, c]));
