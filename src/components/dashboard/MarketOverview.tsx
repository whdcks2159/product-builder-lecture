import { keyMetrics } from '@/data/market-data';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketOverview() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>핵심 지표</h2>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>실시간 업데이트</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {keyMetrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl p-4 card-hover"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>{metric.label}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                style={{
                  background: metric.positive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  color: metric.positive ? '#10b981' : '#ef4444',
                }}
              >
                {metric.positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {metric.change}
              </span>
            </div>
            <div className="text-xl font-bold" style={{ color: metric.color }}>{metric.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{metric.sector}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
