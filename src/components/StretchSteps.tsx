'use client';

import { useState } from 'react';
import type { StretchStep } from '@/types';

interface StretchStepsProps {
  steps: string[];
  detailedSteps?: StretchStep[];
  stretchName: string;
}

/**
 * 단계별 스트레칭 방법 표시
 * - detailedSteps가 있으면 image + 설명 카드 형태
 * - 없으면 번호 목록 형태
 */
export default function StretchSteps({ steps, detailedSteps, stretchName }: StretchStepsProps) {
  const [activeStep, setActiveStep] = useState(0);

  if (detailedSteps && detailedSteps.length > 0) {
    return (
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
          단계별 동작 ({detailedSteps.length}단계)
        </p>

        {/* 스텝 탭 네비게이션 */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {detailedSteps.map((s, i) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(i)}
              className={`shrink-0 w-8 h-8 rounded-full text-xs font-bold transition-all ${
                activeStep === i
                  ? 'bg-green-500 text-white shadow-md scale-110'
                  : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }`}
            >
              {s.step}
            </button>
          ))}
        </div>

        {/* Active step card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Step image */}
          {detailedSteps[activeStep]?.image_url ? (
            <div className="relative w-full bg-gray-100" style={{ aspectRatio: '4/3' }}>
              <img
                src={detailedSteps[activeStep].image_url}
                alt={`${stretchName} Step ${detailedSteps[activeStep].step}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Step {detailedSteps[activeStep].step}
              </div>
            </div>
          ) : (
            /* 이미지 없을 때 번호 표시 */
            <div className="flex items-center justify-center h-20 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-black">
                {detailedSteps[activeStep]?.step}
              </div>
            </div>
          )}

          {/* Step description */}
          <div className="p-4">
            <p className="text-sm font-bold text-gray-500 mb-1.5">Step {detailedSteps[activeStep]?.step}</p>
            <p className="text-sm text-gray-800 leading-relaxed">
              {detailedSteps[activeStep]?.description}
            </p>
          </div>

          {/* Prev / Next */}
          <div className="flex border-t border-gray-100">
            <button
              onClick={() => setActiveStep((n) => Math.max(0, n - 1))}
              disabled={activeStep === 0}
              className="flex-1 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition border-r border-gray-100"
            >
              ← 이전
            </button>
            <button
              onClick={() => setActiveStep((n) => Math.min(detailedSteps.length - 1, n + 1))}
              disabled={activeStep === detailedSteps.length - 1}
              className="flex-1 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
            >
              다음 →
            </button>
          </div>
        </div>

        {/* All steps list (collapsed view) */}
        <details className="mt-3">
          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none">
            전체 단계 텍스트 보기
          </summary>
          <ol className="mt-2 space-y-2 pl-1">
            {detailedSteps.map((s) => (
              <li key={s.step} className="flex gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {s.step}
                </span>
                <span className="text-gray-600 leading-relaxed text-xs">{s.description}</span>
              </li>
            ))}
          </ol>
        </details>
      </div>
    );
  }

  // Simple steps list
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">단계별 방법</p>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-gray-700 leading-relaxed flex-1">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
