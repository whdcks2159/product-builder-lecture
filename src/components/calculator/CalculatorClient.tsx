'use client';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { sectors } from '@/data/sectors';
import { Calculator, Info } from 'lucide-react';

interface SectorInput {
  id: string;
  enabled: boolean;
  allocation: number;
  expectedCagr: number;
  color: string;
  nameKo: string;
  icon: string;
}

const defaultCagr: Record<string, number> = {
  rwa: 42,
  quantum: 38,
  space: 10,
  bci: 19,
};

function buildProjection(inputs: SectorInput[], principal: number, years: number) {
  const data = [];
  for (let y = 0; y <= years; y++) {
    const point: Record<string, number | string> = { year: `${2026 + y}년` };
    let total = 0;
    inputs.forEach(s => {
      if (!s.enabled) return;
      const allocAmt = (principal * s.allocation) / 100;
      const val = allocAmt * Math.pow(1 + s.expectedCagr / 100, y);
      point[s.id] = Math.round(val);
      total += val;
    });
    point['total'] = Math.round(total);
    data.push(point);
  }
  return data;
}

export default function CalculatorClient() {
  const [principal, setPrincipal] = useState(10000000);
  const [years, setYears] = useState(5);
  const [sectorInputs, setSectorInputs] = useState<SectorInput[]>(
    sectors.map(s => ({
      id: s.id,
      enabled: true,
      allocation: s.id === 'rwa' ? 45 : s.id === 'quantum' ? 25 : s.id === 'space' ? 20 : 10,
      expectedCagr: defaultCagr[s.id],
      color: s.color,
      nameKo: s.nameKo,
      icon: s.icon,
    }))
  );

  const totalAlloc = sectorInputs.filter(s => s.enabled).reduce((sum, s) => sum + s.allocation, 0);
  const projection = buildProjection(sectorInputs, principal, years);
  const finalTotal = projection[projection.length - 1]?.total as number || 0;
  const totalReturn = ((finalTotal - principal) / principal * 100).toFixed(1);

  const updateSector = (id: string, field: keyof SectorInput, value: unknown) => {
    setSectorInputs(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const fmt = (n: number) => n >= 100000000
    ? `${(n / 100000000).toFixed(1)}억`
    : `${(n / 10000).toFixed(0)}만`;

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          <Calculator size={14} /> 기본 설정
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>초기 투자금</label>
            <select
              value={principal}
              onChange={e => setPrincipal(Number(e.target.value))}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              {[1000000, 5000000, 10000000, 30000000, 50000000, 100000000].map(v => (
                <option key={v} value={v} style={{ background: '#0d1526' }}>{fmt(v)}원</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>투자 기간</label>
            <select
              value={years}
              onChange={e => setYears(Number(e.target.value))}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              {[3, 5, 7, 10].map(v => (
                <option key={v} value={v} style={{ background: '#0d1526' }}>{v}년</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sector Allocations */}
      <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>섹터 배분</h2>
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: totalAlloc === 100 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              color: totalAlloc === 100 ? '#10b981' : '#ef4444',
            }}>
            합계 {totalAlloc}% {totalAlloc !== 100 && '(100% 권장)'}
          </span>
        </div>
        <div className="space-y-4">
          {sectorInputs.map(s => (
            <div key={s.id}>
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={s.enabled}
                  onChange={e => updateSector(s.id, 'enabled', e.target.checked)}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-sm">{s.icon}</span>
                <span className="text-sm font-medium flex-1" style={{ color: s.enabled ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {s.nameKo.split(' ')[0]}
                </span>
                {s.enabled && (
                  <span className="text-xs font-bold" style={{ color: s.color }}>{s.allocation}%</span>
                )}
              </div>
              {s.enabled && (
                <div className="pl-7 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                      <span>배분 비율</span>
                    </div>
                    <input type="range" min={5} max={80} value={s.allocation}
                      onChange={e => updateSector(s.id, 'allocation', Number(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: s.color }} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                      <span>예상 CAGR</span>
                      <span style={{ color: s.color }}>{s.expectedCagr}%</span>
                    </div>
                    <input type="range" min={5} max={80} value={s.expectedCagr}
                      onChange={e => updateSector(s.id, 'expectedCagr', Number(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: s.color }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Result Summary */}
      <div className="rounded-xl p-5" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))', border: '1px solid rgba(59,130,246,0.25)' }}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>초기 투자</div>
            <div className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{fmt(principal)}원</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{years}년 후 예상</div>
            <div className="text-base font-bold gradient-text-blue">{fmt(finalTotal)}원</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>총 수익률</div>
            <div className="text-base font-bold" style={{ color: '#10b981' }}>+{totalReturn}%</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>자산 성장 시뮬레이션</p>
        <ResponsiveContainer width="100%" height={220} minHeight={220}>
          <LineChart data={projection} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" tick={{ fill: '#8899b4', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8899b4', fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={v => `${(v / 10000).toFixed(0)}만`} />
            <Tooltip
              contentStyle={{ background: '#0d1526', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 11 }}
              formatter={(v) => [fmt(Number(v)) + '원', undefined]}
            />
            <Legend wrapperStyle={{ fontSize: 10, color: '#8899b4', paddingTop: 8 }} />
            {sectorInputs.filter(s => s.enabled).map(s => (
              <Line key={s.id} type="monotone" dataKey={s.id} name={s.nameKo.split(' ')[0]}
                stroke={s.color} strokeWidth={1.5} dot={false} />
            ))}
            <Line type="monotone" dataKey="total" name="합계" stroke="#ffffff" strokeWidth={2}
              strokeDasharray="5 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl p-4 flex gap-2" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <Info size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          본 계산기는 시장 전망치를 기반으로 한 단순 시뮬레이션으로, 실제 투자 결과와 다를 수 있습니다.
          모든 투자에는 원금 손실 위험이 있으며, 본 도구는 교육적 목적으로만 활용하시기 바랍니다.
        </p>
      </div>
    </div>
  );
}
