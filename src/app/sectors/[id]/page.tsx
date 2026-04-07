import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateMetadata as genMeta } from '@/lib/seo';
import { getSector, SectorId, sectors } from '@/data/sectors';
import { getArticlesBySector } from '@/data/articles';
import ArticleCard from '@/components/articles/ArticleCard';
import SectorDetailChart from '@/components/dashboard/SectorDetailChart';
import { Shield, TrendingUp, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return sectors.map(s => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sector = getSector(params.id as SectorId);
  if (!sector) return {};
  return genMeta({
    title: `${sector.nameKo} 섹터 분석`,
    description: sector.description,
    path: `/sectors/${sector.id}`,
  });
}

const riskColors: Record<string, string> = {
  'Low': '#10b981',
  'Medium': '#f59e0b',
  'High': '#ef4444',
  'Very High': '#dc2626',
};

export default function SectorDetailPage({ params }: Props) {
  const sector = getSector(params.id as SectorId);
  if (!sector) notFound();

  const articles = getArticlesBySector(sector.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 space-y-6">
      {/* Header */}
      <div className="rounded-xl p-5" style={{ background: `linear-gradient(135deg, ${sector.color}12, transparent)`, border: `1px solid ${sector.color}25` }}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
            style={{ background: `${sector.color}15`, border: `1px solid ${sector.color}30` }}>
            {sector.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{sector.nameKo}</h1>
            <p className="text-sm mb-2" style={{ color: sector.color }}>{sector.tagline}</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sector.description}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: '시장 규모', value: sector.marketSize },
            { label: '성장률', value: sector.growthRate, colored: true },
            { label: 'CAGR', value: sector.cagr },
            { label: '기간', value: sector.timeHorizon.split('–')[0] + '~' + sector.timeHorizon.split('–')[1] },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-sm font-bold" style={{ color: stat.colored ? sector.color : 'var(--text-primary)' }}>{stat.value}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <SectorDetailChart sectorId={sector.id} color={sector.color} />

      {/* Risk & Maturity */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
            <Shield size={12} /> 리스크 프로파일
          </div>
          <div className="text-base font-bold mb-1" style={{ color: riskColors[sector.riskLevel] }}>{sector.riskLevel}</div>
          <div className="space-y-1.5 mt-3">
            {sector.risks.map(risk => (
              <div key={risk} className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <AlertTriangle size={10} className="mt-0.5 flex-shrink-0" style={{ color: riskColors[sector.riskLevel] }} />
                {risk}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
            <Zap size={12} /> 성장 촉매
          </div>
          <div className="text-base font-bold mb-1" style={{ color: sector.color }}>{sector.maturity} Stage</div>
          <div className="space-y-1.5 mt-3">
            {sector.catalysts.map(cat => (
              <div key={cat} className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <CheckCircle size={10} className="mt-0.5 flex-shrink-0" style={{ color: sector.color }} />
                {cat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Players */}
      <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>주요 플레이어</div>
        <div className="flex flex-wrap gap-2">
          {sector.keyPlayers.map(player => (
            <span key={player} className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ background: `${sector.color}10`, color: sector.color, border: `1px solid ${sector.color}25` }}>
              {player}
            </span>
          ))}
        </div>
      </div>

      {/* Articles */}
      {articles.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
            {sector.nameKo} 인사이트
          </h2>
          <div className="space-y-0">
            {articles.map(article => (
              <ArticleCard key={article.slug} article={article} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
