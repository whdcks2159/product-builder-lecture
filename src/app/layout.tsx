import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stretch-guide.vercel.app'),
  title: {
    default: '스트레칭 가이드 - 운동 전후 스트레칭 완전 정복',
    template: '%s | 스트레칭 가이드',
  },
  description:
    '러닝, 헬스, 등산, 골프 등 10가지 운동의 전후 스트레칭을 쉽고 빠르게 확인하세요. 허리 디스크 예방 스트레칭도 제공합니다.',
  keywords: ['스트레칭', '운동 전 스트레칭', '운동 후 스트레칭', '부상 예방', '스트레칭 가이드'],
  robots: { index: true, follow: true },
  verification: { google: '8txD9fVhiHjZcsjvDKkxUh9cArvkEYsY4XYjzJLN-24' },
  openGraph: {
    locale: 'ko_KR',
    type: 'website',
    siteName: '스트레칭 가이드',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2764985690023492"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-MQ14GD8ESS" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-MQ14GD8ESS');
        `}</Script>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
