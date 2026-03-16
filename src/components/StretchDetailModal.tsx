'use client';

import { useEffect, useCallback } from 'react';
import type { Stretch } from '@/types';
import YoutubeEmbed from '@/components/YoutubeEmbed';
import StretchSteps from '@/components/StretchSteps';
import StretchTimer from '@/components/StretchTimer';
import FavoriteButton from '@/components/FavoriteButton';

interface StretchDetailModalProps {
  stretch: Stretch;
  categoryName?: string;
  onClose: () => void;
}

const difficultyStyle: Record<string, string> = {
  쉬움: 'bg-green-100 text-green-700',
  보통: 'bg-amber-100 text-amber-700',
  어려움: 'bg-red-100 text-red-700',
};

/**
 * 스트레칭 상세 정보 모달
 * 페이지 구조:
 *  1. 헤더 (이름 + 닫기 버튼)
 *  2. 대표 사진 or YouTube 영상
 *  3. 간단 설명 + 메타 정보
 *  4. GIF (있을 때)
 *  5. 단계별 동작
 *  6. 타이머
 */
export default function StretchDetailModal({ stretch, categoryName, onClose }: StretchDetailModalProps) {
  // ESC 키 닫기
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative z-10 w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: '92dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 헤더 ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 bg-white shrink-0">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-xl shrink-0">
            {stretch.icon || '🤸'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-extrabold text-gray-900 leading-tight truncate">{stretch.name}</h2>
            {categoryName && <p className="text-[11px] text-green-600 font-medium mt-0.5">{categoryName}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <FavoriteButton stretchId={stretch.id} stretchName={stretch.name} />
            <button
              onClick={onClose}
              aria-label="닫기"
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── 스크롤 영역 ──────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* 1. YouTube 영상 (있을 때 최우선 표시) */}
          {stretch.youtubeId && (
            <div className="px-0">
              <YoutubeEmbed
                videoId={stretch.youtubeId}
                title={`${stretch.name} 스트레칭 방법`}
                className="rounded-none"
              />
            </div>
          )}

          {/* 2. 대표 사진 (영상 없고 사진 있을 때) */}
          {!stretch.youtubeId && stretch.photo_url && (
            <div className="relative w-full bg-gray-100" style={{ aspectRatio: '16/9' }}>
              <img
                src={stretch.photo_url}
                alt={`${stretch.name} 스트레칭 자세`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {stretch.photo_credit && (
                <a
                  href={stretch.photo_credit_url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 text-[9px] text-white/70 bg-black/30 rounded px-1.5 py-0.5 backdrop-blur-sm hover:text-white transition"
                >
                  📷 {stretch.photo_credit} / {stretch.photo_source}
                </a>
              )}
            </div>
          )}

          <div className="px-4 py-5 space-y-5">

            {/* 3. 설명 + 메타 */}
            <div>
              {/* Difficulty + holdTime badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {stretch.difficulty && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${difficultyStyle[stretch.difficulty]}`}>
                    {stretch.difficulty}
                  </span>
                )}
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                  ⏱ {stretch.holdTime}
                </span>
                {stretch.youtubeId && (
                  <span className="text-xs font-semibold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
                    ▶ 영상 있음
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{stretch.description}</p>
            </div>

            {/* 4. 타겟 근육 */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">타겟 근육</p>
              <div className="flex flex-wrap gap-1.5">
                {stretch.muscles.map((m) => (
                  <span key={m} className="text-xs bg-gray-100 text-gray-600 border border-gray-200 rounded-full px-2.5 py-0.5">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. GIF 애니메이션 */}
            {stretch.gifUrl && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">동작 애니메이션</p>
                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={stretch.gifUrl}
                    alt={`${stretch.name} 동작 GIF`}
                    className="w-full object-contain max-h-60"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* 6. 단계별 동작 */}
            <StretchSteps
              steps={stretch.steps}
              detailedSteps={stretch.detailedSteps}
              stretchName={stretch.name}
            />

            {/* 7. 타이머 */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">스트레칭 타이머</p>
              <StretchTimer
                defaultSeconds={parseInt(stretch.holdTime) || 30}
                stretchName={stretch.name}
              />
            </div>

            {/* 사진 출처 */}
            {stretch.photo_source_url && (
              <a
                href={stretch.photo_source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition"
              >
                사진 출처: {stretch.photo_source} ↗
              </a>
            )}
          </div>
        </div>

        {/* ── 하단 고정 버튼 ────────────────────────────────── */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-3 rounded-xl text-sm transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
