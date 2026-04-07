import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import CalculatorClient from '@/components/calculator/CalculatorClient';
import SubHeader from '@/components/layout/SubHeader';

export const metadata: Metadata = genMeta({
  title: '투자 계산기 — 섹터 수익률 시뮬레이터',
  description: 'RWA, 양자 컴퓨팅, 우주 경제, BCI 섹터별 투자 수익률을 시뮬레이션하고 비교하는 도구',
  path: '/calculator',
});

export default function CalculatorPage() {
  return (
    <>
      <SubHeader />
      <div className="max-w-lg mx-auto px-4 py-5">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>투자 계산기</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>섹터별 기대 수익률 시뮬레이션 (참고용)</p>
        </div>
        <CalculatorClient />
      </div>
    </>
  );
}
