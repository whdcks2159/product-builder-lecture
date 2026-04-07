'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { marketGrowthData } from '@/data/market-data';
import { SectorId } from '@/data/sectors';

interface Props {
  sectorId: SectorId;
  color: string;
}

export default function SectorDetailChart({ sectorId, color }: Props) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
        시장 규모 전망 (조 달러)
      </p>
      <ResponsiveContainer width="100%" height={180} minHeight={180}>
        <BarChart data={marketGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="year" tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#0d1526', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#e2e8f0' }}
            formatter={(v) => [`$${v}조`, undefined]}
          />
          <Bar dataKey={sectorId} fill={color} radius={[4, 4, 0, 0]} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
