import { NextResponse } from 'next/server';

export const revalidate = 60; // 60초 캐시

export interface TokenPrice {
  id: string;
  symbol: string;
  name: string;
  nameKo: string;
  price: number;
  change24h: number;
  sector: string;
  color: string;
}

// CoinGecko 무료 API — API 키 불필요
const COINGECKO_IDS = 'bitcoin,ethereum,ondo-finance,maple,centrifuge,render-token';

const TOKEN_META: Record<string, { nameKo: string; sector: string; color: string }> = {
  bitcoin:       { nameKo: 'BTC',           sector: 'general', color: '#f59e0b' },
  ethereum:      { nameKo: 'ETH',           sector: 'general', color: '#627eea' },
  'ondo-finance':{ nameKo: 'ONDO (RWA)',    sector: 'rwa',     color: '#3b82f6' },
  maple:         { nameKo: 'MAPLE (RWA)',   sector: 'rwa',     color: '#06b6d4' },
  centrifuge:    { nameKo: 'CFG (RWA)',     sector: 'rwa',     color: '#8b5cf6' },
  'render-token':{ nameKo: 'RENDER (AI)',   sector: 'tech',    color: '#10b981' },
};

// 시장 지표 (모의 데이터 — 외부 API 연동 전 사용)
function generateSectorMetrics() {
  const base = {
    rwaOnchainTVL:    12_400 + Math.random() * 200 - 100,
    rwaTotalIssuance: 8_400  + Math.random() * 150 - 75,
    quantumFunding:   2_300  + Math.random() * 50  - 25,
    spaceRevenue:     630    + Math.random() * 20  - 10,
    bciClinicalCount: 1847   + Math.floor(Math.random() * 10),
  };
  return base;
}

async function fetchCoinGecko(): Promise<TokenPrice[]> {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${COINGECKO_IDS}&vs_currencies=usd&include_24hr_change=true`;
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error('CoinGecko error');
    const data = await res.json();

    return Object.entries(data).map(([id, vals]: [string, any]) => ({
      id,
      symbol: id.split('-')[0].toUpperCase(),
      name: id,
      nameKo: TOKEN_META[id]?.nameKo ?? id,
      price: vals.usd ?? 0,
      change24h: vals.usd_24h_change ?? 0,
      sector: TOKEN_META[id]?.sector ?? 'general',
      color:  TOKEN_META[id]?.color  ?? '#94a3b8',
    }));
  } catch {
    // 폴백: 모의 가격 (실 API 다운 시)
    return [
      { id: 'bitcoin',       symbol: 'BTC',   name: 'Bitcoin',    nameKo: 'BTC',        price: 68420 + Math.random()*500, change24h: 2.3 + Math.random()*0.5,  sector: 'general', color: '#f59e0b' },
      { id: 'ethereum',      symbol: 'ETH',   name: 'Ethereum',   nameKo: 'ETH',        price: 3840  + Math.random()*100, change24h: 1.8 + Math.random()*0.3,  sector: 'general', color: '#627eea' },
      { id: 'ondo-finance',  symbol: 'ONDO',  name: 'Ondo',       nameKo: 'ONDO (RWA)', price: 1.24  + Math.random()*0.05,change24h: 5.6 + Math.random()*1.0,  sector: 'rwa',     color: '#3b82f6' },
      { id: 'maple',         symbol: 'MAPLE', name: 'Maple',      nameKo: 'MAPLE (RWA)',price: 18.3  + Math.random()*0.5, change24h: 3.2 + Math.random()*0.8,  sector: 'rwa',     color: '#06b6d4' },
      { id: 'centrifuge',    symbol: 'CFG',   name: 'Centrifuge', nameKo: 'CFG (RWA)',  price: 0.52  + Math.random()*0.02,change24h: -1.4 + Math.random()*0.5, sector: 'rwa',     color: '#8b5cf6' },
      { id: 'render-token',  symbol: 'RNDR',  name: 'Render',     nameKo: 'RENDER',     price: 8.9   + Math.random()*0.3, change24h: 4.1 + Math.random()*0.9,  sector: 'tech',    color: '#10b981' },
    ];
  }
}

export async function GET() {
  const [prices, metrics] = await Promise.all([
    fetchCoinGecko(),
    Promise.resolve(generateSectorMetrics()),
  ]);

  return NextResponse.json({
    prices,
    metrics,
    updatedAt: new Date().toISOString(),
  });
}
