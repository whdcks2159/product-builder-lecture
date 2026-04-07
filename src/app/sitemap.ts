import { MetadataRoute } from 'next';
import { sectors } from '@/data/sectors';
import { articles } from '@/data/articles';

const BASE = 'https://productbuilder-1-whdcks2541-7861s-projects.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                      lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/sectors`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/insights`,        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/news-feed`,       lastModified: new Date(), changeFrequency: 'daily',   priority: 0.85 },
    { url: `${BASE}/news-dashboard`,  lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/calculator`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.4 },
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
    priority: a.featured ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...sectorRoutes, ...articleRoutes];
}
