import { Metadata } from 'next';

const BASE_URL = 'https://nexus-insight.vercel.app';
const SITE_NAME = 'NexusInsight';
const SITE_DESCRIPTION = '자산 토큰화(RWA), 양자 컴퓨팅, 우주 경제, BCI 등 미래 성장 섹터에 대한 전문가 인사이트 대시보드';

export function generateMetadata({
  title,
  description,
  path = '',
  image,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const desc = description || SITE_DESCRIPTION;
  const url = `${BASE_URL}${path}`;
  const ogImage = image || `${BASE_URL}/mainImage.png`;

  return {
    title: fullTitle,
    description: desc,
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: 'website',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export const defaultMetadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  keywords: ['RWA', '자산토큰화', '양자컴퓨팅', '우주경제', 'BCI', '뇌컴퓨터인터페이스', '미래투자', 'DeFi', '블록체인'],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
};
