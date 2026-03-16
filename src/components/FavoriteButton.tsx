'use client';

import { useState, useEffect } from 'react';

interface FavoriteButtonProps {
  stretchId: string;
  stretchName: string;
  size?: 'sm' | 'md';
}

export default function FavoriteButton({ stretchId, stretchName, size = 'md' }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('daily-stretch-favorites') ?? '[]');
      setIsFav(favs.includes(stretchId));
    } catch { /* ignore */ }
  }, [stretchId]);

  function toggle() {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('daily-stretch-favorites') ?? '[]');
      const favItems: { id: string; name: string; savedAt: number }[] = JSON.parse(
        localStorage.getItem('daily-stretch-favorite-items') ?? '[]'
      );

      let nextFavs: string[];
      let nextItems: typeof favItems;

      if (isFav) {
        nextFavs = favs.filter((f) => f !== stretchId);
        nextItems = favItems.filter((f) => f.id !== stretchId);
      } else {
        nextFavs = [...favs, stretchId];
        nextItems = [{ id: stretchId, name: stretchName, savedAt: Date.now() }, ...favItems];
        setAnimate(true);
        setTimeout(() => setAnimate(false), 600);
      }

      localStorage.setItem('daily-stretch-favorites', JSON.stringify(nextFavs));
      localStorage.setItem('daily-stretch-favorite-items', JSON.stringify(nextItems));
      setIsFav(!isFav);
    } catch { /* ignore */ }
  }

  const sizeClass = size === 'sm'
    ? 'w-7 h-7 text-base'
    : 'w-9 h-9 text-xl';

  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggle(); }}
      aria-label={isFav ? '즐겨찾기 제거' : '즐겨찾기 추가'}
      className={`${sizeClass} rounded-full flex items-center justify-center transition-all ${
        isFav
          ? 'bg-rose-100 text-rose-500 hover:bg-rose-200'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-rose-400'
      } ${animate ? 'scale-125' : 'scale-100'}`}
      style={{ transition: 'transform 0.2s ease, background-color 0.2s' }}
    >
      {isFav ? '❤️' : '🤍'}
    </button>
  );
}
