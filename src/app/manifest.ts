import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NexusInsight — 미래 성장 섹터 인사이트',
    short_name: 'NexusInsight',
    description: 'RWA 자산 토큰화, 양자 컴퓨팅, 우주 경제, BCI 전문 분석 플랫폼',
    start_url: '/',
    display: 'standalone',
    background_color: '#070d1a',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    lang: 'ko',
    categories: ['finance', 'news', 'business'],
    icons: [
      {
        src: '/icons/icon-72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/home.png',
        sizes: '390x844',
        type: 'image/png',
        // @ts-ignore — form_factor는 표준 확장 필드
        form_factor: 'narrow',
        label: '홈 대시보드',
      },
    ],
    shortcuts: [
      {
        name: '인사이트 보기',
        short_name: '인사이트',
        description: '최신 전문가 분석 아티클',
        url: '/insights',
        icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
      },
      {
        name: '투자 계산기',
        short_name: '계산기',
        description: '섹터별 수익률 시뮬레이션',
        url: '/calculator',
        icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
      },
    ],
  };
}
