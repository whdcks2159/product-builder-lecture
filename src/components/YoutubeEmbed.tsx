'use client';

import { useState } from 'react';

interface YoutubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

/**
 * Privacy-enhanced YouTube embed with:
 * - youtube-nocookie.com (no tracking until play)
 * - Click-to-load (prevents auto-loading iframe)
 * - Responsive 16:9 ratio
 * - Mobile-optimized
 */
export default function YoutubeEmbed({ videoId, title = '스트레칭 영상', className = '' }: YoutubeEmbedProps) {
  const [active, setActive] = useState(false);

  const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-black ${className}`} style={{ aspectRatio: '16/9' }}>
      {!active ? (
        /* ── 썸네일 오버레이 (클릭 전) ───────────────────────── */
        <button
          onClick={() => setActive(true)}
          className="group w-full h-full relative flex items-center justify-center"
          aria-label={`${title} 영상 재생`}
        >
          {/* 썸네일 */}
          <img
            src={thumbUrl}
            alt={`${title} 썸네일`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback to medium quality thumbnail
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            }}
          />
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          {/* 재생 버튼 */}
          <div className="relative z-10 w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-500 flex items-center justify-center shadow-2xl transition-all group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          {/* YouTube 로고 뱃지 */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 rounded-md px-2 py-1">
            <svg viewBox="0 0 24 24" fill="#FF0000" className="w-4 h-4">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zm-13.9 9.4V8.4l6.3 3.6-6.3 3.6z"/>
            </svg>
            <span className="text-white text-[10px] font-semibold">YouTube</span>
          </div>
          {/* 제목 */}
          <div className="absolute bottom-3 left-3 right-16">
            <p className="text-white text-xs font-semibold line-clamp-1 drop-shadow">{title}</p>
          </div>
        </button>
      ) : (
        /* ── 실제 iframe (클릭 후) ───────────────────────────── */
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
        />
      )}
    </div>
  );
}
