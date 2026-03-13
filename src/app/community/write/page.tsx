'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { COMMUNITY_CATEGORIES } from '@/types/community';

function WriteForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, profile, loading } = useAuth();
  const editId = params.get('edit');
  const initCat = params.get('cat') ?? 'question';

  const [form, setForm] = useState({ title: '', content: '', category: initCat });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (editId) {
      getDoc(doc(getFirebaseDb(), 'posts', editId)).then(snap => {
        if (snap.exists()) {
          const d = snap.data();
          setForm({ title: d.title, content: d.content, category: d.category });
        }
      });
    }
  }, [editId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const nickname = profile?.nickname ?? user.displayName ?? user.email ?? '익명';
    if (!form.title.trim() || !form.content.trim()) { setError('제목과 내용을 입력해주세요.'); return; }
    setSubmitting(true);
    try {
      if (editId) {
        await updateDoc(doc(getFirebaseDb(), 'posts', editId), { title: form.title.trim(), content: form.content.trim(), category: form.category });
        setSuccess(true);
        setTimeout(() => router.push(`/community/${form.category}/${editId}`), 1500);
      } else {
        const ref = await addDoc(collection(getFirebaseDb(), 'posts'), {
          userId: user.uid, nickname,
          category: form.category, title: form.title.trim(), content: form.content.trim(),
          createdAt: serverTimestamp(), viewCount: 0,
        });
        setSuccess(true);
        setTimeout(() => router.push(`/community/${form.category}/${ref.id}`), 1500);
      }
    } catch {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
      setSubmitting(false);
    }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400 text-sm">로딩 중...</div>;

  return (
    <>
    {success && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-6 text-center max-w-xs w-full mx-4">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-lg font-extrabold text-gray-900 mb-1">{editId ? '수정 완료!' : '작성 완료!'}</p>
          <p className="text-sm text-gray-500">게시글로 이동합니다.</p>
        </div>
      </div>
    )}
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-extrabold text-gray-900 mb-6">{editId ? '게시글 수정' : '글 작성'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-white">
            {COMMUNITY_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
            placeholder="제목을 입력하세요" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required rows={10}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 resize-y"
            placeholder="내용을 입력하세요" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition">
            {submitting ? '저장 중...' : (editId ? '수정하기' : '작성하기')}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition">
            취소
          </button>
        </div>
      </form>
    </div>
    </>
  );
}

export default function WritePage() {
  return <Suspense><WriteForm /></Suspense>;
}
