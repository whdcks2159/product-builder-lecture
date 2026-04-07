import { MetadataRoute } from 'next';
import { sectors } from '@/data/sectors';
import { articles } from '@/data/articles';

const BASE = 'https://nexus-insight.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/sectors`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/insights`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const sectorRoutes: MetadataRoute.Sitemap = sectors.map(s => ({
    url: `${BASE}/sectors/${s.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${BASE}/insights/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...sectorRoutes, ...articleRoutes];
}
