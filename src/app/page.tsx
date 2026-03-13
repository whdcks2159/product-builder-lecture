import type { Metadata } from 'next';
import Link from 'next/link';
import AdUnit from '@/components/AdUnit';
import CategoryCard from '@/components/CategoryCard';
import { exercises } from '@/data/exercises';
import { painAreas } from '@/data/pain-areas';
import { buildWebSiteJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'DailyStretch - 운동 전후 스트레칭 완전 정복',
  description:
    '러닝, 헬스, 등산, 골프 등 10가지 운동의 전후 스트레칭을 쉽고 빠르게 확인하세요. 통증 부위별 스트레칭과 허리 디스크 예방 가이드도 제공합니다.',
};

function getTodayStretch() {
  const allStretches = exercises.flatMap((ex) => ex.beforeStretches ?? []);
  const dayIndex = Math.floor(Date.now() / 86400000) % allStretches.length;
  return allStretches[dayIndex];
}

export default function HomePage() {
  const todayStretch = getTodayStretch();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebSiteJsonLd()) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-16 text-center">
        <div className="max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-green-500/15 text-green-400 border border-green-500/30 rounded-full text-xs font-semibold px-3 py-1.5 mb-5">
            🏃 운동 전후 스트레칭 가이드
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
            운동 효과는 높이고<br className="sm:hidden" /> 부상 위험은 낮추세요
          </h1>
          <p className="text-sm text-white/55 leading-relaxed mb-8">
            10가지 운동 카테고리 · 통증 부위별 스트레칭 · 허리 디스크 예방 전문 가이드
          </p>
          <Link
            href="#exercises"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-full text-sm transition-all hover:-translate-y-0.5"
          >
            카테고리 보기
          </Link>
        </div>
      </section>

      {/* ── Ad: Hero 아래 ─────────────────────────────────────────── */}
      <div className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <AdUnit slot="leaderboard" />
        </div>
      </div>

      {/* ── 오늘의 스트레칭 ───────────────────────────────────────── */}
      {todayStretch && (
        <section className="max-w-5xl mx-auto px-4 py-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">오늘의 스트레칭 🌟</h2>
            <p className="text-sm text-gray-500 mt-1">매일 바뀌는 추천 스트레칭을 확인해보세요</p>
          </div>
          <div className="rounded-2xl border-2 border-green-400/40 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-5 sm:p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-3xl shrink-0">
                {todayStretch.icon ?? '🤸'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-extrabold text-gray-900">{todayStretch.name}</h3>
                  {todayStretch.difficulty && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      todayStretch.difficulty === '쉬움' ? 'bg-green-100 text-green-700' :
                      todayStretch.difficulty === '보통' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {todayStretch.difficulty}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{todayStretch.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {todayStretch.muscles.slice(0, 4).map((m) => (
                    <span key={m} className="text-[10px] bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-500">
                      {m}
                    </span>
                  ))}
                  {todayStretch.holdTime && (
                    <span className="text-[10px] bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-semibold">
                      ⏱ {todayStretch.holdTime}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {todayStretch.photo_url && (
              <div className="mt-4 relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={todayStretch.photo_url}
                  alt={`${todayStretch.name} 스트레칭 자세`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            )}
            <div className="mt-4">
              <Link
                href="#exercises"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-lg transition-all"
              >
                자세히 보기 →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 운동 카테고리 ─────────────────────────────────────────── */}
      <section id="exercises" className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1.5">운동 카테고리</h2>
          <p className="text-sm text-gray-500">운동을 선택하면 전후 스트레칭을 바로 확인할 수 있습니다</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {exercises.map((ex) => (
            <CategoryCard key={ex.id} exercise={ex} />
          ))}
        </div>
      </section>

      {/* ── Ad: 중간 ──────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">
        <AdUnit slot="rectangle" />
      </div>

      {/* ── 허리 디스크 특별 섹션 ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <Link
          href="/back-pain"
          className="group block rounded-2xl overflow-hidden border border-rose-500/20 hover:border-rose-500/40 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)' }}
        >
          <div className="p-6 sm:p-8 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
            <div>
              <span className="inline-block bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold px-3 py-1 mb-3">
                전문 가이드
              </span>
              <h2 className="text-xl font-extrabold text-white mb-2">🦴 허리 디스크 예방 · 완화 스트레칭</h2>
              <p className="text-sm text-white/50 mb-4">
                통증 완화 스트레칭 4가지 + 코어 강화 운동 5가지 + 운동 시 주의사항 포함
              </p>
              <div className="flex flex-wrap gap-2">
                {['✅ 통증 완화 4종', '💪 코어 강화 5종', '⚠️ 주의사항'].map((s) => (
                  <span key={s} className="text-xs text-white/50 bg-white/8 border border-white/10 rounded-full px-3 py-1">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-white/30 text-4xl group-hover:text-white/60 transition shrink-0">→</span>
          </div>
        </Link>
      </section>

      {/* ── 통증 부위별 ──────────────────────────────────────────── */}
      <section id="pain" className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1.5">통증 부위별 스트레칭</h2>
            <p className="text-sm text-gray-500">아픈 부위를 선택하면 맞춤 스트레칭을 안내합니다</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {painAreas.map((pain) => (
              <Link
                key={pain.id}
                href={`/pain/${pain.slug}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-md transition-all hover:-translate-y-0.5 text-center"
              >
                <div className="text-3xl mb-2">{pain.icon}</div>
                <p className="text-sm font-bold text-gray-900">{pain.name}</p>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{pain.description.slice(0, 35)}…</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 서비스 소개 ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '⏱️', title: '운동 전 5~10분', desc: '준비운동으로 근육 온도를 높이고 관절 가동 범위를 확보하여 부상 위험을 낮춥니다.' },
            { icon: '🔁', title: '운동 후 10~15분', desc: '쿨다운 스트레칭으로 근육 긴장을 이완하고 젖산을 제거하여 회복 속도를 높입니다.' },
            { icon: '🎯', title: '타겟 근육 중심', desc: '각 운동에 사용되는 주요 근육군을 중심으로 효율적인 스트레칭을 안내합니다.' },
          ].map((item) => (
            <div key={item.title} className="flex sm:flex-col items-start gap-4 sm:gap-2">
              <span className="text-3xl shrink-0">{item.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ad: 하단 ──────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <AdUnit slot="leaderboard" />
        </div>
      </div>
    </>
  );
}
