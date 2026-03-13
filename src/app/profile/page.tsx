'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, profile, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [loading, user, router]);

  if (loading || !profile) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-gray-400 text-sm">로딩 중...</div></div>;
  }

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  const joinDate = profile.createdAt
    ? new Date((profile.createdAt as { seconds: number }).seconds * 1000).toLocaleDateString('ko-KR')
    : '정보 없음';

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">내 프로필</h1>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700">
            {profile.nickname[0].toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{profile.nickname}</p>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>
        <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
          <div className="flex justify-between"><span className="text-gray-400">가입일</span><span>{joinDate}</span></div>
        </div>
        <div className="flex gap-3 pt-2">
          <Link href="/community" className="flex-1 text-center bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-2 rounded-xl text-sm font-semibold transition">
            내 게시글 보기
          </Link>
          <button onClick={handleLogout} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-sm font-semibold transition">
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
