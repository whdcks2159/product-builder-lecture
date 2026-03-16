// ── 스트레칭 미디어 데이터 ─────────────────────────────────────────────
// youtubeId: YouTube 영상 ID (embed 용)
//   → https://www.youtube.com/watch?v={youtubeId}
//   → 교체 방법: YouTube 영상 URL에서 ?v= 뒤의 값을 복사
// gifUrl   : GIF 애니메이션 URL (절대 경로 or 외부 URL)
//   → public/gifs/ 폴더에 추가 후 '/gifs/filename.gif' 형태로 사용 가능

export interface StretchMedia {
  youtubeId?: string;
  gifUrl?: string;
}

// stretch id → 미디어 매핑
export const STRETCH_MEDIA: Record<string, StretchMedia> = {

  // ── 러닝 전 ────────────────────────────────────────────────
  'calf-stretch-before': {
    youtubeId: 'Qk6mkKhGrFg',   // Calf Stretch - Bob & Brad
  },
  'hip-flexor-before': {
    youtubeId: 'YqF9Lw-rku4',   // Hip Flexor Stretch
  },
  'hamstring-before': {
    youtubeId: 'BVX9JlRHGps',   // Standing Hamstring Stretch
  },
  'ankle-circles': {
    youtubeId: '4pRmMGNXWqg',   // Ankle Mobility
  },

  // ── 러닝 후 ────────────────────────────────────────────────
  'hamstring-after': {
    youtubeId: 'BVX9JlRHGps',
  },
  'calf-stretch-after': {
    youtubeId: 'Qk6mkKhGrFg',
  },
  'it-band-stretch': {
    youtubeId: 'P9E4wAILB2o',   // IT Band Stretch
  },
  'piriformis-stretch': {
    youtubeId: 'Ph9YSRRNGlc',   // Piriformis Stretch
  },

  // ── 헬스 ───────────────────────────────────────────────────
  'chest-stretch': {
    youtubeId: 'IvtBRVSMcjA',   // Chest / Pec Stretch
  },
  'shoulder-cross-stretch': {
    youtubeId: 'hUOhfxXHpQw',   // Cross Body Shoulder Stretch
  },
  'triceps-stretch': {
    youtubeId: 'Fk6GlXlBBRY',   // Triceps Overhead Stretch
  },
  'lat-stretch': {
    youtubeId: 'i1wYuH2WSGE',   // Lat Stretch
  },
  'quad-stretch': {
    youtubeId: 'OUl9BZ_Y2oI',   // Standing Quad Stretch
  },

  // ── 허리 통증 / 코어 ───────────────────────────────────────
  'cat-cow': {
    youtubeId: 'kqnua4rHVVA',   // Cat Cow Stretch
  },
  'child-pose': {
    youtubeId: 'eqVMAPM00Vc',   // Child's Pose
  },
  'spinal-twist': {
    youtubeId: 'mmHKFfU4iKI',   // Supine Spinal Twist
  },
  'knees-to-chest': {
    youtubeId: 'i9sJ5aeMXGM',   // Knees to Chest
  },
  'cobra-pose': {
    youtubeId: 'JDcdhTuycOI',   // Cobra Stretch
  },
  'pelvic-tilt': {
    youtubeId: 'OGqhGBEzrRg',   // Pelvic Tilt
  },

  // ── 어깨 / 목 ──────────────────────────────────────────────
  'neck-tilt': {
    youtubeId: 'GMAsKJB0A6w',   // Neck Lateral Flexion
  },
  'neck-rotation': {
    youtubeId: 'nV3LjLkkCNY',   // Neck Rotation Stretch
  },
  'shoulder-roll': {
    youtubeId: 'OKFPQhHqGEw',   // Shoulder Roll
  },
  'doorway-chest-stretch': {
    youtubeId: 'kVRvRNFBqDY',   // Doorway Chest Stretch
  },

  // ── 고관절 / 하체 ──────────────────────────────────────────
  'butterfly-stretch': {
    youtubeId: 'EYYIMiGBMYM',   // Butterfly Stretch
  },
  'pigeon-pose': {
    youtubeId: 'Ph9YSRRNGlc',   // Pigeon Pose
  },
  'hip-circle': {
    youtubeId: 'K7sCEv3XBBU',   // Hip Circles
  },
  'deep-lunge': {
    youtubeId: 'YqF9Lw-rku4',
  },

  // ── 요가 / 전신 ────────────────────────────────────────────
  'downward-dog': {
    youtubeId: 'j97SSGsnCAQ',   // Downward Facing Dog
  },
  'warrior-pose': {
    youtubeId: 'k4CkVQPaxpI',   // Warrior I Pose
  },
  'side-stretch': {
    youtubeId: 'QE6PNBCSHCA',   // Standing Side Stretch
  },
  'forward-fold': {
    youtubeId: 'g7Uhp5tphAs',   // Standing Forward Fold
  },

  // ── 무릎 / 종아리 ──────────────────────────────────────────
  'quad-stretch-standing': {
    youtubeId: 'OUl9BZ_Y2oI',
  },
  'hamstring-seated': {
    youtubeId: 'BVX9JlRHGps',
  },
};

// ─────────────────────────────────────────────────────────────────────
// stretch id에 미디어 데이터를 주입하는 헬퍼
// ─────────────────────────────────────────────────────────────────────
import type { Stretch } from '@/types';

export function withMedia<T extends Stretch>(stretches: T[]): T[] {
  return stretches.map((s) => {
    const media = STRETCH_MEDIA[s.id];
    if (!media) return s;
    return { ...s, ...media };
  });
}

export function getMedia(stretchId: string): StretchMedia | undefined {
  return STRETCH_MEDIA[stretchId];
}
