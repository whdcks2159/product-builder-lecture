import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-5xl mb-4">404</div>
      <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>페이지를 찾을 수 없습니다</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <Link href="/"
        className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
        style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }}>
        대시보드로 돌아가기
      </Link>
    </div>
  );
}
