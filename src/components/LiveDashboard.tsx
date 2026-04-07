'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw, Zap } from 'lucide-react';
import type { TokenPrice } from '@/app/api/market/route';

interface MarketData {
  prices: TokenPrice[];
  metrics: Record<string, number>;
  updatedAt: string;
}

const SECTOR_LABELS: Record<string, string> = {
  rwa: 'RWA', quantum: '양자', space: '우주', bci: 'BCI', general: '주요코인', tech: '테크',
};

// 스파크라인 데이터 (모의 추세선)
function generateSparkline(base: number, change: number): { v: number }[] {
  const pts = 12;
  return Array.from({ length: pts }, (_, i) => ({
    v: base * (1 - change / 100) + (base * change / 100) * (i / (pts - 1)) + (Math.random() - 0.5) * base * 0.005,
  }));
}

function formatPrice(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString('en', { maximumFractionDigits: 0 })}`;
  if (p >= 1)    return `$${p.toFixed(2)}`;
  return `$${p.toFixed(4)}`;
}

function MetricCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-[10px] mb-1 leading-tight" style={{ color: 'rgba(148,163,184,0.6)' }}>{label}</p>
      <p className="text-base font-bold" style={{ color }}>
        {unit === '$' ? `$${value.toLocaleString('en', { maximumFractionDigits: 1 })}B` : value.toLocaleString('en', { maximumFractionDigits: 0 }) + unit}
      </p>
    </div>
  );
}

export default function LiveDashboard() {
  const [data, setData]         = useState<MarketData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [activeTab, setActiveTab] = useState<'prices' | 'sectors'>('prices');

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res  = await fetch('/api/market', { cache: 'no-store' });
      const json = await res.json() as MarketData;
      setData(json);
      setLastUpdate(new Date(json.updatedAt).toLocaleTimeString('ko-KR'));
    } catch { /* 네트워크 오류 무시 */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => fetchData(true), 60_000); // 1분마다 자동 갱신
    return () => clearInterval(timer);
  }, [fetchData]);

  const rwaTokens    = data?.prices.filter(p => p.sector === 'rwa')    ?? [];
  const generalTokens = data?.prices.filter(p => p.sector !== 'rwa')   ?? [];
  const metrics      = data?.metrics;

  const barChartData = data?.prices.map(p => ({
    name: p.nameKo,
    change: parseFloat(p.change24h.toFixed(2)),
    color: p.color,
  })) ?? [];

  const sectorTVLData = [
    { name: 'RWA TVL',     value: metrics?.rwaOnchainTVL    ?? 0, color: '#3b82f6', unit: '$' },
    { name: '양자 투자',   value: metrics?.quantumFunding   ?? 0, color: '#8b5cf6', unit: '$' },
    { name: '우주 매출',   value: metrics?.spaceRevenue     ?? 0, color: '#f59e0b', unit: '$' },
    { name: 'BCI 임상',    value: metrics?.bciClinicalCount ?? 0, color: '#10b981', unit: '명' },
  ];

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: '#f59e0b' }} />
          <h2 className="text-sm font-bold" style={{ color: '#e2e8f0' }}>실시간 마켓 대시보드</h2>
          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 pulse-dot" />
            60s 갱신
          </span>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && <span className="text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>{lastUpdate}</span>}
          <button onClick={() => fetchData()}
            className="p-1.5 rounded-lg transition-opacity hover:opacity-70"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} style={{ color: '#94a3b8' }} />
          </button>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-1.5 mb-4 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
        {(['prices', 'sectors'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeTab === tab ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: activeTab === tab ? '#60a5fa' : 'rgba(148,163,184,0.5)',
              border: activeTab === tab ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
            }}>
            {tab === 'prices' ? '토큰 가격' : '섹터 지표'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      ) : activeTab === 'prices' ? (
        <>
          {/* Token Price List */}
          <div className="space-y-2.5 mb-5">
            {data?.prices.map(token => {
              const positive = token.change24h >= 0;
              const spark = generateSparkline(token.price, token.change24h);
              return (
                <div key={token.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${token.color}20`, border: `1px solid ${token.color}30`, color: token.color }}>
                    {token.symbol.slice(0, 3)}
                  </div>
                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold leading-none" style={{ color: '#e2e8f0' }}>{token.nameKo}</p>
                    <p className="text-[10px] mt-0.5"
                      style={{ color: `${token.color}aa` }}>
                      {SECTOR_LABELS[token.sector] ?? token.sector}
                    </p>
                  </div>
                  {/* Sparkline */}
                  <div className="flex-shrink-0">
                    <LineChart width={64} height={32} data={spark}>
                      <Line type="monotone" dataKey="v" stroke={positive ? '#34d399' : '#f87171'}
                        strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </div>
                  {/* Price & Change */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold" style={{ color: '#f1f5f9' }}>{formatPrice(token.price)}</p>
                    <p className="text-[10px] flex items-center justify-end gap-0.5"
                      style={{ color: positive ? '#34d399' : '#f87171' }}>
                      {positive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                      {positive ? '+' : ''}{token.change24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 24h Change Bar Chart */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(148,163,184,0.6)' }}>24시간 등락률 비교</p>
            <ResponsiveContainer width="100%" height={140} minHeight={140}>
              <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: '#0d1526', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 11 }}
                  formatter={v => [`${v}%`, '24h 변동']}
                />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                <Bar dataKey="change" radius={[3, 3, 0, 0]}>
                  {barChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.change >= 0 ? '#34d399' : '#f87171'} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <>
          {/* Sector Metrics Cards */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {sectorTVLData.map(m => (
              <MetricCard key={m.name} label={m.name} value={m.value} unit={m.unit} color={m.color} />
            ))}
          </div>

          {/* Sector TVL Bar Chart */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(148,163,184,0.6)' }}>RWA 온체인 TVL ($B)</p>
            <ResponsiveContainer width="100%" height={150} minHeight={150}>
              <BarChart
                data={[
                  { name: 'ETH', value: 7.2 },
                  { name: 'Stellar', value: 2.1 },
                  { name: 'Polygon', value: 1.3 },
                  { name: 'Solana', value: 0.9 },
                  { name: 'Base', value: 0.6 },
                  { name: 'Other', value: 0.3 },
                ]}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `$${v}B`} />
                <Tooltip
                  contentStyle={{ background: '#0d1526', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 11 }}
                  formatter={v => [`$${v}B`, 'TVL']}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}
