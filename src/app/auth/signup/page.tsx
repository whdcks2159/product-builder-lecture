'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', confirm: '', nickname: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function set(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (form.password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
    if (form.nickname.trim().length < 2) { setError('닉네임은 2자 이상이어야 합니다.'); return; }
    setLoading(true);
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000));
      await Promise.race([signup(form.email, form.password, form.nickname.trim()), timeout]);
      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      const msg = (err as { message?: string }).message ?? '';
      if (msg === 'timeout') setError('요청 시간이 초과됐습니다. Firebase 환경변수 또는 네트워크를 확인하세요.');
      else if (code === 'auth/email-already-in-use') setError('이미 사용 중인 이메일입니다.');
      else if (code === 'auth/invalid-api-key') setError('Firebase API 키가 잘못됐습니다.');
      else if (code === 'auth/network-request-failed') setError('네트워크 오류입니다.');
      else setError(`오류 [${code ?? msg ?? '알 수 없음'}]`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    {success && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-6 text-center max-w-xs w-full mx-4">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-lg font-extrabold text-gray-900 mb-1">회원가입 완료!</p>
          <p className="text-sm text-gray-500">환영합니다, {form.nickname}님!<br/>메인 화면으로 이동합니다.</p>
        </div>
      </div>
    )}
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">회원가입</h1>
          <p className="text-sm text-gray-500 mt-1">DailyStretch 커뮤니티에 참여하세요</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
            <input type="text" value={form.nickname} onChange={set('nickname')} required
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="커뮤니티에서 사용할 닉네임" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input type="email" value={form.email} onChange={set('email')} required
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="example@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input type="password" value={form.password} onChange={set('password')} required
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="6자 이상" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
            <input type="password" value={form.confirm} onChange={set('confirm')} required
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="비밀번호 재입력" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition">
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="text-green-600 font-semibold hover:underline">로그인</Link>
        </p>
      </div>
    </div>
    </>
  );
}
