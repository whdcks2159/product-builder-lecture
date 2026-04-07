import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import Link from 'next/link';
import { ArrowLeft, Mail, Globe, Shield, BookOpen, TrendingUp } from 'lucide-react';

export const metadata: Metadata = genMeta({
  title: '서비스 소개',
  description: 'NexusInsight는 RWA·양자 컴퓨팅·우주 경제·BCI 분야 전문가 인사이트를 제공하는 미래 투자 리서치 플랫폼입니다.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs mb-6 hover:opacity-70"
        style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft size={14} /> 홈으로
      </Link>

      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>NexusInsight 소개</h1>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          NexusInsight는 RWA(실물 자산 토큰화), 양자 컴퓨팅, 우주 경제, BCI(뇌-컴퓨터 인터페이스) 등
          차세대 성장 섹터의 전문가 분석과 시장 데이터를 한 곳에서 제공하는 투자 리서치 플랫폼입니다.
        </p>
      </div>

      {/* 미션 */}
      <section className="mb-8 p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>우리의 미션</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          복잡한 미래 기술과 시장 구조를 누구나 이해할 수 있도록 풀어내는 것입니다.
          기관 투자자 수준의 정보를 개인 투자자도 접근할 수 있게 하여, 정보 비대칭을 줄이는 것이 목표입니다.
        </p>
      </section>

      {/* 핵심 특징 */}
      <section className="mb-8">
        <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>무엇을 제공하나요</h2>
        <div className="space-y-3">
          {[
            {
              icon: BookOpen,
              title: '전문가 인사이트 아티클',
              desc: '각 분야 전문 애널리스트가 직접 작성한 심층 분석 리포트. 시장 구조, 핵심 플레이어, 투자 지표를 체계적으로 분석합니다.',
            },
            {
              icon: TrendingUp,
              title: '섹터별 시장 데이터',
              desc: 'RWA TVL, 양자 컴퓨팅 투자 현황, 우주 발사 일정, BCI 임상 데이터 등 실시간 지표 대시보드.',
            },
            {
              icon: Globe,
              title: '일일 AI 뉴스 피드',
              desc: 'NewsAPI와 Gemini AI가 매일 2회 수집·요약하는 글로벌 기술 투자 뉴스. 중요도 스코어와 3줄 요약 제공.',
            },
            {
              icon: Shield,
              title: '객관적·독립적 분석',
              desc: '광고주나 특정 프로젝트로부터 독립된 중립적 시각으로 분석합니다. 모든 콘텐츠는 투자 권유가 아닌 정보 제공 목적입니다.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <Icon size={16} style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 편집 기준 */}
      <section className="mb-8 p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>편집 기준 (E-E-A-T)</h2>
        <ul className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-400">·</span>
            <span><strong style={{ color: 'var(--text-primary)' }}>경험(Experience):</strong> 실제 해당 섹터에서 활동 중인 전문가 필진</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-400">·</span>
            <span><strong style={{ color: 'var(--text-primary)' }}>전문성(Expertise):</strong> Bloomberg, Messari, RWA.xyz 등 1차 데이터 기반 분석</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-400">·</span>
            <span><strong style={{ color: 'var(--text-primary)' }}>권위성(Authoritativeness):</strong> 복수 리뷰어 교차 검증 후 발행</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-400">·</span>
            <span><strong style={{ color: 'var(--text-primary)' }}>신뢰성(Trustworthiness):</strong> 출처 명시, 면책 조항 투명 공개</span>
          </li>
        </ul>
      </section>

      {/* 면책 조항 */}
      <section className="mb-8 p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: '#f59e0b' }}>면책 조항: </span>
          NexusInsight의 모든 콘텐츠는 정보 제공 목적으로만 제공되며 투자 조언이 아닙니다.
          모든 투자에는 원금 손실 위험이 있으며, 투자 결정 전 반드시 전문 재무 상담사와 상담하십시오.
          과거 실적이 미래 수익을 보장하지 않습니다.
        </p>
      </section>

      {/* 연락처 */}
      <section className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>문의하기</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          콘텐츠 제안, 오류 신고, 광고 문의 등은 아래 이메일로 연락해 주십시오.
        </p>
        <a href="mailto:contact@nexusinsight.io"
          className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#3b82f6' }}>
          <Mail size={16} />
          contact@nexusinsight.io
        </a>
      </section>

      {/* Footer links */}
      <div className="mt-10 pt-6 flex gap-4 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
        <Link href="/privacy" className="hover:opacity-80">개인정보처리방침</Link>
        <Link href="/" className="hover:opacity-80">홈으로</Link>
      </div>
    </div>
  );
}
