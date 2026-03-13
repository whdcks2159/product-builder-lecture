'use client';

import { useState, useEffect, useRef } from 'react';

const PRESETS = [20, 30, 60] as const;
type Preset = (typeof PRESETS)[number];

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function StretchTimer() {
  const [selectedTime, setSelectedTime] = useState<Preset>(30);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync timeLeft when selectedTime changes (and not running)
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(selectedTime);
      setCompleted(false);
    }
  }, [selectedTime, isRunning]);

  // Countdown
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  function handleStartPause() {
    if (completed) return;
    setIsRunning((v) => !v);
  }

  function handleReset() {
    setIsRunning(false);
    setCompleted(false);
    setTimeLeft(selectedTime);
  }

  const progress = timeLeft / selectedTime;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div
      className="bg-gray-800 rounded-xl p-4 border border-gray-700 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Preset buttons */}
      <div className="flex gap-2 mb-4 justify-center">
        {PRESETS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setSelectedTime(t);
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedTime === t
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {t}초
          </button>
        ))}
      </div>

      {/* Circular progress */}
      <div className="flex justify-center mb-4">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
            className="-rotate-90 absolute inset-0"
          >
            {/* Track */}
            <circle
              cx="48"
              cy="48"
              r={RADIUS}
              fill="none"
              stroke="#374151"
              strokeWidth="6"
            />
            {/* Progress */}
            <circle
              cx="48"
              cy="48"
              r={RADIUS}
              fill="none"
              stroke={completed ? '#22c55e' : isRunning ? '#4ade80' : '#16a34a'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.9s linear' }}
            />
          </svg>
          {/* Center text */}
          <div className="relative z-10 text-center">
            {completed ? (
              <span className="text-2xl">✅</span>
            ) : (
              <span className={`text-2xl font-bold ${isRunning ? 'text-green-400' : 'text-gray-100'}`}>
                {timeLeft}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Completion message */}
      {completed && (
        <p className="text-center text-green-400 text-xs font-semibold mb-3">
          완료! 수고하셨습니다 🎉
        </p>
      )}

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={handleStartPause}
          disabled={completed}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            completed
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isRunning ? '일시정지' : '시작'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gray-700 hover:bg-gray-600 text-gray-300 transition-all"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
