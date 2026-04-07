export type SectorId = 'rwa' | 'quantum' | 'space' | 'bci';

export interface Sector {
  id: SectorId;
  name: string;
  nameKo: string;
  tagline: string;
  description: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  marketSize: string;
  growthRate: string;
  cagr: string;
  timeHorizon: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  maturity: 'Early' | 'Growth' | 'Expanding' | 'Mature';
  keyPlayers: string[];
  catalysts: string[];
  risks: string[];
  icon: string;
}

export const sectors: Sector[] = [
  {
    id: 'rwa',
    name: 'Real World Assets',
    nameKo: '자산 토큰화 (RWA)',
    tagline: '실물 자산의 블록체인 혁명',
    description: '부동산, 채권, 원자재 등 전통 실물 자산을 블록체인 토큰으로 전환하는 혁신적 금융 패러다임. 글로벌 기관 투자자들의 DeFi 진입 관문.',
    color: '#3b82f6',
    bgGradient: 'from-blue-500/10 to-cyan-500/5',
    borderColor: 'border-blue-500/30',
    marketSize: '$8.4조',
    growthRate: '+127%',
    cagr: '42.3%',
    timeHorizon: '2024–2030',
    riskLevel: 'Medium',
    maturity: 'Growth',
    keyPlayers: ['BlackRock BUIDL', 'Ondo Finance', 'Centrifuge', 'Maple Finance', 'Goldfinch'],
    catalysts: ['SEC 규제 명확화', '기관 투자자 DeFi 진입', 'T+0 결제 혁신', 'CBDC 연계'],
    risks: ['규제 불확실성', '스마트 컨트랙트 취약성', '유동성 리스크'],
    icon: '🏦',
  },
  {
    id: 'quantum',
    name: 'Quantum Computing',
    nameKo: '양자 컴퓨팅',
    tagline: '연산의 패러다임 전환',
    description: '큐비트 기반 초고속 연산으로 금융 최적화, 신약 개발, 암호학을 재정의하는 차세대 기술. 양자 우위(Quantum Advantage) 실현 임박.',
    color: '#8b5cf6',
    bgGradient: 'from-purple-500/10 to-pink-500/5',
    borderColor: 'border-purple-500/30',
    marketSize: '$1.3조',
    growthRate: '+89%',
    cagr: '38.7%',
    timeHorizon: '2025–2035',
    riskLevel: 'High',
    maturity: 'Early',
    keyPlayers: ['IBM Quantum', 'Google Sycamore', 'IonQ', 'Rigetti', 'D-Wave'],
    catalysts: ['오류 수정 기술 발전', '정부 R&D 투자', '하이브리드 클래식-양자 시스템'],
    risks: ['기술 성숙도', '인재 부족', '장기 투자 지평선'],
    icon: '⚛️',
  },
  {
    id: 'space',
    name: 'Space Economy',
    nameKo: '우주 경제',
    tagline: '인류의 다음 성장 프론티어',
    description: '민간 주도의 우주 산업화로 위성 인터넷, 우주 제조, 달 경제, 화성 식민지화까지 확장되는 다조 달러 규모의 신흥 시장.',
    color: '#f59e0b',
    bgGradient: 'from-amber-500/10 to-orange-500/5',
    borderColor: 'border-amber-500/30',
    marketSize: '$1.8조',
    growthRate: '+64%',
    cagr: '9.8%',
    timeHorizon: '2024–2040',
    riskLevel: 'High',
    maturity: 'Expanding',
    keyPlayers: ['SpaceX', 'Blue Origin', 'Planet Labs', 'AST SpaceMobile', 'Rocket Lab'],
    catalysts: ['재사용 로켓 원가 절감', 'Starlink 수익화', '달 상업화 계약', 'GPS 3.0'],
    risks: ['발사 실패 위험', '정부 계약 의존성', '장기 회수 기간'],
    icon: '🚀',
  },
  {
    id: 'bci',
    name: 'Brain-Computer Interface',
    nameKo: '뇌-컴퓨터 인터페이스 (BCI)',
    tagline: '인간과 기계의 경계 소멸',
    description: '신경 신호를 디지털로 변환해 의료·교육·엔터테인먼트를 재정의. Neuralink 임상 성공 이후 본격화된 BCI의 상업화 시대.',
    color: '#10b981',
    bgGradient: 'from-emerald-500/10 to-teal-500/5',
    borderColor: 'border-emerald-500/30',
    marketSize: '$0.38조',
    growthRate: '+156%',
    cagr: '19.2%',
    timeHorizon: '2025–2032',
    riskLevel: 'Very High',
    maturity: 'Early',
    keyPlayers: ['Neuralink', 'Synchron', 'Precision Neuroscience', 'Blackrock Neurotech', 'BrainGate'],
    catalysts: ['FDA 인허가 확대', 'AI 신호 처리 발전', '비침습 기술 돌파'],
    risks: ['윤리·프라이버시', '임상 규제', '대중 수용성'],
    icon: '🧠',
  },
];

export const getSector = (id: SectorId) => sectors.find(s => s.id === id)!;
