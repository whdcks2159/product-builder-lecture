import type { MetadataRoute } from 'next';
import { exercises } from '@/data/exercises';
import { painAreas } from '@/data/pain-areas';
import { ALL_COMBOS } from '@/data/seo-combos';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://productbuilder-1.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/back-pain`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ];

  // Exercise pages: /exercise/[slug]
  const exercisePages: MetadataRoute.Sitemap = exercises.map((ex) => ({
    url: `${BASE_URL}/exercise/${ex.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Pain area pages: /pain/[slug]
  const painPages: MetadataRoute.Sitemap = painAreas.map((pain) => ({
    url: `${BASE_URL}/pain/${pain.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const stretchPages: MetadataRoute.Sitemap = ALL_COMBOS.map((combo) => ({
    url: `${BASE_URL}/stretch/${combo.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...exercisePages, ...painPages, ...stretchPages];
}
