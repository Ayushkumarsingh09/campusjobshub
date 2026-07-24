#!/usr/bin/env node
/**
 * Pre-launch content & readiness audit.
 * Requires backend running at NEXT_PUBLIC_API_URL (default http://localhost:4000).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const FRONTEND = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const LOGOS_DIR = path.join(__dirname, '..', 'frontend', 'public', 'logos');

const issues = [];
const warnings = [];
let checks = 0;

function fail(msg) {
  issues.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}
function pass() {
  checks += 1;
}

async function apiGet(path) {
  const res = await fetch(`${API}${path}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    throw new Error(body.error?.message ?? `HTTP ${res.status}`);
  }
  return body.data;
}

function hasText(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

async function auditCompanies() {
  const companies = await apiGet('/api/v1/companies?page=1&limit=100');
  for (const c of companies) {
    checks += 1;
    if (!hasText(c.name)) fail(`Company ${c.slug}: missing name`);
    if (!hasText(c.logoUrl)) fail(`Company ${c.slug}: missing logoUrl`);
    if (!hasText(c.careersPageUrl)) warn(`Company ${c.slug}: missing careersPageUrl`);
    if (!hasText(c.hiringProcess)) fail(`Company ${c.slug}: missing hiringProcess`);
    if (!hasText(c.eligibilityCriteria)) fail(`Company ${c.slug}: missing eligibilityCriteria`);
    if (!hasText(c.salaryInformation)) fail(`Company ${c.slug}: missing salaryInformation`);
    if (!hasText(c.interviewExperience)) fail(`Company ${c.slug}: missing interviewExperience`);
    if (!hasText(c.ogImageUrl)) fail(`Company ${c.slug}: missing featured/og image`);
    if (!hasText(c.metaTitle)) warn(`Company ${c.slug}: missing metaTitle`);
    if (!hasText(c.metaDescription)) warn(`Company ${c.slug}: missing metaDescription`);

    const logoFile = path.join(LOGOS_DIR, `${c.slug}.svg`);
    if (!fs.existsSync(logoFile)) fail(`Company ${c.slug}: logo file missing at public/logos/${c.slug}.svg`);
    else pass();
  }
  console.log(`Companies audited: ${companies.length}`);
}

async function fetchAll(endpoint) {
  const items = [];
  let page = 1;
  while (true) {
    const batch = await apiGet(`${endpoint}?page=${page}&limit=100`);
    if (!batch.length) break;
    items.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }
  return items;
}

async function auditListings(type) {
  const endpoint = type === 'jobs' ? '/api/v1/jobs' : '/api/v1/internships';
  const items = await fetchAll(`/api/v1/${type}`);
  for (const item of items) {
    checks += 1;
    if (!hasText(item.title)) fail(`${type} ${item.slug}: missing title`);
    if (!hasText(item.slug)) fail(`${type}: missing slug`);
    if (!hasText(item.description)) fail(`${type} ${item.slug}: missing description`);
    if (!hasText(item.ogImageUrl)) fail(`${type} ${item.slug}: missing featured image`);
    if (!hasText(item.metaTitle)) warn(`${type} ${item.slug}: missing metaTitle`);
    if (!item.company?.slug) fail(`${type} ${item.slug}: missing company link`);

    const applyUrl = item.externalApplyUrl?.trim() || item.company?.careersPageUrl?.trim();
    if (!applyUrl) warn(`${type} ${item.slug}: no external apply or careers URL`);
    else {
      try {
        new URL(applyUrl);
        pass();
      } catch {
        fail(`${type} ${item.slug}: invalid apply URL ${applyUrl}`);
      }
    }
  }
  console.log(`${type} audited: ${items.length}`);
}

async function auditBlogs() {
  const posts = await fetchAll('/api/v1/blog');
  const guides = posts.filter((p) => p.slug?.includes('campus-hiring-guide'));
  for (const post of posts) {
    checks += 1;
    if (!hasText(post.title)) fail(`Blog ${post.slug}: missing title`);
    if (!hasText(post.ogImageUrl) && !hasText(post.featuredImageUrl)) {
      fail(`Blog ${post.slug}: missing featured image`);
    }
    if (!hasText(post.metaDescription)) warn(`Blog ${post.slug}: missing metaDescription`);
  }
  for (const guide of guides) {
    if (!hasText(guide.excerpt)) warn(`Guide ${guide.slug}: missing excerpt`);
    if (!guide.faq || guide.faq.length < 3) warn(`Guide ${guide.slug}: fewer than 3 FAQs`);
  }
  console.log(`Blog posts audited: ${posts.length} (${guides.length} company guides)`);
}

async function auditCareerUrls() {
  const companies = await apiGet('/api/v1/companies?page=1&limit=100');
  const unique = [...new Set(companies.map((c) => c.careersPageUrl).filter(Boolean))];
  let ok = 0;
  for (const url of unique) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(8000) });
      if (res.ok || res.status === 403 || res.status === 405) ok += 1;
      else warn(`Career URL returned ${res.status}: ${url}`);
    } catch (err) {
      warn(`Career URL unreachable: ${url} — ${err.message}`);
    }
  }
  console.log(`Career URLs checked: ${ok}/${unique.length} reachable`);
}

async function auditPublicPages() {
  const pages = [
    '/', '/jobs', '/internships', '/companies', '/blog', '/prepare/roadmaps',
    '/prepare/interview-questions', '/roadmaps', '/interview-questions',
    '/about', '/contact', '/privacy-policy', '/terms',
    '/resume-builder', '/ats-resume-checker', '/cover-letter-generator',
    '/robots.txt', '/sitemap.xml',
  ];
  for (const p of pages) {
    checks += 1;
    try {
      const res = await fetch(`${FRONTEND}${p}`);
      if (!res.ok) fail(`Page ${p}: HTTP ${res.status}`);
      else pass();
    } catch (err) {
      fail(`Page ${p}: ${err.message}`);
    }
  }
  console.log(`Public pages checked: ${pages.length}`);
}

async function auditAuthGates() {
  const publicTools = ['/resume-builder', '/ats-resume-checker', '/cover-letter-generator'];
  const protectedTools = ['/resume/builder', '/resume/ats-checker', '/resume/cover-letter', '/dashboard'];
  for (const p of publicTools) {
    const res = await fetch(`${FRONTEND}${p}`, { redirect: 'manual' });
    if (res.status === 307 || res.status === 308 || res.status === 302) {
      fail(`SEO landing ${p} should be public but redirects (${res.status})`);
    } else pass();
  }
  for (const p of protectedTools) {
    const res = await fetch(`${FRONTEND}${p}`, { redirect: 'manual' });
    if (res.status !== 307 && res.status !== 308 && res.status !== 302) {
      warn(`Protected route ${p} did not redirect unauthenticated (${res.status})`);
    } else pass();
  }
}

async function main() {
  console.log('CampusJobsHub Pre-Launch Audit\n');
  console.log(`API: ${API}`);
  console.log(`Frontend: ${FRONTEND}\n`);

  try {
    await auditCompanies();
    await auditListings('jobs');
    await auditListings('internships');
    await auditBlogs();
    await auditCareerUrls();
    await auditPublicPages();
    await auditAuthGates();
  } catch (err) {
    fail(`Audit aborted: ${err.message}`);
  }

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(100 - issues.length * 2 - warnings.length * 0.25)
    )
  );

  console.log('\n--- Summary ---');
  console.log(`Checks run: ${checks}`);
  console.log(`Issues: ${issues.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`Readiness score: ${score}/100`);

  if (issues.length) {
    console.log('\nIssues:');
    issues.slice(0, 30).forEach((i) => console.log(`  ✗ ${i}`));
    if (issues.length > 30) console.log(`  ... and ${issues.length - 30} more`);
  }
  if (warnings.length) {
    console.log('\nWarnings:');
    warnings.slice(0, 20).forEach((w) => console.log(`  ! ${w}`));
    if (warnings.length > 20) console.log(`  ... and ${warnings.length - 20} more`);
  }

  const reportPath = path.join(__dirname, '..', 'docs', 'production', 'PRE-LAUNCH-AUDIT-RESULTS.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(
    reportPath,
    JSON.stringify({ score, checks, issues, warnings, at: new Date().toISOString() }, null, 2)
  );
  console.log(`\nReport saved: docs/production/PRE-LAUNCH-AUDIT-RESULTS.json`);

  process.exit(issues.length > 0 ? 1 : 0);
}

main();
