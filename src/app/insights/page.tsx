import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import { articles } from '@/data/articles';
import { sectors } from '@/data/sectors';
import ArticleCard from '@/components/articles/ArticleCard';
import SubHeader from '@/components/layout/SubHeader';

export const metadata: Metadata = genMeta({
  title: '인사이트 — 전문가 분석 아티클',
  description: 'RWA, 양자 컴퓨팅, 우주 경제, BCI 분야 전문가들의 심층 분석 아티클 모음',
  path: '/insights',
});

export default function InsightsPage() {
  return (
    <>
    <SubHeader />
    <div className="max-w-lg mx-auto px-4 py-5">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>인사이트</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>전문 애널리스트의 심층 분석 아티클</p>
      </div>

      {/* Sector Filter Tags */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        <span className="text-xs px-3 py-1.5 rounded-full flex-shrink-0 font-medium"
          style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }}>
          전체
        </span>
        {sectors.map(sector => (
          <span key={sector.id} className="text-xs px-3 py-1.5 rounded-full flex-shrink-0"
            style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            {sector.icon} {sector.name}
          </span>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map(article => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {/* AdSense Placeholder */}
      <div className="mt-8 rounded-xl flex items-center justify-center text-xs"
        style={{ height: 90, background: 'var(--bg-card)', border: '1px dashed var(--border)', color: 'var(--text-secondary)' }}>
        Advertisement
      </div>

      {/* E-E-A-T Section */}
      <section className="mt-8 rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>편집 기준</h2>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          NexusInsight의 모든 아티클은 해당 분야 전문가가 직접 집필하며, 복수의 리뷰어 검토를 거칩니다.
          데이터 출처는 Bloomberg, Messari, RWA.xyz, CoinGecko 등 신뢰할 수 있는 기관에서 수집합니다.
          본 콘텐츠는 정보 제공 목적이며 투자 조언이 아닙니다. 투자 결정 전 전문가와 상담하시기 바랍니다.
        </p>
      </section>
    </div>
    </>
  );
}
