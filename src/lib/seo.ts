import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stretch-guide.vercel.app';
const SITE_NAME = 'DailyStretch';

export function buildMetadata({
  title,
  description,
  path = '',
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords: ['스트레칭', '운동 전 스트레칭', '운동 후 스트레칭', ...keywords],
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

/** JSON-LD: HowTo for a single stretch */
export function buildHowToJsonLd(stretch: {
  name: string;
  description: string;
  steps: string[];
  holdTime: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: stretch.name,
    description: stretch.description,
    step: stretch.steps.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text,
    })),
    totalTime: stretch.holdTime,
  };
}

/** JSON-LD: WebSite for home page */
export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: '운동 전후 스트레칭 정보 제공 사이트',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/** JSON-LD: Article for category/pain pages */
export function buildArticleJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };
}
