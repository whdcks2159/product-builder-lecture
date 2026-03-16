'use client';

import { useState, useEffect } from 'react';
import type { Challenge } from '@/data/challenges';

interface Props {
  challenge: Challenge;
}

export default function ChallengeTracker({ challenge }: Props) {
  const storageKey = `challenge-${challenge.id}`;
  const [completed, setCompleted] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCompleted(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoaded(true);
  }, [storageKey]);

  function toggle(day: number) {
    const next = completed.includes(day)
      ? completed.filter((d) => d !== day)
      : [...completed, day];
    setCompleted(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function reset() {
    setCompleted([]);
    localStorage.removeItem(storageKey);
  }

  if (!loaded) return <div className="text-center py-8 text-gray-400">불러오는 중...</div>;

  const percent = Math.round((completed.length / challenge.totalDays) * 100);
  const currentDay = completed.length + 1;

  return (
    <div>
      {/* Progress */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-gray-700">진행률</p>
            <p className="text-xs text-gray-400">{completed.length}일 / {challenge.totalDays}일 완료</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-green-500">{percent}%</span>
          </div>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, background: challenge.gradient }}
          />
        </div>
        {completed.length === challenge.totalDays && (
          <div className="mt-3 text-center py-3 bg-green-50 rounded-xl">
            <p className="text-sm font-bold text-green-700">🎉 챌린지 완료! 대단합니다!</p>
          </div>
        )}
      </div>

      {/* Day grid - compact for long challenges */}
      {challenge.totalDays <= 14 ? (
        /* Full view for short challenges */
        <div className="space-y-3 mb-5">
          {challenge.days.map((day) => {
            const isDone = completed.includes(day.day);
            const isCurrent = day.day === currentDay && !isDone;
            return (
              <div
                key={day.day}
                className={`rounded-xl border-2 p-4 transition-all ${
                  isDone
                    ? 'border-green-300 bg-green-50'
                    : isCurrent
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      isDone ? 'bg-green-500 text-white' : isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isDone ? '✓' : day.day}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isDone ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-700'}`}>
                        {day.title}
                      </p>
                      <p className="text-xs text-gray-400">{day.stretches.join(' · ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">{day.duration}</span>
                    <button
                      onClick={() => toggle(day.day)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
                        isDone
                          ? 'border-green-500 bg-green-500 text-white hover:bg-red-100 hover:border-red-300 hover:text-red-500'
                          : 'border-gray-300 bg-white text-gray-400 hover:border-green-400 hover:bg-green-50'
                      }`}
                    >
                      {isDone ? '✓' : '○'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid view for long challenges */
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">일별 체크</h3>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['월', '화', '수', '목', '금', '토', '일'].map((d) => (
              <div key={d} className="text-center text-[10px] text-gray-400 font-semibold">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {challenge.days.map((day) => {
              const isDone = completed.includes(day.day);
              const isCurrent = day.day === currentDay && !isDone;
              return (
                <button
                  key={day.day}
                  onClick={() => toggle(day.day)}
                  title={`Day ${day.day}: ${day.title}`}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all hover:scale-110 ${
                    isDone
                      ? 'bg-green-500 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <span>{day.day}</span>
                  {isDone && <span className="text-[8px]">✓</span>}
                </button>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-green-500" /><span>완료</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-200 border border-blue-400" /><span>오늘</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-gray-200" /><span>미완료</span></div>
          </div>
        </div>
      )}

      {/* Today's detail (if in short mode) */}
      {challenge.totalDays > 14 && currentDay <= challenge.totalDays && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-5">
          <p className="text-xs font-bold text-blue-600 mb-1">오늘의 챌린지 (Day {currentDay})</p>
          <p className="text-sm font-bold text-gray-900">{challenge.days[currentDay - 1]?.title}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {challenge.days[currentDay - 1]?.stretches.map((s) => (
              <span key={s} className="text-[11px] bg-white border border-blue-200 text-blue-600 px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
          <button
            onClick={() => toggle(currentDay)}
            className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm transition"
          >
            오늘 완료 체크 ✓
          </button>
        </div>
      )}

      {/* Reset */}
      {completed.length > 0 && (
        <div className="text-center">
          <button
            onClick={reset}
            className="text-xs text-gray-400 hover:text-red-400 transition underline"
          >
            진행 초기화
          </button>
        </div>
      )}
    </div>
  );
}
