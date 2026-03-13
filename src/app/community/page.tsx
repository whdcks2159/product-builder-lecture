import Link from 'next/link';
import { COMMUNITY_CATEGORIES } from '@/types/community';

export const metadata = {
  title: '커뮤니티 | DailyStretch',
  description: '스트레칭과 운동에 관해 이야기하는 DailyStretch 커뮤니티',
};

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">커뮤니티</h1>
        <p className="text-sm text-gray-500">스트레칭과 운동에 대해 이야기해보세요</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {COMMUNITY_CATEGORIES.map(cat => (
          <Link
            key={cat.id}
            href={`/community/${cat.id}`}
            className="flex items-center gap-4 bg-white border border-gray-200 hover:border-green-400 rounded-2xl p-5 transition group"
          >
            <span className="text-3xl">{cat.icon}</span>
            <div>
              <p className="font-bold text-gray-900 group-hover:text-green-700 transition">{cat.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">게시글 보기 →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
