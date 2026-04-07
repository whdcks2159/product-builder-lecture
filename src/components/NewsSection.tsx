'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Newspaper, RefreshCw, ExternalLink, Clock, Wifi, WifiOff } from 'lucide-react';
import type { NewsItem } from '@/app/api/news/route';

const CATEGORY_COLORS: Record<string, string> = {
  rwa:     '#3b82f6',
  quantum: '#8b5cf6',
  space:   '#f59e0b',
  bci:     '#10b981',
  general: '#64748b',
};

const CATEGORY_LABELS: Record<string, string> = {
  rwa:     'RWA',
  quantum: '양자',
  space:   '우주',
  bci:     'BCI',
  general: '일반',
};

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default function NewsSection() {
  const [news, setNews]         = useState<NewsItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [isLive, setIsLive]     = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const [filter, setFilter]     = useState<string>('all');

  const fetchNews = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res  = await fetch('/api/news', { next: { revalidate: 1800 } });
      const data = await res.json();
      setNews(data.items ?? []);
      setIsLive(data.source === 'live');
      setLastUpdate(new Date(data.fetchedAt).toLocaleTimeString('ko-KR'));
    } catch {
      // 오프라인 상태 — 기존 캐시 유지
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const timer = setInterval(() => fetchNews(true), 30 * 60 * 1000); // 30분마다 갱신
    return () => clearInterval(timer);
  }, [fetchNews]);

  const filtered = filter === 'all' ? news : news.filter(n => n.category === filter);
  const categories = ['all', ...Array.from(new Set(news.map(n => n.category)))];

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper size={14} style={{ color: '#3b82f6' }} />
          <h2 className="text-sm font-bold" style={{ color: '#e2e8f0' }}>자동 뉴스 피드</h2>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px]"
            style={{
              background: isLive ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.12)',
              border: `1px solid ${isLive ? 'rgba(16,185,129,0.3)' : 'rgba(100,116,139,0.3)'}`,
              color: isLive ? '#34d399' : '#94a3b8',
            }}>
            {isLive ? <Wifi size={9} /> : <WifiOff size={9} />}
            {isLive ? 'Live' : 'Curated'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>
              <Clock size={9} className="inline mr-0.5" />{lastUpdate}
            </span>
          )}
          <button onClick={() => fetchNews()}
            className="p-1.5 rounded-lg transition-opacity hover:opacity-70"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} style={{ color: '#94a3b8' }} />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {categories.map(cat => {
          const color = CATEGORY_COLORS[cat] ?? '#60a5fa';
          const active = filter === cat;
          return (
            <button key={cat} onClick={() => setFilter(cat)}
              className="flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all"
              style={{
                background: active ? `${color}20` : 'rgba(255,255,255,0.04)',
                border: active ? `1px solid ${color}40` : '1px solid rgba(255,255,255,0.06)',
                color: active ? color : 'rgba(148,163,184,0.6)',
              }}>
              {cat === 'all' ? '전체' : CATEGORY_LABELS[cat] ?? cat}
            </button>
          );
        })}
      </div>

      {/* News List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-xl h-20 animate-pulse"
              style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item, idx) => {
            const color = CATEGORY_COLORS[item.category] ?? '#60a5fa';
            const isExternal = item.link.startsWith('http');
            const Wrapper = isExternal ? 'a' : Link;
            const wrapperProps = isExternal
              ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
              : { href: item.link };

            return (
              // @ts-ignore
              <Wrapper key={idx} {...wrapperProps}>
                <div className="flex gap-3 p-3 rounded-xl transition-all active:scale-[0.99]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {/* Category dot */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}60` }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: `${color}15`, color }}>
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </span>
                      <span className="text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>
                        {item.source}
                      </span>
                      {timeAgo(item.pubDate) && (
                        <span className="text-[10px]" style={{ color: 'rgba(148,163,184,0.35)' }}>
                          · {timeAgo(item.pubDate)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: '#e2e8f0' }}>
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-xs mt-1 line-clamp-1" style={{ color: 'rgba(148,163,184,0.55)' }}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  {isExternal && (
                    <ExternalLink size={13} className="flex-shrink-0 mt-1" style={{ color: 'rgba(148,163,184,0.3)' }} />
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>
      )}
    </section>
  );
}
