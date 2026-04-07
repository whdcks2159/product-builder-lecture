import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = genMeta({
  title: '홈 — 미래 성장 섹터 인사이트 대시보드',
  description: 'RWA 자산 토큰화, 양자 컴퓨팅, 우주 경제, BCI 시장 데이터와 전문가 분석을 실시간으로 제공하는 투자 인사이트 플랫폼',
});

export default function HomePage() {
  return <HomeClient />;
}
