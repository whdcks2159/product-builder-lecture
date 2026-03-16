'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { exercises } from '@/data/exercises';
import type { Stretch } from '@/types';
import AdUnit from '@/components/AdUnit';

// ── 루틴 생성 로직 ────────────────────────────────────────────
const DURATION_COUNTS: Record<string, number> = { '3분': 3, '5분': 5, '10분': 10 };
const HOLD_SECONDS = 30;

function generateRoutine(exerciseId: string, purpose: string, duration: string): Stretch[] {
  const ex = exercises.find((e) => e.id === exerciseId);
  if (!ex) return [];

  let pool: Stretch[] = [];
  if (purpose === 'before') pool = ex.beforeStretches ?? [];
  else if (purpose === 'after') pool = ex.afterStretches ?? [];
  else if (purpose === 'injury') pool = [...(ex.beforeStretches ?? []), ...(ex.afterStretches ?? [])].filter((s) => s.difficulty !== '어려움');
  else pool = [...(ex.afterStretches ?? []), ...(ex.beforeStretches ?? [])]; // rehab

  const count = DURATION_COUNTS[duration] ?? 5;
  return pool.slice(0, count);
}

// ── 루틴 타이머 컴포넌트 ────────────────────────────────────
function RoutineTimer({ stretches, onClose }: { stretches: Stretch[]; onClose: () => void }) {
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(HOLD_SECONDS);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const beep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(); osc.stop(ctx.currentTime + 0.5);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          beep();
          setCurrent((c) => {
            if (c + 1 >= stretches.length) {
              stop();
              setRunning(false);
              setFinished(true);
              return c;
            }
            return c + 1;
          });
          return HOLD_SECONDS;
        }
        return t - 1;
      });
    }, 1000);
    return () => stop();
  }, [running, stretches.length, beep, stop]);

  const stretch = stretches[current];
  const progress = ((HOLD_SECONDS - timeLeft) / HOLD_SECONDS) * 100;
  const totalProgress = ((current + (HOLD_SECONDS - timeLeft) / HOLD_SECONDS) / stretches.length) * 100;

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">루틴 완료!</h2>
          <p className="text-gray-500 mb-6">{stretches.length}개 스트레칭을 모두 완료했습니다</p>
          <div className="flex gap-3">
            <button onClick={() => { setCurrent(0); setTimeLeft(HOLD_SECONDS); setFinished(false); setRunning(false); }} className="flex-1 bg-green-100 text-green-700 font-bold py-3 rounded-xl hover:bg-green-200 transition">
              다시 하기
            </button>
            <button onClick={onClose} className="flex-1 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-700 transition">
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <button onClick={onClose} className="text-gray-400 hover:text-white transition text-sm">✕ 닫기</button>
        <span className="text-white text-sm font-semibold">{current + 1} / {stretches.length}</span>
        <span className="text-gray-400 text-xs">{Math.round(totalProgress)}% 완료</span>
      </div>

      {/* Total Progress */}
      <div className="h-1 bg-white/10">
        <div className="h-1 bg-green-500 transition-all duration-300" style={{ width: `${totalProgress}%` }} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">
        {/* Stretch icon */}
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-5xl">
          {stretch.icon ?? '🤸'}
        </div>

        {/* Name */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-white mb-1">{stretch.name}</h2>
          <p className="text-white/50 text-sm">{stretch.muscles.slice(0, 3).join(' · ')}</p>
        </div>

        {/* Circular timer */}
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke={timeLeft <= 5 ? '#ef4444' : '#22c55e'}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>{timeLeft}</span>
            <span className="text-white/40 text-xs">초</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {current > 0 && (
            <button onClick={() => { setCurrent((c) => c - 1); setTimeLeft(HOLD_SECONDS); }} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
              ⏮
            </button>
          )}
          <button
            onClick={() => setRunning((r) => !r)}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-white text-2xl transition shadow-lg"
          >
            {running ? '⏸' : '▶'}
          </button>
          {current < stretches.length - 1 && (
            <button onClick={() => { setCurrent((c) => c + 1); setTimeLeft(HOLD_SECONDS); }} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
              ⏭
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-white/40 text-sm text-center max-w-xs leading-relaxed">
          {stretch.description.slice(0, 80)}...
        </p>
      </div>

      {/* Next stretch preview */}
      {current + 1 < stretches.length && (
        <div className="px-4 py-3 border-t border-white/10 flex items-center gap-3">
          <span className="text-white/30 text-xs">다음</span>
          <span className="text-lg">{stretches[current + 1].icon ?? '🤸'}</span>
          <span className="text-white/60 text-sm font-medium">{stretches[current + 1].name}</span>
        </div>
      )}
    </div>
  );
}

// ── 루틴 저장 & 불러오기 (localStorage) ────────────────────
interface SavedRoutine {
  id: string;
  name: string;
  exerciseId: string;
  purpose: string;
  duration: string;
  stretches: Stretch[];
  savedAt: number;
}

function useSavedRoutines() {
  const [saved, setSaved] = useState<SavedRoutine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('daily-stretch-routines');
      if (raw) setSaved(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  function save(routine: SavedRoutine) {
    const next = [routine, ...saved.filter((r) => r.id !== routine.id)].slice(0, 10);
    setSaved(next);
    localStorage.setItem('daily-stretch-routines', JSON.stringify(next));
  }

  function remove(id: string) {
    const next = saved.filter((r) => r.id !== id);
    setSaved(next);
    localStorage.setItem('daily-stretch-routines', JSON.stringify(next));
  }

  return { saved, save, remove };
}

const PURPOSE_LABELS: Record<string, string> = {
  before: '운동 전',
  after: '운동 후',
  injury: '부상 방지',
  rehab: '재활',
};

// ── Main Page ──────────────────────────────────────────────
export default function RoutinePage() {
  const [exerciseId, setExerciseId] = useState('running');
  const [purpose, setPurpose] = useState('before');
  const [duration, setDuration] = useState('5분');
  const [routine, setRoutine] = useState<Stretch[] | null>(null);
  const [timerOpen, setTimerOpen] = useState(false);
  const { saved, save, remove } = useSavedRoutines();

  function handleGenerate() {
    setRoutine(generateRoutine(exerciseId, purpose, duration));
  }

  function handleSave() {
    if (!routine) return;
    const ex = exercises.find((e) => e.id === exerciseId);
    const name = `${ex?.name ?? ''} ${PURPOSE_LABELS[purpose]} ${duration}`;
    save({
      id: `${exerciseId}-${purpose}-${duration}-${Date.now()}`,
      name,
      exerciseId,
      purpose,
      duration,
      stretches: routine,
      savedAt: Date.now(),
    });
  }

  const ex = exercises.find((e) => e.id === exerciseId);

  return (
    <>
      {timerOpen && routine && (
        <RoutineTimer stretches={routine} onClose={() => setTimerOpen(false)} />
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-green-600 transition mb-6">
          ← 홈
        </Link>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">루틴 생성기</h1>
        <p className="text-sm text-gray-500 mb-8">조건을 선택하면 맞춤 스트레칭 루틴을 만들어 드립니다</p>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-5">루틴 조건 설정</h2>

          {/* Exercise */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">운동 종류</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {exercises.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setExerciseId(e.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-sm transition-all ${
                    exerciseId === e.id
                      ? 'border-green-500 bg-green-50 text-green-700 font-bold'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{e.icon}</span>
                  <span className="text-[11px]">{e.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Purpose */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">목적</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'before', label: '운동 전', icon: '🔥', desc: '준비운동' },
                { id: 'after', label: '운동 후', icon: '❄️', desc: '쿨다운' },
                { id: 'injury', label: '부상 방지', icon: '🛡️', desc: '예방' },
                { id: 'rehab', label: '재활', icon: '💊', desc: '회복' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPurpose(p.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-sm transition-all ${
                    purpose === p.id
                      ? 'border-green-500 bg-green-50 text-green-700 font-bold'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{p.icon}</span>
                  <span className="text-xs font-semibold">{p.label}</span>
                  <span className="text-[10px] text-gray-400">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-2">운동 시간</label>
            <div className="flex gap-3">
              {['3분', '5분', '10분'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                    duration === d
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-base transition-all hover:-translate-y-0.5 shadow-lg"
          >
            루틴 생성하기 ✨
          </button>
        </div>

        {/* Ad */}
        <AdUnit slot="rectangle" />

        {/* Generated Routine */}
        {routine && (
          <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-sm mb-8 mt-6">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  {ex?.icon} {ex?.name} {PURPOSE_LABELS[purpose]} {duration} 루틴
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">{routine.length}개 스트레칭 · 각 30초 유지</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition"
                >
                  💾 저장
                </button>
                <button
                  onClick={() => setTimerOpen(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl transition"
                >
                  ▶ 바로 실행
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {routine.map((stretch, i) => (
                <div key={stretch.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-xl shrink-0">{stretch.icon ?? '🤸'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{stretch.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-gray-400">{stretch.muscles.slice(0, 2).join(' · ')}</span>
                      <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">⏱ 30초</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
              <span>💡</span>
              <span>총 {routine.length * 30}초 ({Math.round(routine.length * 30 / 60)}분 {routine.length * 30 % 60 > 0 ? `${routine.length * 30 % 60}초` : ''})</span>
            </div>
          </div>
        )}

        {/* Saved Routines */}
        {saved.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">저장된 루틴</h2>
            <div className="space-y-2">
              {saved.map((sr) => (
                <div key={sr.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{sr.name}</p>
                    <p className="text-xs text-gray-400">{sr.stretches.length}개 · {sr.duration}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { setRoutine(sr.stretches); setExerciseId(sr.exerciseId); setPurpose(sr.purpose); setDuration(sr.duration); }}
                      className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition"
                    >
                      불러오기
                    </button>
                    <button
                      onClick={() => { setRoutine(sr.stretches); setTimerOpen(true); }}
                      className="px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-700 transition"
                    >
                      ▶
                    </button>
                    <button
                      onClick={() => remove(sr.id)}
                      className="px-3 py-1.5 bg-red-50 text-red-400 text-xs font-bold rounded-lg hover:bg-red-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
