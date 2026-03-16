import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getChallengeBySlug, getAllChallengeSlugs } from '@/data/challenges';
import ChallengeTracker from '@/components/ChallengeTracker';
import AdUnit from '@/components/AdUnit';

export function generateStaticParams() {
  return getAllChallengeSlugs();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const ch = getChallengeBySlug(params.slug);
  if (!ch) return {};
  return {
    title: `${ch.title} | DailyStretch`,
    description: ch.goal,
  };
}

const DIFFICULTY_COLOR: Record<string, string> = {
  '쉬움': 'bg-green-100 text-green-700',
  '보통': 'bg-amber-100 text-amber-700',
  '어려움': 'bg-red-100 text-red-700',
};

export default function ChallengeDetailPage({ params }: { params: { slug: string } }) {
  const ch = getChallengeBySlug(params.slug);
  if (!ch) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/challenge" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-green-600 transition mb-6">
        ← 챌린지 목록
      </Link>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 mb-6 text-white"
        style={{ background: ch.gradient }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{ch.icon}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-extrabold">{ch.title}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white`}>
                {ch.difficulty}
              </span>
            </div>
            <p className="text-white/70 text-sm">{ch.subtitle}</p>
          </div>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">{ch.goal}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {ch.benefits.map((b) => (
            <span key={b} className="text-xs bg-white/15 text-white px-2.5 py-1 rounded-full">
              ✓ {b}
            </span>
          ))}
        </div>
      </div>

      <AdUnit slot="banner" />

      {/* Interactive tracker */}
      <ChallengeTracker challenge={ch} />

      <div className="mt-8">
        <AdUnit slot="rectangle" />
      </div>
    </div>
  );
}
