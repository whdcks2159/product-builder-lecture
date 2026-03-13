'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { exercises } from '@/data/exercises';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-white/5 h-14 flex items-center">
        <div className="w-full max-w-5xl mx-auto px-4 flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
            <span className="text-base font-semibold text-gray-200 whitespace-nowrap">
              Daily<strong className="text-green-400 font-bold">Stretch</strong>
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-sm relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="운동 또는 근육 이름으로 검색..."
              className="w-full bg-white/10 text-gray-100 placeholder-white/40 border border-white/15 rounded-full py-2 pl-9 pr-4 text-sm outline-none focus:border-green-400/50 focus:bg-white/15"
            />
          </form>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-1 ml-auto">
            <Link href="/" className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/8 rounded-lg transition">
              홈
            </Link>
            <Link href="/#exercises" className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/8 rounded-lg transition">
              운동별
            </Link>
            <Link href="/#pain" className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/8 rounded-lg transition">
              통증별
            </Link>
            <Link href="/back-pain" className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/8 rounded-lg transition">
              허리 디스크
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="sm:hidden ml-auto text-gray-300 text-2xl p-1"
            aria-label="메뉴 열기"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            ref={drawerRef}
            className="w-72 max-w-[85vw] bg-gray-900 h-full flex flex-col shadow-2xl animate-slide-up"
            style={{ animation: 'slideInLeft 0.25s ease' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <span className="text-white font-bold">메뉴</span>
              <button onClick={() => setMenuOpen(false)} className="text-gray-400 text-xl p-1">✕</button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-4 py-3 border-b border-white/8">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="스트레칭 검색..."
                  className="w-full bg-white/10 text-gray-100 placeholder-white/40 border border-white/15 rounded-full py-2 pl-9 pr-4 text-sm outline-none"
                />
              </div>
            </form>

            <nav className="flex-1 overflow-y-auto py-2">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition">
                🏠 <span>홈</span>
              </Link>
              <Link href="/#exercises" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition">
                🏋️ <span>운동별 스트레칭</span>
              </Link>
              <Link href="/#pain" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition">
                💊 <span>통증별 스트레칭</span>
              </Link>
              <Link href="/back-pain" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition">
                🦴 <span>허리 디스크 예방</span>
              </Link>

              <div className="px-4 pt-4 pb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">운동 카테고리</p>
              </div>
              {exercises.map((ex) => (
                <Link
                  key={ex.id}
                  href={`/exercise/${ex.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 hover:text-white transition text-sm"
                >
                  <span>{ex.icon}</span>
                  <span>{ex.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      <style jsx global>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
