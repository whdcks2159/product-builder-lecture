'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { exercises } from '@/data/exercises';
import { painAreas } from '@/data/pain-areas';
import type { Stretch } from '@/types';
import AdUnit from '@/components/AdUnit';

interface FavItem {
  id: string;
  name: string;
  savedAt: number;
}

function findStretchById(id: string): { stretch: Stretch; source: string; slug: string } | null {
  for (const ex of exercises) {
    for (const s of [...(ex.beforeStretches ?? []), ...(ex.afterStretches ?? [])]) {
      if (s.id === id) return { stretch: s, source: ex.name, slug: `/exercise/${ex.slug}` };
    }
  }
  for (const pa of painAreas) {
    for (const s of pa.stretches ?? []) {
      if (s.id === id) return { stretch: s, source: pa.name, slug: `/pain/${pa.slug}` };
    }
  }
  return null;
}

export default function MyFavoritesPage() {
  const [items, setItems] = useState<FavItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('daily-stretch-favorite-items');
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  function remove(id: string) {
    const nextItems = items.filter((f) => f.id !== id);
    const nextIds = nextItems.map((f) => f.id);
    setItems(nextItems);
    localStorage.setItem('daily-stretch-favorite-items', JSON.stringify(nextItems));
    localStorage.setItem('daily-stretch-favorites', JSON.stringify(nextIds));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-green-600 transition mb-6">
        ← 홈
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">❤️</span>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">내 즐겨찾기</h1>
          <p className="text-sm text-gray-500">저장한 스트레칭을 모아볼 수 있습니다</p>
        </div>
      </div>

      <AdUnit slot="banner" />

      {!loaded ? (
        <div className="text-center py-16 text-gray-400">불러오는 중...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🤍</div>
          <p className="text-gray-500 font-semibold mb-2">아직 저장된 스트레칭이 없습니다</p>
          <p className="text-gray-400 text-sm mb-6">스트레칭 카드의 하트 버튼을 눌러 즐겨찾기를 추가해보세요</p>
          <Link href="/" className="inline-block bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition">
            스트레칭 탐색하기
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 mb-4">{items.length}개 저장됨</p>
          {items.map((item) => {
            const found = findStretchById(item.id);
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-2xl shrink-0">
                  {found?.stretch.icon ?? '🤸'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{found?.stretch.name ?? item.name}</p>
                  {found && (
                    <p className="text-xs text-gray-400 mt-0.5">{found.source} · {found.stretch.muscles.slice(0, 2).join(', ')}</p>
                  )}
                  <p className="text-[10px] text-gray-300 mt-1">
                    {new Date(item.savedAt).toLocaleDateString('ko-KR')} 저장
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {found && (
                    <Link href={found.slug} className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition">
                      보기
                    </Link>
                  )}
                  <button
                    onClick={() => remove(item.id)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <AdUnit slot="rectangle" />
      </div>
    </div>
  );
}
