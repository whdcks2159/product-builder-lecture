'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { MEETUP_CATEGORIES, MEETUP_REGIONS } from '@/types/meetup';

interface FormState {
  title: string;
  category: string;
  region: string;
  date: string;
  time: string;
  maxMembers: string;
  description: string;
}

const INIT: FormState = {
  title: '',
  category: 'running',
  region: 'seoul',
  date: '',
  time: '08:00',
  maxMembers: '10',
  description: '',
};

export default function CreateMeetupPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [form, setForm] = useState<FormState>(INIT);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login?next=/meetups/create');
  }, [loading, user, router]);

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setForm((f) => ({ ...f, date: tomorrow.toISOString().split('T')[0] }));
  }, []);

  function set(key: keyof FormState, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!form.title.trim()) { setError('모임 이름을 입력해주세요.'); return; }
    if (!form.description.trim()) { setError('모임 설명을 입력해주세요.'); return; }
    const maxN = parseInt(form.maxMembers, 10);
    if (isNaN(maxN) || maxN < 2 || maxN > 100) { setError('모집 인원은 2~100명으로 입력해주세요.'); return; }

    const cat = MEETUP_CATEGORIES.find((c) => c.id === form.category);
    const reg = MEETUP_REGIONS.find((r) => r.id === form.region);
    const nickname = profile?.nickname ?? user.displayName ?? '익명';

    setSubmitting(true);
    try {
      const ref = await addDoc(collection(getFirebaseDb(), 'meetups'), {
        title: form.title.trim(),
        category: form.category,
        categoryLabel: cat?.label ?? form.category,
        region: form.region,
        regionLabel: reg?.label ?? form.region,
        date: form.date,
        time: form.time,
        maxMembers: maxN,
        memberCount: 1,
        postCount: 0,
        description: form.description.trim(),
        createdBy: user.uid,
        createdByNickname: nickname,
        createdAt: serverTimestamp(),
        status: 'open',
      });

      // Add creator as first member
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(getFirebaseDb(), 'meetups', ref.id, 'members', user.uid), {
        userId: user.uid,
        nickname,
        joinedAt: serverTimestamp(),
      });

      router.push(`/meetups/${ref.id}`);
    } catch (err) {
      console.error(err);
      setError('모임 생성에 실패했습니다. 다시 시도해주세요.');
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center text-gray-400 text-sm">로딩 중...</div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/meetups" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-green-600 transition mb-6">
        ← 모임 목록
      </Link>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">운동 모임 만들기</h1>
      <p className="text-sm text-gray-500 mb-8">새로운 운동 모임을 만들고 함께할 멤버를 모집하세요</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
            모임 이름 <span className="text-red-400">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="예: 토요일 아침 한강 러닝 모임"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">운동 종류</label>
          <div className="grid grid-cols-5 gap-2">
            {MEETUP_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => set('category', c.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition ${
                  form.category === c.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{c.icon}</span>
                <span className="text-[10px] font-semibold">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">지역</label>
          <div className="grid grid-cols-5 gap-2">
            {MEETUP_REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => set('region', r.id)}
                className={`py-2 rounded-xl border-2 text-xs font-bold transition ${
                  form.region === r.id
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              모임 날짜 <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">모임 시간</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => set('time', e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
            />
          </div>
        </div>

        {/* Max members */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
            모집 인원 <span className="text-gray-400 text-xs font-normal">(2~100명)</span>
          </label>
          <div className="flex items-center gap-3">
            {[5, 10, 15, 20, 30].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => set('maxMembers', String(n))}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-bold transition ${
                  form.maxMembers === String(n)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {n}명
              </button>
            ))}
            <input
              type="number"
              value={form.maxMembers}
              onChange={(e) => set('maxMembers', e.target.value)}
              min={2} max={100}
              className="w-20 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500 text-center"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
            모임 설명 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={5}
            placeholder="모임 소개, 참여 방법, 준비물 등을 알려주세요&#10;예: 초보 러너 환영합니다. 함께 러닝 후 스트레칭도 합니다."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 resize-y transition"
            required
          />
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-300">
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">미리보기</p>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{MEETUP_CATEGORIES.find((c) => c.id === form.category)?.icon ?? '🏃'}</span>
            <p className="text-sm font-bold text-gray-900">{form.title || '모임 이름'}</p>
          </div>
          <p className="text-xs text-gray-400">
            {MEETUP_CATEGORIES.find((c) => c.id === form.category)?.label} ·{' '}
            {MEETUP_REGIONS.find((r) => r.id === form.region)?.label} ·{' '}
            {form.date} {form.time} · 최대 {form.maxMembers}명
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl text-sm transition"
          >
            {submitting ? '모임 생성 중...' : '모임 만들기 🎉'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl text-sm transition"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
