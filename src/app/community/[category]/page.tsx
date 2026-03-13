'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { COMMUNITY_CATEGORIES, type Post } from '@/types/community';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const catInfo = COMMUNITY_CATEGORIES.find(c => c.id === category);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(
          collection(getFirebaseDb(), 'posts'),
          where('category', '==', category),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        const snap = await getDocs(q);
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [category]);

  function formatDate(ts: Post['createdAt']) {
    if (!ts) return '';
    return new Date(ts.seconds * 1000).toLocaleDateString('ko-KR');
  }

  if (!catInfo) return <div className="p-10 text-center text-gray-400">존재하지 않는 카테고리입니다.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1">
        <Link href="/community" className="hover:text-green-600">커뮤니티</Link>
        <span>›</span>
        <span className="text-gray-700">{catInfo.icon} {catInfo.name}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">{catInfo.icon} {catInfo.name}</h1>
        <button
          onClick={() => user ? router.push(`/community/write?cat=${category}`) : router.push('/auth/login')}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition"
        >
          글 작성
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">로딩 중...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          <p className="text-2xl mb-2">📝</p>
          <p>아직 게시글이 없습니다. 첫 글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/community/${category}/${post.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{post.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {post.nickname} · {formatDate(post.createdAt)}
                </p>
              </div>
              <div className="text-xs text-gray-400 shrink-0">👁 {post.viewCount ?? 0}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
