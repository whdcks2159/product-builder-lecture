import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import NewsAnalyzer from '@/components/NewsAnalyzer';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Info } from 'lucide-react';

export const metadata: Metadata = genMeta({
  title: '뉴스 AI 분석기 — 투자 관점 3줄 요약 + 차트 타점',
  description:
    '뉴스 텍스트를 붙여넣으면 Claude AI가 투자자 관점 3줄 요약, 중요도 스코어, 이동평균선 차트 타점 힌트를 즉시 분석합니다.',
});

export default function NewsAnalyzerPage() {
  return (
    <div
      className="max-w-lg mx-auto min-h-screen"
      style={{ background: '#050505' }}
    >
      {/* ── 헤더 ─────────────────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 px-4 pt-5 pb-4"
        style={{ background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #111111' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-opacity hover:opacity-60"
            style={{ background: '#111111', border: '1px solid #222222' }}
          >
            <ArrowLeft size={16} style={{ color: '#888888' }} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold" style={{ color: '#f0f0f0' }}>
                뉴스 AI 분석기
              </h1>
              <span
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #2a2a2a', color: '#888888' }}
              >
                <Sparkles size={9} />
                Claude Sonnet
              </span>
            </div>
            <p className="text-[11px]" style={{ color: '#444444' }}>
              뉴스 텍스트 → 투자 인사이트 즉시 변환
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8">
        {/* ── 기능 소개 카드 ─────────────────────────────────────────────────── */}
        <div
          className="rounded-xl p-4 mb-5"
          style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Info size={11} style={{ color: '#555555' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#555555' }}>
              분석 항목
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['📝', '3줄 핵심 요약', '아빠도 이해하는 쉬운 설명'],
              ['🎯', '섹터 연결', '우주·로봇·양자·STO·연준'],
              ['📊', '중요도 스코어', '1~10점 정량 평가'],
              ['📈', '차트 타점 힌트', '200/240/365일선 기술 분석'],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                className="p-2.5 rounded-lg"
                style={{ background: '#111111', border: '1px solid #1e1e1e' }}
              >
                <p className="text-sm mb-0.5">{icon}</p>
                <p className="text-[11px] font-semibold" style={{ color: '#cccccc' }}>{title}</p>
                <p className="text-[10px]" style={{ color: '#555555' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 분석기 컴포넌트 ────────────────────────────────────────────────── */}
        <NewsAnalyzer />
      </div>
    </div>
  );
}
