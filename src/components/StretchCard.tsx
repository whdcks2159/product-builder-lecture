'use client';

import { useState, lazy, Suspense } from 'react';
import Image from 'next/image';
import type { Stretch } from '@/types';
import StretchTimer from '@/components/StretchTimer';
import FavoriteButton from '@/components/FavoriteButton';
import StretchSteps from '@/components/StretchSteps';

// 모달은 필요할 때만 로드
const StretchDetailModal = lazy(() => import('@/components/StretchDetailModal'));

interface StretchCardProps {
  stretch: Stretch;
  categoryName?: string;
}

const difficultyStyle: Record<string, string> = {
  쉬움:   'bg-green-100 text-green-700',
  보통:   'bg-amber-100 text-amber-700',
  어려움: 'bg-red-100 text-red-700',
};

export default function StretchCard({ stretch, categoryName }: StretchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const hasVideo = !!stretch.youtubeId;
  const hasGif   = !!stretch.gifUrl;

  return (
    <>
      <article
        className="bg-white border border-gray-200 rounded-xl overflow-hidden stretch-card-hover"
        onClick={() => setExpanded((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {/* ── 대표 사진 ──────────────────────────────────────── */}
        {stretch.photo_url && !imgError && (
          <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
            <Image
              src={stretch.photo_url}
              alt={`${stretch.name} 스트레칭 자세`}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-center"
              onError={() => setImgError(true)}
            />
            {/* 미디어 뱃지 */}
            {(hasVideo || hasGif) && (
              <div className="absolute top-2 left-2 flex gap-1">
                {hasVideo && (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full shadow">
                    ▶ 영상
                  </span>
                )}
                {hasGif && (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full shadow">
                    GIF
                  </span>
                )}
              </div>
            )}
            {stretch.photo_credit && (
              <a
                href={stretch.photo_credit_url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-1.5 right-2 text-[9px] text-white/70 bg-black/30 rounded px-1.5 py-0.5 backdrop-blur-sm hover:text-white transition"
              >
                📷 {stretch.photo_credit} / {stretch.photo_source}
              </a>
            )}
          </div>
        )}

        {/* 사진 없이 영상 있는 경우 배너 */}
        {!stretch.photo_url && hasVideo && (
          <div className="w-full h-12 bg-gradient-to-r from-red-600/10 to-rose-500/10 flex items-center gap-2 px-4">
            <span className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5 ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-xs font-bold text-red-600">영상 가이드 포함</span>
          </div>
        )}

        {/* ── 카드 본문 ─────────────────────────────────────── */}
        <div className="flex items-start gap-3 p-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl shrink-0">
            {stretch.icon || '🤸'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-gray-900 leading-snug">{stretch.name}</h3>
              <div className="flex items-center gap-1.5 shrink-0">
                {stretch.difficulty && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyStyle[stretch.difficulty]}`}>
                    {stretch.difficulty}
                  </span>
                )}
                <FavoriteButton stretchId={stretch.id} stretchName={stretch.name} size="sm" />
              </div>
            </div>

            {categoryName && (
              <p className="text-[11px] text-primary-600 font-medium mt-0.5">{categoryName}</p>
            )}

            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {stretch.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {stretch.muscles.slice(0, 3).map((m) => (
                <span key={m} className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 rounded-full px-2 py-0.5">
                  {m}
                </span>
              ))}
              <span className="text-[10px] bg-primary-50 text-primary-700 rounded-full px-2 py-0.5 font-semibold">
                ⏱ {stretch.holdTime}
              </span>
            </div>
          </div>

          <span className={`text-gray-400 text-lg shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
            ›
          </span>
        </div>

        {/* ── 펼침 상세 ─────────────────────────────────────── */}
        {expanded && (
          <div
            className="border-t border-gray-100 bg-gray-50 px-4 py-4 space-y-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 타겟 근육 */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">타겟 근육</p>
              <div className="flex flex-wrap gap-1.5">
                {stretch.muscles.map((m) => (
                  <span key={m} className="text-xs bg-white border border-gray-200 rounded-full px-2.5 py-0.5 text-gray-600">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* 단계별 방법 */}
            <StretchSteps
              steps={stretch.steps}
              detailedSteps={stretch.detailedSteps}
              stretchName={stretch.name}
            />

            {/* 타이머 */}
            <div>
              <button
                onClick={() => setShowTimer((v) => !v)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  showTimer ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ⏱ 타이머 {showTimer ? '닫기' : '열기'}
              </button>
              {showTimer && (
                <div className="mt-3">
                  <StretchTimer
                    defaultSeconds={parseInt(stretch.holdTime) || 30}
                    stretchName={stretch.name}
                  />
                </div>
              )}
            </div>

            {/* 상세 보기 버튼 (영상/GIF 있을 때 강조) */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowModal(true)}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  hasVideo
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {hasVideo ? '▶ 영상으로 보기' : hasGif ? '🎬 GIF로 보기' : '📋 상세 보기'}
              </button>
              <button
                onClick={() => setExpanded(false)}
                className="text-xs text-gray-400 hover:text-gray-600 transition"
              >
                접기 ↑
              </button>
            </div>

            {stretch.photo_source_url && (
              <a
                href={stretch.photo_source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition"
                onClick={(e) => e.stopPropagation()}
              >
                사진 출처: {stretch.photo_source} ↗
              </a>
            )}
          </div>
        )}
      </article>

      {/* 상세 모달 */}
      {showModal && (
        <Suspense fallback={null}>
          <StretchDetailModal
            stretch={stretch}
            categoryName={categoryName}
            onClose={() => setShowModal(false)}
          />
        </Suspense>
      )}
    </>
  );
}
