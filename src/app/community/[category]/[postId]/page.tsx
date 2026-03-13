'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  doc, getDoc, updateDoc, deleteDoc, increment,
  collection, query, where, orderBy, getDocs, addDoc, serverTimestamp
} from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { COMMUNITY_CATEGORIES, type Post, type Comment } from '@/types/community';

export default function PostDetailPage() {
  const { category, postId } = useParams<{ category: string; postId: string }>();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const catInfo = COMMUNITY_CATEGORIES.find(c => c.id === category);

  useEffect(() => {
    async function fetchPost() {
      const ref = doc(getFirebaseDb(), 'posts', postId);
      const snap = await getDoc(ref);
      if (!snap.exists()) { router.push(`/community/${category}`); return; }
      const data = { id: snap.id, ...snap.data() } as Post;
      setPost(data);
      await updateDoc(ref, { viewCount: increment(1) });

      const cq = query(collection(getFirebaseDb(), 'comments'), where('postId', '==', postId), orderBy('createdAt', 'asc'));
      const cSnap = await getDocs(cq);
      setComments(cSnap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)));
      setLoading(false);
    }
    fetchPost();
  }, [postId, category, router]);

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile || !commentText.trim()) return;
    setSubmitting(true);
    const newComment = {
      postId,
      userId: user.uid,
      nickname: profile.nickname,
      text: commentText.trim(),
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(getFirebaseDb(), 'comments'), newComment);
    setComments(prev => [...prev, { id: ref.id, ...newComment, createdAt: null }]);
    setCommentText('');
    setSubmitting(false);
  }

  async function handleDelete() {
    if (!confirm('게시글을 삭제하시겠습니까?')) return;
    await deleteDoc(doc(getFirebaseDb(), 'posts', postId));
    router.push(`/community/${category}`);
  }

  function formatDate(ts: Post['createdAt']) {
    if (!ts) return '방금 전';
    return new Date(ts.seconds * 1000).toLocaleString('ko-KR');
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400 text-sm">로딩 중...</div>;
  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1">
        <Link href="/community" className="hover:text-green-600">커뮤니티</Link>
        <span>›</span>
        <Link href={`/community/${category}`} className="hover:text-green-600">{catInfo?.name}</Link>
        <span>›</span>
        <span className="text-gray-700 truncate max-w-[200px]">{post.title}</span>
      </nav>

      {/* Post */}
      <article className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h1 className="text-xl font-extrabold text-gray-900 mb-3">{post.title}</h1>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-5 pb-4 border-b">
          <span>{post.nickname} · {formatDate(post.createdAt)}</span>
          <span>👁 {post.viewCount}</span>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{post.content}</p>
        {user?.uid === post.userId && (
          <div className="flex gap-2 mt-5 pt-4 border-t">
            <Link href={`/community/write?edit=${postId}&cat=${category}`}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition">수정</Link>
            <button onClick={handleDelete}
              className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition">삭제</button>
          </div>
        )}
      </article>

      {/* Comments */}
      <section>
        <h2 className="text-sm font-bold text-gray-700 mb-3">댓글 {comments.length}개</h2>
        <div className="space-y-3 mb-4">
          {comments.map(c => (
            <div key={c.id} className="bg-gray-50 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-700">{c.nickname}</span>
                <span className="text-[11px] text-gray-400">{formatDate(c.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-700">{c.text}</p>
            </div>
          ))}
        </div>
        {user ? (
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              value={commentText} onChange={e => setCommentText(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
            />
            <button type="submit" disabled={submitting || !commentText.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-bold px-4 rounded-xl transition">
              등록
            </button>
          </form>
        ) : (
          <p className="text-sm text-center text-gray-400 py-4">
            <Link href="/auth/login" className="text-green-600 font-semibold">로그인</Link>하면 댓글을 작성할 수 있습니다.
          </p>
        )}
      </section>
    </div>
  );
}
