import type { Metadata, Viewport } from 'next';
import './globals.css';
import { defaultMetadata } from '@/lib/seo';
import BottomNav from '@/components/layout/BottomNav';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';
import Link from 'next/link';

export const metadata: Metadata = {
  ...defaultMetadata,
  // PWA
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NexusInsight',
  },
  formatDetection: { telephone: false },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <head>
        {/* PWA 아이콘 */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="32x32"  href="/icons/icon-72.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2764985690023492" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <ServiceWorkerRegistrar />
        <main className="pb-nav">
          {children}
        </main>
        <footer className="pb-nav text-center py-4 text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>
          <div className="flex items-center justify-center gap-4">
            <Link href="/about" className="hover:opacity-80 transition-opacity">소개</Link>
            <Link href="/privacy" className="hover:opacity-80 transition-opacity">개인정보처리방침</Link>
          </div>
          <p className="mt-1">© 2026 NexusInsight</p>
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
