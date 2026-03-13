import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-white/6 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-6 pb-6 border-b border-white/8">
          <div>
            <div className="text-base font-bold text-white mb-1">DailyStretch</div>
            <p className="text-sm text-gray-500">올바른 스트레칭으로 건강한 운동 습관을</p>
          </div>
          <ul className="flex gap-5 flex-wrap">
            <li><Link href="#" className="text-sm text-gray-500 hover:text-gray-300 transition">이용약관</Link></li>
            <li><Link href="#" className="text-sm text-gray-500 hover:text-gray-300 transition">개인정보처리방침</Link></li>
            <li><Link href="#" className="text-sm text-gray-500 hover:text-gray-300 transition">문의하기</Link></li>
          </ul>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed mb-3">
          본 사이트의 스트레칭 정보는 일반적인 건강 정보 제공을 목적으로 하며, 의학적 진단 및 치료를 대체하지 않습니다.
          부상이나 통증이 있는 경우 반드시 전문 의료인과 상담하세요.
        </p>
        <p className="text-xs text-gray-700">© 2026 DailyStretch. All rights reserved.</p>
      </div>
    </footer>
  );
}
