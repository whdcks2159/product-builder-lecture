'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const PRESETS = [20, 30, 60] as const;
type Preset = (typeof PRESETS)[number];

interface StretchTimerProps {
  defaultSeconds?: number;
  stretchName?: string;
  onComplete?: () => void;
}

function parseSeconds(n: number): Preset {
  if (n <= 20) return 20;
  if (n <= 30) return 30;
  return 60;
}

function playBeep(audioCtx: AudioContext) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.6);
}

export default function StretchTimer({ defaultSeconds = 30, stretchName, onComplete }: StretchTimerProps) {
  const initial = parseSeconds(defaultSeconds);
  const [selected, setSelected] = useState<Preset>(initial);
  const [timeLeft, setTimeLeft] = useState<number>(initial);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioRef.current;
  }, []);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(selected);
      setCompleted(false);
    }
  }, [selected, isRunning]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setCompleted(true);
            try { playBeep(getAudioCtx()); } catch {}
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, getAudioCtx, onComplete]);

  function handleStartPause() {
    if (completed) return;
    if (!isRunning) {
      try { getAudioCtx().resume(); } catch {}
    }
    setIsRunning((v) => !v);
  }

  function handleReset() {
    setIsRunning(false);
    setCompleted(false);
    setTimeLeft(selected);
  }

  const progress = timeLeft / selected;
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  const R = 52;
  const C = 2 * Math.PI * R;
  const dashOffset = C * (1 - progress);

  const ringColor = completed
    ? '#22c55e'
    : isRunning && timeLeft <= 5
    ? '#ef4444'
    : isRunning
    ? '#4ade80'
    : '#16a34a';

  return (
    <div
      className="bg-gray-900 rounded-2xl p-5 border border-gray-700 select-none w-full"
      onClick={(e) => e.stopPropagation()}
    >
      {stretchName && (
        <p className="text-center text-xs text-gray-400 font-medium mb-3 truncate">
          ⏱ {stretchName}
        </p>
      )}

      {/* 시간 프리셋 */}
      <div className="flex gap-2 justify-center mb-5">
        {PRESETS.map((t) => (
          <button
            key={t}
            onClick={() => { if (!isRunning) setSelected(t); }}
            disabled={isRunning}
            className={`flex-1 max-w-[72px] py-1.5 rounded-full text-sm font-bold transition-all ${
              selected === t
                ? 'bg-green-500 text-white shadow-lg shadow-green-900/40'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {t}초
          </button>
        ))}
      </div>

      {/* 원형 타이머 */}
      <div className="flex justify-center mb-5">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90 absolute inset-0">
            <circle cx="64" cy="64" r={R} fill="none" stroke="#374151" strokeWidth="8" />
            <circle
              cx="64" cy="64" r={R}
              fill="none"
              stroke={ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={dashOffset}
              style={{ transition: isRunning ? 'stroke-dashoffset 0.95s linear, stroke 0.3s' : 'stroke 0.3s' }}
            />
          </svg>
          <div className="relative z-10 text-center">
            {completed ? (
              <span className="text-4xl">🎉</span>
            ) : (
              <>
                <span className={`block text-3xl font-black tabular-nums tracking-tight ${
                  isRunning && timeLeft <= 5 ? 'text-red-400' : 'text-white'
                }`}>
                  {mins}:{secs}
                </span>
                {isRunning && (
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">진행 중</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 완료 메시지 */}
      {completed && (
        <div className="text-center mb-4">
          <p className="text-green-400 font-bold text-base">Stretch Complete! 🎉</p>
          <p className="text-gray-400 text-xs mt-0.5">수고하셨습니다!</p>
        </div>
      )}

      {/* 선형 진행바 */}
      <div className="w-full bg-gray-700 rounded-full h-1.5 mb-5 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: ringColor,
            transition: isRunning ? 'width 0.95s linear, background-color 0.3s' : 'background-color 0.3s',
          }}
        />
      </div>

      {/* 컨트롤 */}
      <div className="flex gap-2">
        <button
          onClick={handleStartPause}
          disabled={completed}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            completed
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-white'
              : 'bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-900/40'
          }`}
        >
          {isRunning ? '⏸ 일시정지' : '▶ 시작'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-700 hover:bg-gray-600 text-gray-300 transition-all active:scale-95"
        >
          ↺ 초기화
        </button>
      </div>

      {/* 완료 후 다음 버튼 */}
      {completed && onComplete && (
        <button
          onClick={onComplete}
          className="mt-3 w-full py-2.5 rounded-xl text-sm font-bold bg-green-600 hover:bg-green-500 text-white transition-all active:scale-95"
        >
          다음 스트레칭 →
        </button>
      )}
    </div>
  );
}
