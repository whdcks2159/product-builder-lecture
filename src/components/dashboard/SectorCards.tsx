import Link from 'next/link';
import { sectors } from '@/data/sectors';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function SectorCards() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>섹터 현황</h2>
        <Link href="/sectors" className="text-xs flex items-center gap-1" style={{ color: '#3b82f6' }}>
          전체보기 <ArrowRight size={12} />
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {sectors.map((sector) => (
          <Link key={sector.id} href={`/sectors/${sector.id}`}>
            <div
              className="rounded-xl p-4 card-hover flex items-center gap-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${sector.color}22, ${sector.color}11)`, border: `1px solid ${sector.color}33` }}
              >
                {sector.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{sector.nameKo}</span>
                  <span className="text-sm font-bold ml-2 flex-shrink-0" style={{ color: sector.color }}>{sector.growthRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sector.tagline}</span>
                  <span className="text-xs ml-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{sector.marketSize}</span>
                </div>
                <div className="mt-2 flex gap-1.5 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: `${sector.color}15`, color: sector.color, border: `1px solid ${sector.color}30` }}>
                    CAGR {sector.cagr}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    {sector.maturity}
                  </span>
                </div>
              </div>
              <ArrowRight size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
