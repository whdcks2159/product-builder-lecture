import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = genMeta({
  title: '개인정보처리방침',
  description: 'NexusInsight 개인정보처리방침 — 수집하는 정보, 이용 목적, 제3자 제공 및 광고 정책을 안내합니다.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs mb-6 hover:opacity-70"
        style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft size={14} /> 홈으로
      </Link>

      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>개인정보처리방침</h1>
      <p className="text-xs mb-8" style={{ color: 'var(--text-secondary)' }}>최종 업데이트: 2026년 4월 7일</p>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>

        <section>
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>1. 개요</h2>
          <p>
            NexusInsight(이하 "서비스")는 RWA·양자 컴퓨팅·우주 경제·BCI 분야의 투자 인사이트를 제공하는 정보 플랫폼입니다.
            본 방침은 서비스 이용 과정에서 수집되는 정보의 종류, 이용 목적, 보호 방법을 설명합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>2. 수집하는 정보</h2>
          <p className="mb-2">본 서비스는 다음 정보를 자동으로 수집할 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>방문 페이지, 체류 시간 등 서비스 이용 기록</li>
            <li>브라우저 종류, 운영체제, 화면 해상도 등 기기 정보</li>
            <li>IP 주소 (지역 식별 목적, 개인 특정 불가)</li>
            <li>쿠키 및 유사 기술을 통한 세션 정보</li>
          </ul>
          <p className="mt-3">
            본 서비스는 회원 가입을 요구하지 않으며, 이름·이메일·전화번호 등 직접 식별 가능한 개인정보를 수집하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>3. 정보 이용 목적</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>서비스 품질 개선 및 사용자 경험 최적화</li>
            <li>콘텐츠 이용 통계 분석</li>
            <li>서비스 오류 감지 및 보안 유지</li>
            <li>맞춤형 광고 제공 (아래 광고 정책 참조)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>4. Google AdSense 광고</h2>
          <p className="mb-2">
            본 서비스는 Google AdSense를 통해 광고를 표시합니다. Google은 쿠키를 사용하여 방문자의 이전 방문 기록을 기반으로 관련성 높은 광고를 표시할 수 있습니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Google의 광고 쿠키 사용에 관한 자세한 내용은 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--text-primary)' }}>Google 광고 정책</a>을 참조하십시오.</li>
            <li>광고 맞춤설정을 원하지 않는 경우 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--text-primary)' }}>Google 광고 설정</a>에서 변경할 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>5. 제3자 서비스</h2>
          <p className="mb-2">본 서비스는 다음 제3자 서비스를 이용하며, 각 서비스의 개인정보처리방침이 적용됩니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong style={{ color: 'var(--text-primary)' }}>Google AdSense</strong> — 광고 게재</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Vercel</strong> — 웹 호스팅 및 분석</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Supabase</strong> — 뉴스 데이터 저장</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>6. 쿠키 정책</h2>
          <p className="mb-2">
            본 서비스는 서비스 기능 제공 및 광고 목적으로 쿠키를 사용합니다.
            브라우저 설정에서 쿠키를 비활성화할 수 있으나, 일부 기능이 제한될 수 있습니다.
          </p>
          <p>
            브라우저별 쿠키 설정 방법: 크롬(설정 → 개인정보 및 보안 → 쿠키), 사파리(설정 → 사파리 → 개인정보).
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>7. 데이터 보관 및 보안</h2>
          <p>
            수집된 이용 통계 데이터는 서비스 개선 목적으로만 사용되며, 불필요해진 경우 즉시 삭제합니다.
            개인 식별이 가능한 데이터는 수집하지 않으므로 별도 보관 기간이 적용되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>8. 이용자 권리</h2>
          <p>
            이용자는 언제든지 본 서비스의 개인정보 처리에 대한 문의를 할 수 있으며,
            Google 광고 맞춤설정 거부 등 제3자 서비스의 데이터 처리를 해당 서비스에서 직접 관리할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>9. 방침 변경</h2>
          <p>
            본 개인정보처리방침은 법령 변경이나 서비스 변경에 따라 수정될 수 있습니다.
            변경 시 본 페이지 상단의 최종 업데이트 날짜가 갱신됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>10. 문의</h2>
          <p>
            개인정보 처리에 관한 문의는 아래 이메일로 연락해 주십시오.
          </p>
          <p className="mt-2">
            이메일: <a href="mailto:contact@nexusinsight.io" className="underline" style={{ color: 'var(--text-primary)' }}>contact@nexusinsight.io</a>
          </p>
        </section>

      </div>

      <div className="mt-10 pt-6 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
        © 2026 NexusInsight. All rights reserved.
      </div>
    </div>
  );
}
