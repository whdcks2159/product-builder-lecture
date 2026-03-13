import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 text-center">
      <div>
        <div className="text-6xl mb-4">🤸</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-sm text-gray-500 mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <Link
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full text-sm transition"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
