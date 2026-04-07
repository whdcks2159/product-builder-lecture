import { SectorId } from './sectors';

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  sector: SectorId;
  author: string;
  authorTitle: string;
  date: string;
  readTime: string;
  tags: string[];
  summary: string;
  content: string;
  featured?: boolean;
}

export const articles: Article[] = [
  {
    slug: 'rwa-tokenization-16trillion-market-2030',
    title: '자산 토큰화(RWA) 시장의 폭발적 성장: 2030년까지 16조 달러 전망',
    subtitle: 'BlackRock, Fidelity 등 전통 금융 거인들이 왜 RWA에 베팅하는가',
    sector: 'rwa',
    author: '김재원',
    authorTitle: 'DeFi 리서치 애널리스트',
    date: '2026-04-05',
    readTime: '12분',
    tags: ['RWA', 'DeFi', '토큰화', '블록체인', '기관투자'],
    featured: true,
    summary: '실물 자산 토큰화(RWA)는 2024년 이후 급격히 성장하며 전통 금융과 DeFi의 가교 역할을 하고 있다. 본 분석에서는 RWA 시장의 구조, 핵심 플레이어, 그리고 투자자가 놓쳐서는 안 될 신호를 심층 분석한다.',
    content: `## RWA란 무엇인가: 금융의 제3 혁명

자산 토큰화(Real World Asset Tokenization)는 부동산, 국채, 회사채, 원자재, 미술품 등 전통적인 실물 자산을 블록체인 위의 디지털 토큰으로 변환하는 과정이다. 이는 단순한 기술적 실험을 넘어 글로벌 금융 시스템의 근본적 재편을 예고한다.

2024년 기준 온체인 RWA 총 가치(TVL)는 120억 달러를 돌파했으며, 2030년까지 16조 달러 규모로 성장할 것으로 Citigroup과 Standard Chartered는 전망한다. 이는 현재 전체 DeFi 시장의 10배가 넘는 수치다.

## BlackRock의 BUIDL: 기관 자금의 온체인 유입

2024년 3월 BlackRock이 출시한 USD Institutional Digital Liquidity Fund(BUIDL)는 RWA 시장의 변곡점이었다. 세계 최대 자산운용사의 온체인 진출은 기관 투자자들에게 강력한 신호를 보냈다.

**BUIDL의 핵심 구조:**
- Ethereum 기반 규제 준수 토큰
- 미국 단기 국채 및 현금성 자산 보유
- T+0 즉시 결제 (기존 T+2 대비 혁신)
- 최소 투자금 500만 달러

출시 6개월 만에 4억 6천만 달러를 돌파한 BUIDL은 Franklin Templeton, WisdomTree 등 경쟁사들의 유사 상품 출시를 촉발시켰다.

## 토큰화 자산의 4대 카테고리

### 1. 토큰화 국채 (Tokenized Treasuries)
현재 가장 빠르게 성장하는 카테고리다. Ondo Finance의 OUSG(BlackRock 단기채 기반)와 Maple Finance의 상품들이 대표적이다. 미국 금리 상승기에 스테이블코인 수익률(~5%)을 무위험 채권으로 대체하려는 DeFi 참여자들의 수요가 폭발적으로 증가했다.

### 2. 부동산 토큰화 (Real Estate Tokenization)
Lofty, RealT 등 플랫폼을 통해 분산 소유가 가능해졌다. 10달러 미만 단위 투자가 가능한 부동산 소액 투자는 신흥국 투자자들에게 특히 혁신적이다. 2025년 싱가포르 MAS는 부동산 토큰화 파일럿을 공식 승인했다.

### 3. 사모 신용 (Private Credit)
Goldfinch, Centrifuge가 선도하는 사모 신용 토큰화는 신흥국 중소기업에 DeFi 자본을 연결한다. 수익률은 연 8~15%로 전통 채권 대비 높지만 유동성 리스크가 존재한다.

### 4. 원자재 및 대체 자산
금, 은 토큰(Paxos Gold, Tether Gold)은 이미 시장에 안착했다. 탄소 크레딧, 예술품, 와인 등의 토큰화도 실험 단계에서 상업화 단계로 진입하고 있다.

## 규제 환경: 게임의 규칙이 바뀐다

RWA 성장의 최대 촉매제는 규제 명확화다.

**미국:** SEC의 "Crypto Task Force" 구성 이후 증권형 토큰에 대한 가이드라인 마련이 가속화되고 있다. ERC-3643(T-REX) 표준이 규제 준수 토큰의 사실상 표준으로 부상 중이다.

**유럽:** MiCA(Markets in Crypto-Assets) 규제 시행으로 EU 내 RWA 플랫폼의 법적 지위가 명확해졌다. 룩셈부르크, 리히텐슈타인 등은 토큰화 친화적 법률을 선제적으로 정비했다.

**아시아:** 싱가포르 MAS의 Project Guardian, 홍콩 SFC의 토큰화 프레임워크는 아시아 RWA 허브 경쟁을 촉발했다.

## 투자자 관점: 핵심 지표와 리스크

**모니터링해야 할 지표:**
1. 온체인 RWA TVL 추이 (RWA.xyz, DeFi Llama 추적)
2. Ondo Finance OUSG 잔액 (기관 수요 바로미터)
3. BUIDL 펀드 규모
4. 토큰화 국채 총 발행액

**핵심 리스크:**
- **오라클 리스크:** 실물 자산 가격을 온체인으로 가져오는 과정의 조작 가능성
- **법적 강제력:** 토큰화 자산의 실물 자산에 대한 법적 청구권 불확실성
- **커스터디 리스크:** 실물 자산 보관 기관의 부도 시 토큰 홀더 보호 문제
- **유동성 단절:** 1차 시장(발행)과 2차 시장(거래) 간 유동성 불일치

## 결론: 2026년의 RWA 투자 전략

RWA는 "DeFi의 제도화"와 "TradFi의 온체인 이동"이라는 두 거대한 흐름이 만나는 교차점에 있다. 단기적으로는 토큰화 국채와 머니마켓 펀드가 가장 안정적인 진입점이며, 중장기적으로는 사모 신용과 부동산 토큰화가 알파 창출 기회를 제공할 것이다.

규제 명확화, 기관 채택, 인프라 성숙이 동시에 진행되는 2024~2026년은 RWA 시장의 골든 타임이다. 이 기회의 창을 놓치지 않으려면 생태계 전반에 대한 깊은 이해가 선행되어야 한다.`,
  },
  {
    slug: 'quantum-computing-finance-revolution',
    title: '양자 컴퓨팅이 금융을 재정의한다: 포트폴리오 최적화의 혁명',
    subtitle: 'IBM 1,121 큐비트 시대, 월스트리트가 양자 기술에 수억 달러를 투자하는 이유',
    sector: 'quantum',
    author: '이수현',
    authorTitle: '퀀트 전략 리서처',
    date: '2026-04-03',
    readTime: '10분',
    tags: ['양자컴퓨팅', '퀀트', '포트폴리오최적화', '금융기술', 'IBM'],
    featured: true,
    summary: '양자 컴퓨팅이 금융 산업에 미치는 영향을 심층 분석한다. 포트폴리오 최적화, 리스크 관리, 파생상품 가격결정에서의 양자 우위와 현재 한계를 함께 살펴본다.',
    content: `## 양자 우위(Quantum Advantage): 금융의 게임 체인저

2023년 IBM이 1,121 큐비트의 'Condor' 프로세서를 공개했을 때, 월스트리트는 그 의미를 즉각 파악했다. 수조 달러 규모의 포트폴리오 최적화 문제가 양자 컴퓨터로 풀릴 날이 멀지 않았다는 신호였다.

전통적인 컴퓨터가 1,024개의 자산으로 구성된 포트폴리오 최적화를 계산하는 데 수백 년이 걸린다면, 양자 컴퓨터는 이를 수 시간으로 단축할 수 있다. 이것이 바로 JPMorgan Chase, Goldman Sachs, HSBC가 양자 컴퓨팅 R&D에 수억 달러를 쏟아붓는 이유다.

## 양자 컴퓨팅의 금융 응용 4대 분야

### 1. 몬테카를로 시뮬레이션 가속화
옵션 가격결정과 리스크 VaR(Value at Risk) 계산에 필수적인 몬테카를로 시뮬레이션은 현재 수백만 번의 반복 계산이 필요하다. 양자 알고리즘은 이를 제곱근 배속으로 가속화할 수 있다.

JPMorgan의 연구팀은 2022년 양자 진폭 추정(Quantum Amplitude Estimation) 알고리즘을 통해 몬테카를로 계산 속도를 최대 1,000배 향상시킬 수 있음을 이론적으로 증명했다.

### 2. 포트폴리오 최적화
마코위츠 효율적 프론티어 계산은 자산 수가 늘어날수록 지수적으로 복잡해지는 NP-hard 문제다. QAOA(Quantum Approximate Optimization Algorithm)는 현실적인 시간 내에 글로벌 최적해에 근접한 솔루션을 제공한다.

**실제 사례:** D-Wave의 양자 어닐러를 활용한 Volkswagen의 교통 흐름 최적화는 포트폴리오 리밸런싱의 실제 적용 사례로 자주 언급된다.

### 3. 사기 탐지 및 이상 거래 감지
양자 머신러닝(QML)은 전통적 ML 모델이 놓치는 복잡한 패턴을 고차원 힐버트 공간에서 탐지할 수 있다. 금융 사기는 연간 40억 달러 이상의 피해를 유발하며, 양자 기반 이상 탐지는 이를 획기적으로 줄일 잠재력이 있다.

### 4. 신용 리스크 모델링
대출 포트폴리오의 상관관계 분석과 부도율 예측에서 양자 알고리즘은 더 정교한 의존 구조를 모델링할 수 있다. ING, Barclays 등은 이미 파일럿 프로젝트를 진행 중이다.

## 현실: 노이즈와 오류 수정 문제

양자 컴퓨팅의 상업적 금융 응용은 아직 수년의 시간이 필요하다. 현재 최대 장벽은 **디코히어런스(Decoherence)**와 **양자 오류율**이다.

현재 양자 게이트의 오류율은 0.1~1%로, 금융 계산에 필요한 정밀도를 달성하려면 오류 수정 큐비트(Error Correction Qubits)가 필요하다. 논리적 큐비트 1개를 구현하는 데 1,000개의 물리적 큐비트가 필요하다는 것이 현재의 한계다.

Google의 Willow 칩은 2024년 오류 수정 확장성을 입증하며 이 문제 해결에 중요한 이정표를 세웠다.

## 투자 기회: 어디에 베팅할 것인가

**순수 양자 기업:** IonQ(IONQ), Rigetti Computing(RGTI), D-Wave(QBTS) — 높은 변동성, 장기 관점 필수
**빅테크 양자 부문:** IBM, Google, Microsoft, Amazon — 양자를 클라우드 서비스로 제공
**양자 인에이블러:** 극저온 냉각 장비(Edwards Vacuum, Linde), 광자 소자(Coherent Corp)
**양자 소프트웨어:** Zapata Computing, QC Ware — 알고리즘 레이어

## 결론: 지금은 포지셔닝의 시간

양자 컴퓨팅은 5~10년 내 금융 산업의 경쟁 구도를 근본적으로 바꿀 것이다. 지금 당장 수익을 기대하기보다는, 생태계를 이해하고 선도 기업들의 기술 진보를 추적하면서 전략적 포지션을 구축하는 것이 현명한 투자자의 자세다.`,
  },
  {
    slug: 'space-economy-investment-guide-2026',
    title: '우주 경제 투자 가이드: SpaceX 이후 시대의 기회와 리스크',
    subtitle: '1.8조 달러 우주 경제의 진짜 수익 모델과 민간 투자자의 진입 전략',
    sector: 'space',
    author: '박민준',
    authorTitle: '미래산업 투자 애널리스트',
    date: '2026-04-01',
    readTime: '11분',
    tags: ['우주경제', 'SpaceX', 'Starlink', '위성', '민간우주'],
    featured: false,
    summary: '민간 우주 산업의 급성장과 함께 개인 투자자들이 접근할 수 있는 우주 경제의 진짜 수익 모델을 분석한다. Starlink 수익화, 우주 제조, 달 경제의 투자 기회를 심층 탐구한다.',
    content: `## 우주 경제의 새벽: SpaceX가 바꾼 패러다임

2015년 SpaceX의 Falcon 9 재사용 착륙이 성공하는 순간, 우주 산업의 경제학이 근본적으로 바뀌었다. 1kg을 지구 저궤도(LEO)에 올리는 비용이 2000년 5만 달러에서 2024년 1,500달러로 97% 하락했다. 이는 우주 산업의 "무어의 법칙"이라 할 수 있다.

Morgan Stanley는 현재 6,300억 달러인 우주 경제가 2040년까지 1조 달러를 돌파할 것으로 전망한다. 일부 낙관적 예측은 2050년 10조 달러까지 바라본다.

## 우주 경제의 6대 수익 레이어

### 레이어 1: 위성 인터넷 (가장 근접한 수익)
Starlink는 2024년 기준 전 세계 600만 이상의 유료 구독자를 확보했다. 연간 매출 60억 달러를 돌파한 Starlink는 SpaceX IPO 시 가장 큰 가치 창출 요소가 될 것이다.

경쟁 구도: Amazon Kuiper(2024년 시험 발사 완료), OneWeb, AST SpaceMobile(직접 스마트폰 연결, 4G 없는 지역 공략)

### 레이어 2: 지구 관측 및 데이터 판매
Planet Labs는 180개 이상의 위성으로 매일 지구 전체를 촬영한다. 이 데이터는 농업(수확량 예측), 금융(원자재 재고 추적), 국방, 보험 산업에 판매된다. 연간 2억 달러의 매출을 기록 중이다.

### 레이어 3: 우주 발사 서비스
SpaceX, Rocket Lab, United Launch Alliance의 경쟁이 치열하다. Rocket Lab의 Neutron 로켓은 중형 탑재체 시장을 노리며 2025년 첫 발사를 준비 중이다.

### 레이어 4: 우주 제조 (Manufacturing in Space)
미세중력 환경은 지구에서 불가능한 완벽한 구형 광섬유, 의약품 결정, 반도체 웨이퍼를 만들 수 있다. Varda Space Industries는 이미 ISS를 활용한 우주 제조 실험에 성공했다.

### 레이어 5: 달 경제 (2025년 이후 본격화)
NASA의 아르테미스 프로그램과 민간 달 착륙선 프로그램(CLPS)은 달 경제의 서막이다. 달 남극의 물 얼음은 수소 연료와 음료수로 활용 가능하며, 이는 심우주 탐사의 주유소 역할을 할 수 있다.

Intuitive Machines, Astrobotic Technology가 이 시장의 선도 기업이다.

### 레이어 6: 우주 관광 (프리미엄 니치)
Blue Origin의 New Shepard, Virgin Galactic은 연간 수십 명에게 우주 경험을 제공한다. 가격은 25만~45만 달러. SpaceX의 Dragon을 통한 민간 ISS 방문도 늘어나고 있다.

## 상장 기업 투자 가이드

**직접 투자 가능:**
- **Rocket Lab (RKLB):** 소형 위성 발사 + 우주 시스템, 수직 통합 전략
- **Planet Labs (PL):** 지구 관측 데이터 SaaS, 지속적 매출 모델
- **AST SpaceMobile (ASTS):** 직접 모바일 연결, 하이리스크-하이리턴
- **Intuitive Machines (LUNR):** 달 착륙선, NASA 계약 기반

**간접 노출:**
- **Northrop Grumman, L3Harris:** 국방 + 우주 시스템의 안정적 조합
- **우주 ETF:** UFO(Procure Space ETF), ROKT(SPDR S&P Kensho Final Frontiers)

## 핵심 리스크 분석

1. **발사 실패:** 단일 실패로 수억 달러 자산 소멸 (보험료 비용 증가)
2. **케슬러 증후군:** 저궤도 위성 증가로 인한 충돌 위험과 규제 압력
3. **정부 계약 집중도:** 매출의 상당 부분이 NASA, DoD에 의존
4. **기술 지연:** 발사 스케줄 지연이 재무 모델을 뒤흔드는 경우 다수

## 전략적 시사점

우주 경제는 기다리는 자의 시장이다. 인프라 레이어(발사, 위성)는 이미 수익화 단계에 진입했으나, 진짜 폭발적 성장은 우주 제조와 달 자원 경제가 현실화되는 2030년대에 올 것이다. 지금은 씨앗을 뿌리는 시기다.`,
  },
  {
    slug: 'bci-neuralink-commercial-era',
    title: 'BCI 상업화 시대의 개막: Neuralink 임상 성공이 열어준 투자 기회',
    subtitle: '뇌-컴퓨터 인터페이스가 의료·교육·엔터테인먼트를 어떻게 재정의하는가',
    sector: 'bci',
    author: '최유진',
    authorTitle: '바이오테크 리서치 전문가',
    date: '2026-03-28',
    readTime: '13분',
    tags: ['BCI', 'Neuralink', '뇌과학', '신경기술', '의료기기'],
    featured: false,
    summary: 'Neuralink의 첫 번째 인간 임상 성공 이후 BCI 산업의 상업화 로드맵과 투자 기회를 분석한다. 의료용 BCI에서 소비자용 BCI로의 진화 과정을 살펴본다.',
    content: `## BCI의 역사적 전환점: Noland Arbaugh의 첫 번째 생각-클릭

2024년 1월 29일, Neuralink는 척수 손상으로 전신 마비 상태인 Noland Arbaugh가 생각만으로 체스를 두고 마리오 카트를 플레이하는 영상을 공개했다. 이는 뇌-컴퓨터 인터페이스(BCI)의 역사에서 인터넷 발명만큼 중요한 순간이었다.

BCI는 뇌의 전기 신호를 읽고 디지털 명령으로 변환하는 기술이다. 수십 년간 학술 연구에 머물렀던 이 기술이 이제 상업화의 출발점에 섰다.

## BCI의 기술 스펙트럼

### 비침습형 (Non-invasive) — 현재 시장 주도
- **EEG 헤드셋:** Emotiv, OpenBCI 등이 제공하는 두피 위 전극
- **fNIRS 기반:** 근적외선 분광으로 혈류 변화 감지
- **정밀도 한계:** 두개골로 인한 신호 감쇠로 정밀 명령 전달 제한

### 반침습형 (Semi-invasive) — 성장 영역
- **ECoG(전기피질도):** 두개골 내부, 뇌 표면 전극 배치
- Synchron의 Stentrode: 혈관을 통해 운동 피질에 스텐트형 전극 삽입 (두개골 절개 불필요)

### 침습형 (Invasive) — 최고 정밀도
- Neuralink의 N1 칩: 1,024개 전극, 로봇 수술로 뇌에 직접 삽입
- Precision Neuroscience: 초박형 전극 배열

## 의료 응용: 가장 빠른 상업화 경로

**운동 신경 마비 치료**
척수 손상, ALS, 뇌졸중 후유증 환자에게 BCI는 문자 그대로 삶을 돌려준다. Neuralink의 PRIME 연구는 FDA의 혁신 의료기기 지정을 받았다.

**치료 저항성 우울증**
DBS(Deep Brain Stimulation)의 발전형으로, 감정 조절 회로를 실시간으로 모니터링하고 자극하는 "닫힌 루프(Closed-Loop)" BCI가 임상 중이다. Abbott의 NeuroSphere는 이미 FDA 승인을 받았다.

**시각 복원 (Cortical Visual Prosthetics)**
Second Sight의 Orion 임상과 Gennaris(Monash University)가 시각 피질에 직접 이미지를 전달하는 연구를 진행 중이다.

**뇌전증 예측 및 제어**
발작 예측 알고리즘과 실시간 DBS를 결합한 반응형 신경 자극(RNS) 시스템은 이미 수천 명의 환자에게 이식되어 있다.

## 소비자 BCI: 다음 10년의 시장

의료용 BCI가 성숙하면, 그 다음 단계는 소비자 시장이다.

**집중력 및 인지 향상**
Muse(InteraXon)의 명상 헤드밴드는 이미 상업적으로 판매 중이다. 향후 더 정밀한 신호를 통해 학습 속도 향상, ADHD 치료 등으로 확장될 것이다.

**몰입형 XR 인터페이스**
Meta, Apple이 BCI를 XR 헤드셋의 차세대 입력 방식으로 연구 중이다. 생각으로 가상 현실을 조작하는 것이 5~10년 내 현실화될 수 있다.

**정서 감지 및 광고**
윤리적 논쟁이 있지만, 감정 상태 데이터는 개인화 광고와 마케팅의 혁명을 예고한다.

## 투자 분석: 어디서 베팅할 것인가

**직접 투자 (주로 비상장):**
- Neuralink: IPO 전 단계, 최근 밸류에이션 85억 달러
- Synchron: Jeff Bezos, Bill Gates 투자 참여
- Precision Neuroscience: 2024년 5,300만 달러 시리즈 B 완료

**상장 기업 (의료기기 BCI):**
- **Medtronic (MDT):** DBS 시장 리더, Percept PC 신경 자극기
- **Abbott (ABT):** NeuroSphere RNS 시스템
- **Neuropace (NPCE):** 뇌전증 전용 RNS 퓨어플레이

**인에이블러 기업:**
- **Blackrock Microsystems (비상장):** 신경 기록 장비 제조
- **Axon (비상장):** 신경 신호 처리 칩
- **Texas Instruments, Analog Devices:** 저전력 신경 신호 처리 칩

## 윤리와 규제: BCI의 판도라 상자

BCI의 가장 큰 비기술적 도전은 윤리다.

**신경 프라이버시(Neurorights):** 뇌 데이터는 생체 데이터 중 가장 민감하다. 칠레는 세계 최초로 헌법에 신경 권리를 명시했다. 미국, EU도 신경 프라이버시 법률을 검토 중이다.

**인지 불평등:** BCI를 통한 인지 향상이 상용화될 때, 구매력이 있는 계층과 없는 계층 간의 "지적 격차"가 벌어질 수 있다.

## 결론: 초기 진입자의 기회

BCI는 모든 기술 중 가장 변혁적이면서 동시에 가장 높은 불확실성을 가진다. 의료용 BCI는 향후 5년 내 수십억 달러 시장으로 자리 잡을 것이며, 소비자용 BCI는 그 후 10~15년의 장기 지평선을 가진다. 지금은 생태계를 이해하고 의료 기기 인에이블러에 선별적으로 노출하면서, 소비자 BCI 시대의 승자를 찾아나가는 시기다.`,
  },
  {
    slug: 'rwa-platform-comparison-2026',
    title: 'RWA 플랫폼 완전 비교: Ondo vs. Centrifuge vs. Maple Finance',
    subtitle: '각 플랫폼의 수익 구조, 리스크 프로파일, 적합한 투자자 유형 분석',
    sector: 'rwa',
    author: '김재원',
    authorTitle: 'DeFi 리서치 애널리스트',
    date: '2026-03-25',
    readTime: '9분',
    tags: ['RWA', 'Ondo', 'Centrifuge', 'Maple', 'DeFi프로토콜'],
    featured: false,
    summary: '주요 RWA 프로토콜들의 상세 비교 분석. 각 플랫폼의 차별화 전략, 리스크, 수익률을 데이터 기반으로 비교하여 투자자 맞춤 선택 가이드를 제공한다.',
    content: `## RWA 플랫폼 선택의 기준

모든 RWA 플랫폼이 같지는 않다. 토큰화하는 자산 유형, 규제 접근 방식, 수익률 구조가 플랫폼마다 크게 다르다. 투자자는 자신의 리스크 성향과 투자 목적에 맞는 플랫폼을 선택해야 한다.

## Ondo Finance: 기관급 미국 채권 토큰화

**핵심 상품:** OUSG(BlackRock 단기채 ETF 기반), USDY(수익 지급 달러 토큰)
**수익률:** 연 4.7~5.1% (미국 단기채 수익률 연동)
**최소 투자:** OUSG $100,000(미국 기관), USDY 제한 없음
**TVL:** 약 8억 달러 (2024년 4분기 기준)

**장점:**
- BlackRock ETF 직접 연동으로 신뢰도 최고
- Flux Finance 통해 DeFi 담보로 활용 가능
- 24/7 온체인 유동성

**단점:**
- 미국 비거주자 접근 제한(OUSG)
- 상대적으로 낮은 수익률 (리스크프리에 근접)
- 높은 최소 투자 금액

**적합 대상:** 스테이블코인 수익률 업그레이드를 원하는 기관/고액 투자자

## Centrifuge: 실물 사업 신용 토큰화

**핵심 모델:** 중소기업 대출, 무역 금융, 부동산 브리지론을 NFT로 토큰화
**수익률:** 연 7~12% (자산 풀에 따라 다양)
**구조:** 시니어/주니어 트랜치로 리스크 분산
**파트너:** MakerDAO, Aave, Morpho와 통합

**장점:**
- 전통 금융 수익률 대비 높은 알파
- Tinlake 프로토콜의 성숙한 기술 스택
- 광범위한 DeFi 생태계 연동

**단점:**
- 부도 위험 존재 (실제 2023년 2건의 풀 부도)
- 자산 실사(due diligence) 투자자 역량 필요
- 유동성 제한 (만기 고정)

**적합 대상:** 고수익 추구, 실물 경제 임팩트 원하는 DeFi 고급 사용자

## Maple Finance: 기관 무담보 신용

**핵심 모델:** Web3 기관(거래소, 마켓메이커)에 무담보 대출 제공
**수익률:** 연 6~10%
**차별점:** 신용 심사 위임(Pool Delegate) 모델
**TVL:** 약 5억 달러 (2024년 기준)

**역사적 오점:** 2022년 FTX 붕괴 후 3,600만 달러 부도 처리
**회복:** 2023년 이후 리스크 관리 강화, Cash Management 상품 추가

**장점:**
- 무담보 대출로 높은 자본 효율성
- 경험 많은 신용 운용팀
- 규제 준수 강화

**단점:**
- 무담보 특성상 최고 수준 거래 상대방 리스크
- 2022년 부도 이력
- 포트폴리오 집중도 리스크

**적합 대상:** 고수익 + 기관 신용 리스크 감내 가능한 투자자

## 종합 비교표

| 기준 | Ondo | Centrifuge | Maple |
|------|------|-----------|-------|
| 기반 자산 | 미국 국채 | 실물 신용 | 무담보 기관 대출 |
| 예상 수익률 | 4.7~5.1% | 7~12% | 6~10% |
| 리스크 레벨 | 낮음 | 중간~높음 | 높음 |
| 최소 투자 | $100K+ | 제한 없음 | 제한 없음 |
| 규제 준수 | 최고 | 중간 | 중간 |
| 유동성 | 높음 | 낮음 | 낮음 |
| DeFi 통합 | 우수 | 우수 | 양호 |

## 선택 가이드

**안정성 최우선:** Ondo Finance USDY → 규제 최적화, 낮은 리스크
**수익률 최우선:** Centrifuge 시니어 트랜치 → 담보 보호 + 고수익
**DeFi 알파 추구:** Maple Finance → 높은 리스크 감내 시 고수익 가능
**분산 투자:** 세 플랫폼 30/40/30 비율 배분

RWA 투자는 단순한 수익률 비교가 아니라 기반 자산의 법적 구조, 오라클 신뢰성, 부도 시 회수 메커니즘까지 이해한 후 접근해야 한다.`,
  },
];

export const getArticle = (slug: string) => articles.find(a => a.slug === slug);
export const getArticlesBySector = (sector: SectorId) => articles.filter(a => a.sector === sector);
export const getFeaturedArticles = () => articles.filter(a => a.featured);
