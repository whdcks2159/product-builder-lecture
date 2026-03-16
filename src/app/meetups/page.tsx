'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  collection, query, orderBy, limit, onSnapshot,
  where, getDocs, QueryConstraint,
} from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Meetup } from '@/types/meetup';
import { MEETUP_CATEGORIES, MEETUP_REGIONS } from '@/types/meetup';
import AdUnit from '@/components/AdUnit';

// ── Helpers ───────────────────────────────────────────────────────────
function statusBadge(m: Meetup) {
  if (m.status === 'full') return <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">마감</span>;
  if (m.status === 'closed') return <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">종료</span>;
  const ratio = m.memberCount / m.maxMembers;
  if (ratio >= 0.8) return <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">마감 임박</span>;
  return <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full">모집 중</span>;
}

function formatDate(dateStr: string, timeStr: string) {
  const d = new Date(`${dateStr}T${timeStr}`);
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }) + ' ' + timeStr;
}

function getCatIcon(catId: string) {
  return MEETUP_CATEGORIES.find((c) => c.id === catId)?.icon ?? '🏃';
}

// ── Meetup Card ───────────────────────────────────────────────────────
function MeetupCard({ meetup }: { meetup: Meetup }) {
  const pct = Math.round((meetup.memberCount / meetup.maxMembers) * 100);
  return (
    <Link
      href={`/meetups/${meetup.id}`}
      className="block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCatIcon(meetup.category)}</span>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 leading-snug">{meetup.title}</h3>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="text-[11px] text-gray-400">{meetup.categoryLabel}</span>
                <span className="text-gray-300">·</span>
                <span className="text-[11px] text-gray-400">📍 {meetup.regionLabel}</span>
              </div>
            </div>
          </div>
          {statusBadge(meetup)}
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{meetup.description}</p>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <span>📅</span>
          <span>{formatDate(meetup.date, meetup.time)}</span>
        </div>

        {/* Progress bar */}
        <div className="mb-1 flex items-center justify-between text-[11px] text-gray-500">
          <span>참여 인원</span>
          <span className="font-bold text-gray-700">{meetup.memberCount} / {meetup.maxMembers}명</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all ${pct >= 100 ? 'bg-red-400' : pct >= 80 ? 'bg-amber-400' : 'bg-green-500'}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">by {meetup.createdByNickname}</span>
        <span className={`text-xs font-bold ${meetup.status === 'open' ? 'text-green-600' : 'text-gray-400'}`}>
          {meetup.status === 'open' ? '참여하기 →' : meetup.status === 'full' ? '모집 마감' : '종료됨'}
        </span>
      </div>
    </Link>
  );
}

// ── Main List ─────────────────────────────────────────────────────────
function MeetupsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth();

  const regionFilter = params.get('region') ?? '';
  const catFilter = params.get('cat') ?? '';

  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [popular, setPopular] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);

  // Load popular meetups (most members)
  useEffect(() => {
    getDocs(
      query(collection(getFirebaseDb(), 'meetups'), orderBy('memberCount', 'desc'), limit(3))
    ).then((snap) => {
      setPopular(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Meetup));
    }).catch(() => {});
  }, []);

  // Load filtered meetups
  useEffect(() => {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(30)];
    if (regionFilter) constraints.unshift(where('region', '==', regionFilter));
    if (catFilter) constraints.unshift(where('category', '==', catFilter));

    const unsub = onSnapshot(
      query(collection(getFirebaseDb(), 'meetups'), ...constraints),
      (snap) => {
        setMeetups(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Meetup));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [regionFilter, catFilter]);

  function setFilter(key: string, val: string) {
    const p = new URLSearchParams(params.toString());
    if (val) p.set(key, val);
    else p.delete(key);
    router.push(`/meetups?${p.toString()}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">🏃 운동 모임</h1>
          <p className="text-sm text-gray-500 mt-1">함께 운동하고 스트레칭할 모임을 찾아보세요</p>
        </div>
        {user ? (
          <Link
            href="/meetups/create"
            className="shrink-0 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition"
          >
            + 모임 만들기
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-sm transition"
          >
            로그인 후 만들기
          </Link>
        )}
      </div>

      <AdUnit slot="banner" />

      {/* Popular meetups */}
      {popular.length > 0 && !regionFilter && !catFilter && (
        <div className="mb-6 mt-4">
          <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            🔥 인기 모임
          </h2>
          <div className="space-y-2">
            {popular.map((m, i) => (
              <Link
                key={m.id}
                href={`/meetups/${m.id}`}
                className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 rounded-xl px-4 py-3 hover:shadow-sm transition-all"
              >
                <span className="text-sm font-black text-orange-400 w-5">#{i + 1}</span>
                <span className="text-xl">{getCatIcon(m.category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{m.title}</p>
                  <p className="text-[11px] text-gray-400">{m.regionLabel} · 참여 {m.memberCount}명</p>
                </div>
                <span className="text-xs text-gray-300">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-3 mb-6">
        {/* Region filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setFilter('region', '')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition ${!regionFilter ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            전체 지역
          </button>
          {MEETUP_REGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setFilter('region', r.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition ${regionFilter === r.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setFilter('cat', '')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition ${!catFilter ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            전체 종목
          </button>
          {MEETUP_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter('cat', c.id)}
              className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition ${catFilter === c.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">불러오는 중...</div>
      ) : meetups.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🏃</div>
          <p className="text-gray-500 font-semibold mb-2">아직 모임이 없습니다</p>
          <p className="text-gray-400 text-sm mb-6">첫 번째 운동 모임을 만들어보세요!</p>
          {user && (
            <Link href="/meetups/create" className="inline-block bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition">
              모임 만들기
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">{meetups.length}개 모임</p>
          {meetups.map((m) => <MeetupCard key={m.id} meetup={m} />)}
        </div>
      )}

      <div className="mt-8">
        <AdUnit slot="rectangle" />
      </div>
    </div>
  );
}

export default function MeetupsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">불러오는 중...</div>}>
      <MeetupsContent />
    </Suspense>
  );
}
