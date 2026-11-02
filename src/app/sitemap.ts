import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { getProjects, hasCaseStudy } from '@/lib/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/resume', ...getProjects().filter(hasCaseStudy).map((p) => `/work/${p.slug}`)];
  return pages.map((path) => ({ url: `${site.url}${path}` }));
}
