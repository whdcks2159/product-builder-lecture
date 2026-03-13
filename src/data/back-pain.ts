import type { BackPainData } from '@/types';

export const backPainData: BackPainData = {
  cautions: [
    '운동 중 통증이 심해지면 즉시 중단하고 전문의에게 상담하세요.',
    '급성기(통증이 극심한 시기)에는 안정을 취하는 것이 우선입니다.',
    '허리를 구부리는 동작보다 신전(뒤로 젖히기) 동작이 디스크에 더 유리한 경우가 많습니다.',
    '다리 저림이나 감각 이상이 동반되면 반드시 전문의를 만나세요.',
    '모든 스트레칭은 통증 없는 범위 내에서 실시하세요.',
  ],
  reliefStretches: [
    {
      id: 'knee-to-chest-bp',
      name: '무릎 가슴으로 당기기',
      description: '허리 근육을 부드럽게 이완하고 통증을 즉각적으로 완화하는 기본 스트레칭입니다.',
      muscles: ['척추기립근', '요방형근', '둔근'],
      holdTime: '30초 × 3세트',
      steps: ['등을 대고 누워 무릎을 구부립니다.', '양손으로 한쪽 무릎을 잡아 가슴 쪽으로 부드럽게 당깁니다.', '허리가 바닥에 완전히 닿는 느낌을 30초 유지합니다.', '반대쪽을 반복한 뒤, 마지막에는 양 무릎을 함께 당깁니다.'],
      detailedSteps: [
        {
          step: 1,
          description: '매트 위에 등을 대고 바르게 눕습니다. 양 무릎은 세우고 발바닥을 바닥에 붙입니다.',
          photo_prompt: 'simple fitness illustration of a person lying flat on back on a yoga mat with knees bent and feet flat on floor, relaxed starting position, clean white background, minimal instructional style',
          photo_keyword: 'supine position yoga mat knees bent illustration',
        },
        {
          step: 2,
          description: '양손으로 오른쪽 무릎을 감싸 쥐고 천천히 가슴 쪽으로 당깁니다. 반대쪽 다리는 바닥에 편안히 놓습니다.',
          photo_prompt: 'simple fitness illustration of a person lying on back pulling right knee toward chest with both hands, left leg extended on floor, lower back stretch, clean white background, minimal instructional style',
          photo_keyword: 'single knee to chest stretch illustration lower back',
        },
        {
          step: 3,
          description: '무릎을 가슴에 최대한 가까이 당긴 상태에서 30초간 유지합니다. 허리가 바닥에 완전히 닿도록 의식합니다.',
          photo_prompt: 'simple fitness illustration of a person lying on back with knee fully pulled to chest, both hands clasping knee, spine flat on mat, holding stretch position, clean white background, minimal instructional style',
          photo_keyword: 'knee to chest hold stretch lower back relief illustration',
        },
        {
          step: 4,
          description: '천천히 무릎을 내려놓고 반대쪽(왼쪽) 무릎으로 동일하게 반복합니다.',
          photo_prompt: 'simple fitness illustration of a person lying on back pulling left knee toward chest with both hands, right leg extended on floor, alternating knee stretch, clean white background, minimal instructional style',
          photo_keyword: 'alternating knee to chest stretch illustration',
        },
        {
          step: 5,
          description: '마지막으로 양 무릎을 동시에 가슴 쪽으로 당겨 30초 유지합니다. 등 전체가 스트레칭되는 느낌을 확인합니다.',
          photo_prompt: 'simple fitness illustration of a person lying on back with both knees pulled to chest simultaneously, arms wrapped around both shins, full lower back and spine stretch, clean white background, minimal instructional style',
          photo_keyword: 'double knee to chest stretch both knees illustration',
        },
      ],
      icon: '🦵',
      difficulty: '쉬움' as const,
    },
    {
      id: 'cat-cow-bp',
      name: '캣-카우 척추 운동',
      description: '척추를 부드럽게 굴곡·신전하여 디스크 영양 공급을 돕고 허리 유연성을 향상시킵니다.',
      muscles: ['척추기립근', '복근', '허리관절'],
      holdTime: '10~15회 반복',
      steps: ['손과 무릎을 짚고 테이블 자세를 취합니다.', '숨을 들이마시며 허리를 아래로 내리고 고개를 들어 올립니다(카우).', '숨을 내쉬며 허리를 위로 둥글게 올리고 턱을 당깁니다(캣).', '호흡에 맞춰 천천히 10~15회 반복합니다.'],
      detailedSteps: [
        {
          step: 1,
          description: '손과 무릎을 바닥에 대고 테이블 자세(네발기기)를 취합니다. 손목은 어깨 아래, 무릎은 엉덩이 아래에 위치합니다. 등은 천장과 수평으로 평평하게 유지합니다.',
          photo_prompt: 'simple fitness illustration of a person in table-top position on all fours, hands directly under shoulders, knees under hips, neutral flat spine, starting position for cat-cow stretch, clean white background, minimal instructional style',
          photo_keyword: 'table top position all fours neutral spine cat cow start illustration',
        },
        {
          step: 2,
          description: '[카우 자세] 숨을 들이쉬면서 천천히 배를 바닥 쪽으로 내립니다. 꼬리뼈와 머리를 천장 쪽으로 들어 등이 아치형이 되도록 합니다. 5초 유지.',
          photo_prompt: 'simple fitness illustration of a person in cow pose on all fours, belly dropping toward floor, tailbone and head lifting upward, spine arching downward, inhale position of cat-cow stretch, clean white background, minimal instructional style',
          photo_keyword: 'cow pose cat-cow stretch spine arch downward belly drop illustration',
        },
        {
          step: 3,
          description: '[캣 자세] 숨을 내쉬면서 천천히 배를 천장 쪽으로 당기고 등을 둥글게 굽힙니다. 턱은 가슴 쪽으로 당기고 꼬리뼈는 아래를 향합니다. 5초 유지.',
          photo_prompt: 'simple fitness illustration of a person in cat pose on all fours, back rounding upward like a cat, belly pulling in, chin tucked to chest, tailbone pointing down, exhale position of cat-cow stretch, clean white background, minimal instructional style',
          photo_keyword: 'cat pose cat-cow stretch spine round upward back arch illustration',
        },
        {
          step: 4,
          description: '카우 → 캣 자세를 호흡에 맞춰 천천히 번갈아 반복합니다. 각 자세에서 5초씩 충분히 유지합니다.',
          photo_prompt: 'simple fitness illustration showing two side-by-side positions: cow pose with spine dipping and cat pose with spine rounding, arrows indicating the flowing movement between positions, clean white background, minimal instructional style',
          photo_keyword: 'cat cow alternating movement flow illustration spine mobility',
        },
        {
          step: 5,
          description: '10~15회 반복 후 중립 자세로 돌아와 잠시 휴식합니다. 통증이 심해지면 즉시 중단합니다.',
          photo_prompt: 'simple fitness illustration of a person returning to neutral table-top position on all fours after cat-cow exercise, spine level and relaxed, resting position, clean white background, minimal instructional style',
          photo_keyword: 'table top neutral rest position after cat cow exercise illustration',
        },
      ],
      icon: '🐱',
      difficulty: '쉬움' as const,
    },
    { id: 'child-pose-bp', name: '아이 자세 (허리 이완)', description: '허리 후면 근육 전체를 이완하고 디스크에 가해지는 압박을 감소시킵니다.', muscles: ['척추기립근', '광배근', '요방형근'], holdTime: '40~60초', steps: ['무릎을 모아 바닥에 앉습니다.', '상체를 앞으로 숙이며 팔을 앞으로 길게 뻗습니다.', '이마를 바닥에 대고 허리가 완전히 이완되도록 합니다.', '40~60초 자연스럽게 호흡하며 유지합니다.'], icon: '🙏', difficulty: '쉬움' },
    { id: 'spinal-twist-bp', name: '누운 척추 회전', description: '척추 주변 근육의 좌우 불균형을 교정하고 긴장을 이완합니다.', muscles: ['복사근', '이상근', '척추회전근'], holdTime: '30초 × 양쪽', steps: ['등을 대고 누워 무릎을 세웁니다.', '양팔을 옆으로 T자로 뻗습니다.', '무릎을 천천히 한쪽으로 넘기고 어깨는 바닥에 붙입니다.', '30초 유지 후 반대쪽으로 넘깁니다.'], icon: '🔀', difficulty: '쉬움' },
  ],
  coreStretches: [
    { id: 'dead-bug-bp', name: '데드버그 운동', description: '허리에 부담 없이 코어를 강화하는 재활 운동의 핵심 동작입니다.', muscles: ['복횡근', '복직근', '골반저근'], holdTime: '각 5초 × 10회', steps: ['등을 대고 누워 팔을 천장을 향해 올리고 무릎을 90도로 들어 올립니다.', '허리가 바닥에 완전히 닿도록 합니다.', '오른팔과 왼다리를 동시에 천천히 뻗습니다.', '허리가 뜨지 않도록 유지하며 5초 후 돌아옵니다. 반대쪽도 반복합니다.'], icon: '🐛', difficulty: '보통' },
    { id: 'bird-dog-bp', name: '버드독 운동', description: '허리 안정화 근육을 강화하는 가장 효과적인 재활 운동 중 하나입니다.', muscles: ['다열근', '복횡근', '둔근'], holdTime: '각 10초 × 8회', steps: ['손과 무릎을 짚고 테이블 자세를 취합니다.', '허리가 중립(평평한) 자세를 유지합니다.', '오른팔과 왼다리를 동시에 천천히 들어 수평을 맞춥니다.', '10초 유지 후 내려놓고 반대쪽을 반복합니다.'], icon: '🦅', difficulty: '보통' },
    { id: 'glute-bridge-bp', name: '둔근 브릿지', description: '허리 근육 대신 둔근을 강화하여 허리 부담을 줄이는 핵심 운동입니다.', muscles: ['대둔근', '햄스트링', '다열근'], holdTime: '10초 × 10회', steps: ['등을 대고 누워 무릎을 90도로 세웁니다.', '발은 어깨너비로 벌리고 발바닥을 바닥에 붙입니다.', '둔근에 힘을 주며 엉덩이를 천천히 들어 올립니다.', '10초 유지 후 천천히 내립니다. 10회 반복합니다.'], icon: '⬆️', difficulty: '보통' },
    { id: 'plank-modified-bp', name: '무릎 대고 플랭크', description: '허리에 부담을 최소화하면서 코어 전체를 강화하는 변형 플랭크입니다.', muscles: ['복횡근', '복직근', '척추기립근'], holdTime: '20~30초 × 3세트', steps: ['무릎과 팔꿈치를 바닥에 대고 엎드립니다.', '팔꿈치는 어깨 아래에 위치시킵니다.', '허리가 아래로 처지거나 위로 솟지 않도록 합니다.', '20~30초 유지 후 쉽니다. 3세트 반복합니다.'], icon: '💪', difficulty: '보통' },
    { id: 'pelvic-floor-bp', name: '골반저근 운동', description: '허리 안정화의 기초인 골반저근과 심부 코어를 강화합니다.', muscles: ['골반저근', '복횡근', '다열근'], holdTime: '10초 × 10회', steps: ['편안하게 눕거나 앉습니다.', '소변을 참는 느낌으로 골반저근에 힘을 줍니다.', '동시에 배꼽을 척추 쪽으로 살짝 당깁니다.', '10초 유지 후 완전히 이완합니다. 10회 반복합니다.'], icon: '🔵', difficulty: '쉬움' },
  ],
};
