export interface ChallengeDay {
  day: number;
  title: string;
  stretches: string[]; // stretch IDs or names
  duration: string;    // e.g. "5분"
  focus: string;       // e.g. "하체 유연성"
}

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  totalDays: number;
  difficulty: '쉬움' | '보통' | '어려움';
  goal: string;
  benefits: string[];
  days: ChallengeDay[];
  color: string;       // Tailwind color class prefix
  gradient: string;
}

export const challenges: Challenge[] = [
  {
    id: 'flexibility-7',
    slug: '7-day-flexibility',
    title: '7일 유연성 챌린지',
    subtitle: '매일 10분으로 몸의 유연성을 높여보세요',
    icon: '🤸',
    totalDays: 7,
    difficulty: '쉬움',
    goal: '7일 간 매일 스트레칭으로 전신 유연성 향상',
    benefits: ['유연성 증가', '근육 긴장 완화', '혈액 순환 개선', '스트레스 해소'],
    color: 'green',
    gradient: 'linear-gradient(135deg,#22c55e,#16a34a)',
    days: [
      { day: 1, title: '하체 유연성', stretches: ['햄스트링 스트레칭', '종아리 스트레칭', '고관절 스트레칭'], duration: '10분', focus: '하체' },
      { day: 2, title: '상체 유연성', stretches: ['어깨 스트레칭', '목 스트레칭', '가슴 스트레칭'], duration: '10분', focus: '상체' },
      { day: 3, title: '허리 & 코어', stretches: ['허리 스트레칭', '척추 비틀기', '고양이·소 자세'], duration: '10분', focus: '허리' },
      { day: 4, title: '전신 스트레칭', stretches: ['전신 스트레칭', '옆구리 스트레칭', '고관절 굴곡근'], duration: '10분', focus: '전신' },
      { day: 5, title: '하체 심화', stretches: ['나비 자세', '비둘기 자세', '누운 햄스트링'], duration: '10분', focus: '하체 심화' },
      { day: 6, title: '상체 심화', stretches: ['어깨 회전', '가슴 열기', '목 심화 스트레칭'], duration: '10분', focus: '상체 심화' },
      { day: 7, title: '전신 통합', stretches: ['태양경배 자세', '전신 스트레칭 루틴', '마무리 이완'], duration: '15분', focus: '전신 통합' },
    ],
  },
  {
    id: 'morning-14',
    slug: '14-day-morning',
    title: '14일 아침 스트레칭',
    subtitle: '아침 5분으로 하루를 활기차게 시작하세요',
    icon: '🌅',
    totalDays: 14,
    difficulty: '쉬움',
    goal: '2주 간 매일 아침 스트레칭 습관 만들기',
    benefits: ['아침 기상 편의성', '하루 활력 증가', '수면 질 향상', '습관 형성'],
    color: 'amber',
    gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
    days: [
      { day: 1, title: '기상 직후 기지개', stretches: ['전신 기지개', '목 돌리기', '어깨 들썩이기'], duration: '5분', focus: '기상' },
      { day: 2, title: '척추 깨우기', stretches: ['고양이·소 자세', '척추 비틀기', '아기 자세'], duration: '5분', focus: '척추' },
      { day: 3, title: '하체 활성화', stretches: ['다리 올리기', '무릎 당기기', '고관절 스트레칭'], duration: '5분', focus: '하체' },
      { day: 4, title: '상체 활성화', stretches: ['팔 돌리기', '어깨 스트레칭', '가슴 열기'], duration: '5분', focus: '상체' },
      { day: 5, title: '허리 보호', stretches: ['허리 스트레칭', '코어 활성화', '골반 회전'], duration: '5분', focus: '허리' },
      { day: 6, title: '목 & 어깨', stretches: ['목 좌우 스트레칭', '어깨 누르기', '날개뼈 모으기'], duration: '5분', focus: '목·어깨' },
      { day: 7, title: '리뷰 & 휴식', stretches: ['가벼운 전신 스트레칭', '심호흡', '이완'], duration: '5분', focus: '이완' },
      { day: 8, title: '하체 심화 ①', stretches: ['스탠딩 햄스트링', '종아리 스트레칭', '발목 돌리기'], duration: '5분', focus: '하체' },
      { day: 9, title: '상체 심화 ①', stretches: ['삼두 스트레칭', '이두 스트레칭', '전완 스트레칭'], duration: '5분', focus: '상체' },
      { day: 10, title: '전신 흐름 ①', stretches: ['워리어 자세', '런지 스트레칭', '산 자세'], duration: '5분', focus: '전신' },
      { day: 11, title: '하체 심화 ②', stretches: ['나비 자세', '개구리 자세', '고관절 굴곡근'], duration: '5분', focus: '하체 심화' },
      { day: 12, title: '상체 심화 ②', stretches: ['가슴 심화', '등 상부 스트레칭', '어깨 심화'], duration: '5분', focus: '상체 심화' },
      { day: 13, title: '전신 흐름 ②', stretches: ['전신 스트레칭', '균형 자세', '코어 스트레칭'], duration: '5분', focus: '전신' },
      { day: 14, title: '챌린지 완주!', stretches: ['최애 스트레칭 모음', '심호흡 & 이완', '감사하기'], duration: '10분', focus: '완주' },
    ],
  },
  {
    id: 'office-worker-21',
    slug: '21-day-office',
    title: '21일 직장인 스트레칭',
    subtitle: '책상 앞 뭉친 몸을 3주 만에 풀어보세요',
    icon: '💼',
    totalDays: 21,
    difficulty: '보통',
    goal: '3주 간 직장인 필수 스트레칭으로 만성 통증 완화',
    benefits: ['목·어깨 통증 완화', '허리 통증 개선', '집중력 향상', '자세 교정'],
    color: 'blue',
    gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)',
    days: Array.from({ length: 21 }, (_, i) => {
      const focuses = ['목·어깨', '허리', '손목·팔', '눈 피로', '하체 혈액순환', '전신', '휴식'];
      const focus = focuses[i % 7];
      return {
        day: i + 1,
        title: `Day ${i + 1}: ${focus}`,
        stretches: [`${focus} 스트레칭 ①`, `${focus} 스트레칭 ②`, `${focus} 스트레칭 ③`],
        duration: '7분',
        focus,
      };
    }),
  },
  {
    id: 'flexibility-30',
    slug: '30-day-flexibility',
    title: '30일 유연성 마스터',
    subtitle: '한 달 꾸준한 스트레칭으로 몸의 변화를 느끼세요',
    icon: '🏆',
    totalDays: 30,
    difficulty: '어려움',
    goal: '30일 집중 스트레칭으로 전신 유연성 극대화',
    benefits: ['전신 유연성 극대화', '운동 퍼포먼스 향상', '부상 예방', '체형 교정', '정신 건강'],
    color: 'purple',
    gradient: 'linear-gradient(135deg,#a855f7,#7c3aed)',
    days: Array.from({ length: 30 }, (_, i) => {
      const week = Math.floor(i / 7) + 1;
      const focuses = ['하체', '상체', '허리·코어', '전신', '하체 심화', '상체 심화', '통합'];
      const focus = focuses[i % 7];
      return {
        day: i + 1,
        title: `Week ${week} Day ${(i % 7) + 1}: ${focus}`,
        stretches: [`${focus} 기본 스트레칭`, `${focus} 심화 스트레칭`, `${focus} 이완`],
        duration: i < 7 ? '10분' : i < 14 ? '12분' : i < 21 ? '15분' : '15분+',
        focus,
      };
    }),
  },
];

export function getChallengeBySlug(slug: string) {
  return challenges.find((c) => c.slug === slug);
}

export function getAllChallengeSlugs() {
  return challenges.map((c) => ({ slug: c.slug }));
}
