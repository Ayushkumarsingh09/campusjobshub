#!/usr/bin/env node
/**
 * Crawl internal routes from API data and verify HTTP responses.
 */
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const FRONTEND = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const staticRoutes = [
  '/', '/jobs', '/internships', '/companies', '/blog',
  '/prepare/roadmaps', '/prepare/interview-questions',
  '/roadmaps', '/interview-questions',
  '/about', '/contact', '/privacy-policy', '/terms',
  '/disclaimer', '/cookie-policy', '/resume-builder', '/ats-resume-checker',
  '/cover-letter-generator', '/application-tracker', '/auth/login', '/auth/register',
];

const broken = [];
const ok = [];

async function apiGet(path) {
  const res = await fetch(`${API}${path}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) return [];
  return body.data ?? [];
}

async function check(path) {
  try {
    const res = await fetch(`${FRONTEND}${path}`, { redirect: 'follow' });
    if (res.ok) ok.push(path);
    else broken.push({ path, status: res.status });
  } catch (err) {
    broken.push({ path, status: 0, error: err.message });
  }
}

async function main() {
  console.log('CampusJobsHub Link Audit\n');

  const [jobs, internships, companies, blogs, roadmaps, questions] = await Promise.all([
    apiGet('/api/v1/jobs?page=1&limit=200'),
    apiGet('/api/v1/internships?page=1&limit=200'),
    apiGet('/api/v1/companies?page=1&limit=100'),
    apiGet('/api/v1/blog?page=1&limit=200'),
    apiGet('/api/v1/roadmaps?page=1&limit=50'),
    apiGet('/api/v1/interview-questions?page=1&limit=200'),
  ]);

  const dynamic = [
    ...jobs.map((j) => `/jobs/${j.slug}`),
    ...internships.map((i) => `/internships/${i.slug}`),
    ...companies.map((c) => `/companies/${c.slug}`),
    ...blogs.map((b) => `/blog/${b.slug}`),
    ...roadmaps.map((r) => `/prepare/roadmaps/${r.slug}`),
  ];

  const all = [...new Set([...staticRoutes, ...dynamic])];
  console.log(`Checking ${all.length} routes...\n`);

  const batchSize = 10;
  for (let i = 0; i < all.length; i += batchSize) {
    await Promise.all(all.slice(i, i + batchSize).map(check));
  }

  console.log(`PASS: ${ok.length}`);
  console.log(`FAIL: ${broken.length}`);

  if (broken.length) {
    console.log('\nBroken links:');
    broken.forEach((b) => console.log(`  ${b.status} ${b.path}${b.error ? ` — ${b.error}` : ''}`));
  }

  process.exit(broken.length > 0 ? 1 : 0);
}

main();
