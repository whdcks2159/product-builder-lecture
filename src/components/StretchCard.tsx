'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Stretch, StretchStep } from '@/types';

interface StretchCardProps {
  stretch: Stretch;
  categoryName?: string;
  showDetail?: boolean;
}

const difficultyStyle: Record<string, string> = {
  쉬움:   'bg-green-100 text-green-700',
  보통:   'bg-amber-100 text-amber-700',
  어려움: 'bg-red-100 text-red-700',
};

export default function StretchCard({ stretch, categoryName }: StretchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className="bg-white border border-gray-200 rounded-xl overflow-hidden stretch-card-hover"
      onClick={() => setExpanded((v) => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setExpanded((v) => !v)}
      aria-expanded={expanded}
    >
      {/* ── 대표 사진 (사진이 있을 때만 표시) ─────────────────── */}
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
          {/* 사진 출처 크레딧 */}
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

      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl shrink-0">
          {stretch.icon || '🤸'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900 leading-snug">{stretch.name}</h3>
            {stretch.difficulty && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${difficultyStyle[stretch.difficulty]}`}>
                {stretch.difficulty}
              </span>
            )}
          </div>

          {categoryName && (
            <p className="text-[11px] text-primary-600 font-medium mt-0.5">{categoryName}</p>
          )}

          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {stretch.description}
          </p>

          {/* Tags */}
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

        {/* Chevron */}
        <span className={`text-gray-400 text-lg shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
          ›
        </span>
      </div>

      {/* ── 펼침 상세 ──────────────────────────────────────────── */}
      {expanded && (
        <div
          className="border-t border-gray-100 bg-gray-50 px-4 py-4 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 타겟 근육 */}
          <div className="mb-3">
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
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">단계별 방법</p>
            {stretch.detailedSteps ? (
              <ol className="space-y-3">
                {stretch.detailedSteps.map((s: StretchStep) => (
                  <li key={s.step} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {s.step}
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed flex-1">{s.description}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <ol className="space-y-2.5">
                {stretch.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Pexels 출처 링크 */}
          {stretch.photo_source_url && (
            <a
              href={stretch.photo_source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition"
              onClick={(e) => e.stopPropagation()}
            >
              사진 출처: {stretch.photo_source} ↗
            </a>
          )}

          <button
            onClick={() => setExpanded(false)}
            className="mt-3 block text-xs text-gray-400 hover:text-gray-600 transition"
          >
            접기 ↑
          </button>
        </div>
      )}
    </article>
  );
}
