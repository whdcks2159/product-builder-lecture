'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError('이메일 발송에 실패했습니다. 이메일 주소를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">비밀번호 재설정</h1>
          <p className="text-sm text-gray-500 mt-1">가입한 이메일로 재설정 링크를 보내드립니다</p>
        </div>
        {sent ? (
          <div className="text-center">
            <div className="text-4xl mb-4">📧</div>
            <p className="text-gray-700 font-semibold mb-2">이메일이 발송되었습니다!</p>
            <p className="text-sm text-gray-500 mb-6">{email}으로 비밀번호 재설정 링크를 보내드렸습니다.</p>
            <Link href="/auth/login" className="text-green-600 font-semibold text-sm hover:underline">로그인으로 돌아가기</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="가입한 이메일 주소" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition">
              {loading ? '발송 중...' : '재설정 링크 보내기'}
            </button>
            <p className="text-center"><Link href="/auth/login" className="text-xs text-gray-500 hover:text-green-600">로그인으로 돌아가기</Link></p>
          </form>
        )}
      </div>
    </div>
  );
}
