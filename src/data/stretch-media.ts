// ── 스트레칭 미디어 데이터 ─────────────────────────────────────────────
// youtubeId: 실제 YouTube 영상 ID (Bob & Brad, AthleanX, Yoga with Adriene 등)
//   채널 확인: https://www.youtube.com/watch?v={youtubeId}
// gifUrl   : public/gifs/ 폴더에 파일 추가 후 '/gifs/파일명.gif' 형태로 사용

export interface StretchMedia {
  youtubeId?: string;
  gifUrl?: string;
}

// ── stretch id → 미디어 매핑 (실제 ID 기준으로 작성) ──────────────────
export const STRETCH_MEDIA: Record<string, StretchMedia> = {

  // ─────── 러닝 (Running) ───────────────────────────────────────────
  'calf-stretch-before': {
    youtubeId: 'VElAIIvcSls',   // Bob & Brad: Calf Stretches
  },
  'calf-cooldown': {
    youtubeId: 'VElAIIvcSls',
  },
  'hip-flexor-before': {
    youtubeId: 'RA0w_v08Bpc',   // Bob & Brad: Hip Flexor Stretch
  },
  'hamstring-stretch': {
    youtubeId: '77gJLUEFanc',   // Bob & Brad: Hamstring Stretch
  },
  'it-band-stretch': {
    youtubeId: 'PJYGIlht6E4',   // Bob & Brad: IT Band Stretch
  },
  'glute-stretch': {
    youtubeId: 'DsHvuYMt45g',   // Bob & Brad: Piriformis / Glute Stretch
  },
  'piriformis-golf': {
    youtubeId: 'DsHvuYMt45g',
  },

  // ─────── 헬스 (Weight Training) ───────────────────────────────────
  'chest-stretch': {
    youtubeId: 'SV7l1sfEmO0',   // AthleanX: How to Stretch Your Chest
  },
  'chest-opener': {
    youtubeId: 'SV7l1sfEmO0',
  },
  'lat-stretch': {
    youtubeId: 'm4-MLaa4nCs',   // AthleanX: Morning Stretch (Lat & Back)
  },
  'tricep-stretch': {
    youtubeId: 'G9uZ7fxgBjY',   // AthleanX: Tricep Stretch
  },
  'quad-hamstring': {
    youtubeId: '2hKbghN2fUE',   // AthleanX: Quad Stretch
  },

  // ─────── 요가 (Yoga) ──────────────────────────────────────────────
  'cat-cow-yoga': {
    youtubeId: 'y39PrKY_4JM',   // Yoga with Adriene: Cat-Cow Pose
  },
  'child-pose-yoga': {
    youtubeId: 'eqVMAPM00DM',   // Yoga with Adriene: Child's Pose
  },
  'supine-twist-yoga': {
    youtubeId: 'mKC3IeldPOc',   // Yoga with Adriene: Reclined Twist
  },
  'pigeon-prep-yoga': {
    youtubeId: 'g70Jq2NjQwY',   // AthleanX: Hip Stretch / Pigeon Pose
  },
  'seated-forward-fold': {
    youtubeId: '77gJLUEFanc',   // Bob & Brad: Hamstring / Forward Fold
  },
  'savasana': {
    youtubeId: 'eqVMAPM00DM',   // Yoga with Adriene: Relaxation
  },

  // ─────── 홈 (Home Fitness) ────────────────────────────────────────
  'cobra-home': {
    youtubeId: 'n6jrC6WeF84',   // Yoga with Adriene: Cobra Pose
  },
  'child-pose-home': {
    youtubeId: 'eqVMAPM00DM',
  },
  'doorway-chest-home': {
    youtubeId: 'pt5IeRJ4kSM',   // Bob & Brad: Doorway Chest Stretch
  },
  'hip-circle-home': {
    youtubeId: 'b8tuWH1-sFQ',   // Bob & Brad: Hip Circle Mobility
  },
  'pigeon-home': {
    youtubeId: 'g70Jq2NjQwY',
  },

  // ─────── 통증 부위별 (Pain Areas) ────────────────────────────────
  // 허리 통증
  'lower-back': {
    youtubeId: 'm4-MLaa4nCs',
  },
  'cat-cow-pain': {
    youtubeId: 'y39PrKY_4JM',
  },
  'child-pose-pain': {
    youtubeId: 'eqVMAPM00DM',
  },
  'knee-to-chest-pain': {
    youtubeId: 'eqVMAPM00DM',
  },
  'spinal-twist-pain': {
    youtubeId: 'mKC3IeldPOc',
  },

  // 어깨 통증
  'cross-body-shoulder': {
    youtubeId: '0IkHB763nPk',   // Bob & Brad: Shoulder Exercises
  },
  'chest-opener-shoulder': {
    youtubeId: 'SV7l1sfEmO0',
  },
  'shoulder-blade-pilates': {
    youtubeId: '0IkHB763nPk',
  },

  // 목 통증
  'neck-side-tilt': {
    youtubeId: 'Ap3nqtRSDbQ',   // Bob & Brad: Neck Stretch
  },
  'neck-rotation': {
    youtubeId: 'Ap3nqtRSDbQ',
  },
  'chin-tuck': {
    youtubeId: 'Ap3nqtRSDbQ',
  },
  'neck-shoulder': {
    youtubeId: 'Ap3nqtRSDbQ',
  },

  // 햄스트링
  'hamstring': {
    youtubeId: '77gJLUEFanc',
  },
  'lying-hamstring': {
    youtubeId: '77gJLUEFanc',
  },
  'lunge-hamstring': {
    youtubeId: 'RA0w_v08Bpc',
  },
  'downward-dog-hamstring': {
    youtubeId: 'j97SSGsnCAQ',   // Yoga with Adriene: Downward Dog
  },

  // 고관절 통증
  'pigeon-hip': {
    youtubeId: 'g70Jq2NjQwY',
  },
  'hip-flexor-hip': {
    youtubeId: 'RA0w_v08Bpc',
  },
  'figure-four-hip': {
    youtubeId: 'DsHvuYMt45g',
  },
  'hip-circle-pain': {
    youtubeId: 'b8tuWH1-sFQ',
  },
  'lateral-hip-stretch': {
    youtubeId: 'DsHvuYMt45g',
  },
  'piriformis-pain': {
    youtubeId: 'DsHvuYMt45g',
  },

  // 무릎 통증
  'quad-stretch-knee': {
    youtubeId: '2hKbghN2fUE',
  },
  'hamstring-knee': {
    youtubeId: '77gJLUEFanc',
  },
  'it-band-knee': {
    youtubeId: 'PJYGIlht6E4',
  },

  // 종아리 통증
  'calf': {
    youtubeId: 'VElAIIvcSls',
  },
  'calf-knee': {
    youtubeId: 'VElAIIvcSls',
  },
  'ankle-circle-calf': {
    youtubeId: 'b8tuWH1-sFQ',
  },

  // ─────── 허리 디스크 (Back Pain) ──────────────────────────────────
  'cat-cow-bp': {
    youtubeId: 'y39PrKY_4JM',
  },
  'child-pose-bp': {
    youtubeId: 'eqVMAPM00DM',
  },
  'spinal-twist-bp': {
    youtubeId: 'mKC3IeldPOc',
  },
  'knee-to-chest-bp': {
    youtubeId: 'eqVMAPM00DM',
  },
  'glute-bridge-bp': {
    youtubeId: 'b8tuWH1-sFQ',
  },

  // ─────── 필라테스 (Pilates) ────────────────────────────────────────
  'hip-flexor-pilates': {
    youtubeId: 'RA0w_v08Bpc',
  },
  'spine-stretch-pilates': {
    youtubeId: 'm4-MLaa4nCs',
  },
  'mermaid-pilates': {
    youtubeId: 'm4-MLaa4nCs',
  },

  // ─────── 골프 (Golf) ──────────────────────────────────────────────
  'torso-rotation': {
    youtubeId: 'b8tuWH1-sFQ',
  },
  'thoracic-golf': {
    youtubeId: 'm4-MLaa4nCs',
  },
  'back-golf': {
    youtubeId: 'm4-MLaa4nCs',
  },

  // ─────── 사이클링 (Cycling) ────────────────────────────────────────
  'hip-flexor-cycling': {
    youtubeId: 'RA0w_v08Bpc',
  },
  'back-stretch-cycling': {
    youtubeId: 'm4-MLaa4nCs',
  },
  'neck-warmup-cycling': {
    youtubeId: 'Ap3nqtRSDbQ',
  },
  'quad-stretch-cycling': {
    youtubeId: '2hKbghN2fUE',
  },
};

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
