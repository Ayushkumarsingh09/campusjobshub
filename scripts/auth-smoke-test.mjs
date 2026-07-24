#!/usr/bin/env node
/**
 * Auth + dashboard API smoke test — requires seeded database.
 * Usage: node scripts/auth-smoke-test.mjs
 */
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const accounts = [
  { role: 'student', email: 'student@demo.com', password: 'Password123' },
  { role: 'employer', email: 'employer@demo.com', password: 'Password123' },
  { role: 'superadmin', email: 'superadmin@campusjobshub.com', password: 'Password123' },
];

const roleChecks = {
  student: [
    ['GET', '/api/v1/career/overview'],
    ['GET', '/api/v1/applications'],
    ['GET', '/api/v1/resumes'],
    ['GET', '/api/v1/saved-jobs'],
  ],
  employer: [
    ['GET', '/api/v1/employer/overview'],
    ['GET', '/api/v1/employer/jobs'],
    ['GET', '/api/v1/employer/applications'],
  ],
  superadmin: [
    ['GET', '/api/v1/admin/dashboard'],
    ['GET', '/api/v1/admin/jobs?page=1&limit=5'],
    ['GET', '/api/v1/admin/blog?page=1&limit=5'],
    ['GET', '/api/v1/admin/users?page=1&limit=5'],
    ['GET', '/api/v1/admin/seo?page=1&limit=5'],
    ['GET', '/api/v1/admin/media?page=1&limit=5'],
  ],
};

function extractCookie(setCookie) {
  if (!setCookie) return null;
  const parts = Array.isArray(setCookie) ? setCookie : [setCookie];
  return parts.map((c) => c.split(';')[0]).join('; ') || null;
}

async function login(email, password) {
  const res = await fetch(`${API}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json().catch(() => ({}));
  const cookie = extractCookie(res.headers.getSetCookie?.() ?? res.headers.get('set-cookie'));
  return { ok: res.ok && body.success && !!cookie, status: res.status, cookie, detail: body.error?.message };
}

async function check(method, path, cookie) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Cookie: cookie },
  });
  const body = await res.json().catch(() => ({}));
  return { path, ok: res.ok && body.success !== false, status: res.status, detail: body.error?.message };
}

async function main() {
  console.log('CampusJobsHub Auth Smoke Test\n');
  let passed = 0;
  let failed = 0;

  for (const account of accounts) {
    console.log(`--- ${account.role} (${account.email}) ---`);
    const loginResult = await login(account.email, account.password);
    const icon = loginResult.ok ? 'PASS' : 'FAIL';
    if (loginResult.ok) passed++; else failed++;
    console.log(`${icon} POST /api/v1/auth/login (${loginResult.status})`);
    if (!loginResult.ok) {
      console.log(`  ${loginResult.detail ?? 'no session cookie'}\n`);
      continue;
    }

    for (const [method, path] of roleChecks[account.role]) {
      const r = await check(method, path, loginResult.cookie);
      const rIcon = r.ok ? 'PASS' : 'FAIL';
      if (r.ok) passed++; else failed++;
      console.log(`${rIcon} ${method} ${path} (${r.status})${r.detail ? ` — ${r.detail}` : ''}`);
    }
    console.log('');
  }

  console.log(`Result: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
