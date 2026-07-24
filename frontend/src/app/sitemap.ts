import type { MetadataRoute } from 'next';
import { indianCities } from '@/config/site';

export const dynamic = 'force-static';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://campusjobshub.com';

function citySlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, '-');
}

function entry(path: string, priority = 0.7, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly'): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    entry('/', 1.0, 'daily'),
    entry('/jobs', 0.9, 'hourly'),
    entry('/jobs/fresher', 0.85, 'daily'),
    entry('/jobs/remote', 0.85, 'daily'),
    entry('/internships', 0.9, 'hourly'),
    entry('/internships/summer', 0.85, 'daily'),
    entry('/internships/ppo', 0.85, 'daily'),
    entry('/companies', 0.8, 'daily'),
    entry('/prepare/interview-questions', 0.8, 'weekly'),
    entry('/prepare/roadmaps', 0.8, 'weekly'),
    entry('/blog', 0.8, 'daily'),
    entry('/resume', 0.75, 'weekly'),
    entry('/resume-builder', 0.8, 'weekly'),
    entry('/ats-resume-checker', 0.8, 'weekly'),
    entry('/cover-letter-generator', 0.75, 'weekly'),
    entry('/application-tracker', 0.75, 'weekly'),
    entry('/resume/templates', 0.7, 'monthly'),
    entry('/search', 0.6, 'weekly'),
    entry('/about', 0.5, 'monthly'),
    entry('/contact', 0.5, 'monthly'),
    entry('/advertise', 0.4, 'monthly'),
    entry('/editorial-policy', 0.3, 'yearly'),
    entry('/privacy-policy', 0.3, 'yearly'),
    entry('/terms', 0.3, 'yearly'),
    entry('/cookie-policy', 0.3, 'yearly'),
    entry('/disclaimer', 0.3, 'yearly'),
    entry('/auth/login', 0.2, 'yearly'),
    entry('/auth/register', 0.2, 'yearly'),
  ];

  const cityJobPages = indianCities.map((city) =>
    entry(`/jobs/in-${citySlug(city)}`, 0.75, 'daily')
  );

  const cityInternshipPages = indianCities.map((city) =>
    entry(`/internships/in-${citySlug(city)}`, 0.75, 'daily')
  );

  return [...staticPages, ...cityJobPages, ...cityInternshipPages];
}
