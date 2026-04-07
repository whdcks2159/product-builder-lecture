'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { marketGrowthData } from '@/data/market-data';

const sectors = [
  { key: 'rwa', label: 'RWA', color: '#3b82f6' },
  { key: 'quantum', label: '양자', color: '#8b5cf6' },
  { key: 'space', label: '우주', color: '#f59e0b' },
  { key: 'bci', label: 'BCI', color: '#10b981' },
];

export default function GrowthChart() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>시장 규모 추이 (조 달러)</h2>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>2022–2030E</span>
      </div>
      <div
        className="rounded-xl p-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <ResponsiveContainer width="100%" height={220} minHeight={220}>
          <AreaChart data={marketGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              {sectors.map(s => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0d1526', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#e2e8f0' }}
              formatter={(v) => [`$${v}조`, undefined]}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: '#8899b4', paddingTop: 8 }} />
            {sectors.map(s => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#grad-${s.key})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
