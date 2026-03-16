import type { Metadata } from 'next';
import Link from 'next/link';
import { challenges } from '@/data/challenges';
import AdUnit from '@/components/AdUnit';

export const metadata: Metadata = {
  title: '스트레칭 챌린지 - 매일 꾸준히 | DailyStretch',
  description: '7일, 14일, 30일 스트레칭 챌린지로 건강한 스트레칭 습관을 만들어 보세요.',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  '쉬움': 'bg-green-100 text-green-700',
  '보통': 'bg-amber-100 text-amber-700',
  '어려움': 'bg-red-100 text-red-700',
};

export default function ChallengePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-green-600 transition mb-6">
        ← 홈
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1.5">🏆 스트레칭 챌린지</h1>
        <p className="text-sm text-gray-500">매일 꾸준한 스트레칭으로 몸의 변화를 경험해보세요</p>
      </div>

      <AdUnit slot="banner" />

      <div className="space-y-4 mt-6">
        {challenges.map((challenge) => (
          <Link
            key={challenge.id}
            href={`/challenge/${challenge.slug}`}
            className="block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="h-2" style={{ background: challenge.gradient }} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{challenge.icon}</span>
                  <div>
                    <h2 className="font-extrabold text-gray-900 text-base">{challenge.title}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{challenge.subtitle}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-2xl font-black text-gray-200">{challenge.totalDays}일</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_COLOR[challenge.difficulty]}`}>
                    {challenge.difficulty}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{challenge.goal}</p>

              <div className="flex flex-wrap gap-1.5">
                {challenge.benefits.slice(0, 4).map((b) => (
                  <span key={b} className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                    ✓ {b}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {challenge.days[0]?.duration} · {challenge.totalDays}일 과정
                </span>
                <span className="text-sm font-bold text-green-600">시작하기 →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <AdUnit slot="rectangle" />
      </div>
    </div>
  );
}
