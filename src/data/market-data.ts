export interface MarketDataPoint {
  year: string;
  rwa: number;
  quantum: number;
  space: number;
  bci: number;
}

export const marketGrowthData: MarketDataPoint[] = [
  { year: '2022', rwa: 0.8, quantum: 0.49, space: 0.46, bci: 0.13 },
  { year: '2023', rwa: 1.4, quantum: 0.67, space: 0.54, bci: 0.16 },
  { year: '2024', rwa: 3.1, quantum: 0.89, space: 0.63, bci: 0.22 },
  { year: '2025', rwa: 5.8, quantum: 1.24, space: 0.75, bci: 0.29 },
  { year: '2026', rwa: 8.4, quantum: 1.70, space: 0.91, bci: 0.38 },
  { year: '2027', rwa: 11.2, quantum: 2.35, space: 1.08, bci: 0.52 },
  { year: '2028', rwa: 13.8, quantum: 3.24, space: 1.31, bci: 0.71 },
  { year: '2030', rwa: 16.0, quantum: 5.30, space: 1.80, bci: 1.20 },
];

export interface SectorAllocation {
  name: string;
  value: number;
  color: string;
}

export const sectorAllocation: SectorAllocation[] = [
  { name: 'RWA', value: 45, color: '#3b82f6' },
  { name: '양자 컴퓨팅', value: 25, color: '#8b5cf6' },
  { name: '우주 경제', value: 20, color: '#f59e0b' },
  { name: 'BCI', value: 10, color: '#10b981' },
];

export interface MetricCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  sector: string;
  color: string;
}

export const keyMetrics: MetricCard[] = [
  {
    label: 'RWA 온체인 TVL',
    value: '$12.4B',
    change: '+23.4%',
    positive: true,
    sector: 'RWA',
    color: '#3b82f6',
  },
  {
    label: '양자 큐비트 수 (IBM)',
    value: '1,121',
    change: '+340 QBs',
    positive: true,
    sector: 'Quantum',
    color: '#8b5cf6',
  },
  {
    label: '민간 우주 발사 횟수',
    value: '248회',
    change: '+31% YoY',
    positive: true,
    sector: 'Space',
    color: '#f59e0b',
  },
  {
    label: 'BCI 임상 참여자',
    value: '1,847명',
    change: '+156%',
    positive: true,
    sector: 'BCI',
    color: '#10b981',
  },
];

export interface RwaChainData {
  name: string;
  tvl: number;
  color: string;
}

export const rwaByChain: RwaChainData[] = [
  { name: 'Ethereum', tvl: 7.2, color: '#627EEA' },
  { name: 'Stellar', tvl: 2.1, color: '#08B5E5' },
  { name: 'Polygon', tvl: 1.3, color: '#8247E5' },
  { name: 'Solana', tvl: 0.9, color: '#9945FF' },
  { name: 'Base', tvl: 0.6, color: '#0052FF' },
  { name: 'Others', tvl: 0.3, color: '#64748b' },
];
