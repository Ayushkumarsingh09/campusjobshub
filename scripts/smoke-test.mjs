#!/usr/bin/env node
/**
 * Production smoke test — run with backend at NEXT_PUBLIC_API_URL (default localhost:4000)
 * Usage: node scripts/smoke-test.mjs
 */
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const FRONTEND = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const publicApiRoutes = [
  ['GET', '/api/v1/health'],
  ['GET', '/api/v1/jobs?page=1&limit=5'],
  ['GET', '/api/v1/internships?page=1&limit=5'],
  ['GET', '/api/v1/companies?page=1&limit=5'],
  ['GET', '/api/v1/blog?page=1&limit=5'],
  ['GET', '/api/v1/roadmaps?page=1&limit=5'],
  ['GET', '/api/v1/interview-questions?page=1&limit=5'],
  ['GET', '/api/v1/search?q=java'],
  ['GET', '/api/v1/resumes/templates'],
];

const publicPages = [
  '/',
  '/jobs',
  '/internships',
  '/companies',
  '/blog',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/resume-builder',
  '/ats-resume-checker',
  '/robots.txt',
  '/sitemap.xml',
];

async function checkApi(method, path) {
  const url = `${API}${path}`;
  try {
    const res = await fetch(url, { method });
    const body = await res.json().catch(() => ({}));
    const ok = res.ok && (body.success !== false);
    return { path, ok, status: res.status, detail: body.error?.message };
  } catch (err) {
    return { path, ok: false, status: 0, detail: err.message };
  }
}

async function checkPage(path) {
  const url = `${FRONTEND}${path}`;
  try {
    const res = await fetch(url);
    return { path, ok: res.ok, status: res.status };
  } catch (err) {
    return { path, ok: false, status: 0, detail: err.message };
  }
}

async function main() {
  console.log('CampusJobsHub Smoke Test\n');
  console.log(`API: ${API}`);
  console.log(`Frontend: ${FRONTEND}\n`);

  let passed = 0;
  let failed = 0;

  console.log('--- API Routes ---');
  for (const [method, path] of publicApiRoutes) {
    const r = await checkApi(method, path);
    const icon = r.ok ? 'PASS' : 'FAIL';
    if (r.ok) passed++; else failed++;
    console.log(`${icon} ${method} ${path} (${r.status})${r.detail ? ` — ${r.detail}` : ''}`);
  }

  console.log('\n--- Public Pages ---');
  for (const path of publicPages) {
    const r = await checkPage(path);
    const icon = r.ok ? 'PASS' : 'FAIL';
    if (r.ok) passed++; else failed++;
    console.log(`${icon} ${path} (${r.status})${r.detail ? ` — ${r.detail}` : ''}`);
  }

  console.log(`\nResult: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
