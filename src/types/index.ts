// ── Core Types ────────────────────────────────────────────────────────

export interface StretchStep {
  step: number;
  description: string;
  photo_prompt?: string;
  photo_keyword?: string;
  image_url?: string;    // 단계별 이미지
}

export interface StretchPhoto {
  photo_url: string;         // /stretch-images/{id}.jpg
  photo_credit: string;      // 사진작가 이름
  photo_credit_url: string;  // 사진작가 프로필 URL
  photo_source: string;      // 'Pexels'
  photo_source_url: string;  // 원본 페이지 URL
  pexels_id?: number;
  original_url?: string;
}

export interface Stretch {
  id: string;
  name: string;
  description: string;
  muscles: string[];
  holdTime: string;
  steps: string[];
  detailedSteps?: StretchStep[];
  icon: string;
  difficulty?: '쉬움' | '보통' | '어려움';
  imageAlt?: string;
  // 미디어
  youtubeId?: string;    // YouTube 영상 ID (embed)
  gifUrl?: string;       // GIF 애니메이션 URL
  // 사진 정보 (fetch-stretch-images.mjs 실행 후 자동 채워짐)
  photo_url?: string;
  photo_credit?: string;
  photo_credit_url?: string;
  photo_source?: string;
  photo_source_url?: string;
}

export interface Exercise {
  id: string;
  slug: string;
  name: string;
  englishName: string;
  icon: string;
  gradient: string;
  lightBg: string;
  accentColor: string;
  shortDesc: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  relatedMuscles: string[];
  beforeStretches: Stretch[];
  afterStretches: Stretch[];
}

export interface PainArea {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  stretches: Stretch[];
}

export interface BackPainData {
  cautions: string[];
  reliefStretches: Stretch[];
  coreStretches: Stretch[];
}

export interface SearchResult {
  stretch: Stretch;
  categoryName: string;
  categorySlug: string;
  type: 'exercise-before' | 'exercise-after' | 'pain' | 'back-pain';
}
