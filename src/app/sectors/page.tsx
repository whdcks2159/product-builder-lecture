import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import { sectors } from '@/data/sectors';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import SubHeader from '@/components/layout/SubHeader';

export const metadata: Metadata = genMeta({
  title: '섹터 분석',
  description: 'RWA 자산 토큰화, 양자 컴퓨팅, 우주 경제, BCI 4대 미래 성장 섹터의 심층 분석',
  path: '/sectors',
});

const riskColors: Record<string, string> = {
  'Low': '#10b981',
  'Medium': '#f59e0b',
  'High': '#ef4444',
  'Very High': '#dc2626',
};

const maturityColors: Record<string, string> = {
  'Early': '#8b5cf6',
  'Growth': '#3b82f6',
  'Expanding': '#f59e0b',
  'Mature': '#10b981',
};

export default function SectorsPage() {
  return (
    <>
    <SubHeader />
    <div className="max-w-lg mx-auto px-4 py-5">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>섹터 분석</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>4대 미래 성장 섹터의 시장 구조와 투자 기회</p>
      </div>

      <div className="space-y-4">
        {sectors.map((sector) => (
          <Link key={sector.id} href={`/sectors/${sector.id}`}>
            <div className="rounded-xl p-5 card-hover mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${sector.color}15`, border: `1px solid ${sector.color}30` }}>
                  {sector.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{sector.nameKo}</h2>
                    <span className="text-lg font-bold" style={{ color: sector.color }}>{sector.growthRate}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sector.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{sector.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: '시장 규모', value: sector.marketSize },
                  { label: 'CAGR', value: sector.cagr },
                  { label: '기간', value: sector.timeHorizon },
                ].map(stat => (
                  <div key={stat.label} className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-xs font-bold" style={{ color: sector.color }}>{stat.value}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Risk & Maturity */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${riskColors[sector.riskLevel]}15`, color: riskColors[sector.riskLevel] }}>
                  <Shield size={8} className="inline mr-1" />
                  리스크: {sector.riskLevel}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${maturityColors[sector.maturity]}15`, color: maturityColors[sector.maturity] }}>
                  <Zap size={8} className="inline mr-1" />
                  {sector.maturity} Stage
                </span>
              </div>

              {/* Key Players */}
              <div className="mb-3">
                <p className="text-[10px] mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>주요 플레이어</p>
                <div className="flex flex-wrap gap-1.5">
                  {sector.keyPlayers.slice(0, 4).map(player => (
                    <span key={player} className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                      {player}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs" style={{ color: sector.color }}>
                상세 분석 보기 <ArrowRight size={12} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}
