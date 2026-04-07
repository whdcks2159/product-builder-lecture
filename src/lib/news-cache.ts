import type { NewsItem } from '@/app/api/news/route';

export interface NewsCache {
  items: NewsItem[];
  fetchedAt: string;
  source: 'live' | 'curated';
}

const CACHE_TTL_MS = 30 * 60 * 1000; // 30분

// 모듈 레벨 싱글톤 (서버리스 함수 인스턴스 수명 동안 유지)
let _cache: NewsCache | null = null;

export function setNewsCache(cache: NewsCache): void {
  _cache = cache;
}

export function getNewsCache(): NewsCache | null {
  if (!_cache) return null;
  const age = Date.now() - new Date(_cache.fetchedAt).getTime();
  return age < CACHE_TTL_MS ? _cache : null;
}
