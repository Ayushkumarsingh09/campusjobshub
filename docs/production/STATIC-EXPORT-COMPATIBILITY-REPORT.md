# CampusJobsHub — Static Export Compatibility Report

**Date:** 7 June 2026  
**Target:** Hostinger Shared Hosting (`STATIC_EXPORT=true` → `frontend/out/`)  
**Backend:** Render (`api.campusjobshub.com`)

---

## Executive Summary

| Question | Answer |
|----------|--------|
| Can the frontend deploy as static files? | **Yes**, with `STATIC_EXPORT=true` |
| Does `npm run build` produce `frontend/out/`? | **Yes** (verified: 435 files, 129 routes in test build) |
| Is it 100% compatible without caveats? | **No** — see limitations below |
| **Overall compatibility score** | **82/100** |

---

## 1. Feature Audit

### Server actions
**None found.** No `"use server"` in the codebase.

### Route handlers (`app/api/*`)
**None found.** No Next.js API routes. All data goes to Express on Render.

### Dynamic SSR at runtime
**Not used on Hostinger.** With `output: 'export'`, all pages are pre-rendered at **build time**. There is no Node server on Hostinger.

| Pattern | Status |
|---------|--------|
| Server Components fetching API at build | Used for home, blog detail, company detail, job detail, etc. |
| `export const dynamic = 'force-dynamic'` | Not used |
| Runtime SSR per request | **Not available** on static hosting |

### Middleware (`frontend/src/middleware.ts`)
**Present but DISABLED on static export.**

Next.js build warning:
> Statically exporting a Next.js application disables API routes and **middleware**.

| Middleware feature | Static hosting behavior |
|--------------------|-------------------------|
| Cookie check on `/admin`, `/dashboard` | **Does not run** |
| Redirect to `/auth/login` | **Does not run** |

**Replacement:** Client-side `AuthGuard` + `PermissionGuard` + backend API auth (already implemented).

### Server-side authentication
**Not used for page rendering.** Session is:
1. httpOnly cookie `cjh_session` set by Render API (`SameSite=None; Secure` in production)
2. Validated client-side via `GET /api/v1/auth/session`
3. Enforced on API for all mutations

### Dynamic metadata at runtime
**Build-time only.** `generateMetadata()` runs during `next build`, not on each request.

---

## 2. Build Verification

### Command (production)

```powershell
cd frontend
$env:STATIC_EXPORT="true"
$env:NEXT_PUBLIC_SITE_URL="https://campusjobshub.com"
$env:NEXT_PUBLIC_API_URL="https://api.campusjobshub.com"  # MUST be live + seeded
$env:NEXT_PUBLIC_ENABLE_ADS="false"
$env:AUTH_SECRET="<same as Render>"
npm run build
```

### Output
- **Folder:** `frontend/out/`
- **Verified:** 435 static files generated
- **Includes:** `index.html`, `robots.txt`, `sitemap.xml`, `.htaccess`

### Critical build requirement
**The Render API must be running and seeded during build.**  
`generateStaticParams()` fetches jobs, companies, blogs, etc. from the API.

| API state during build | Result |
|------------------------|--------|
| API up + seeded | ~350+ pages (full content) |
| API down / error | Fallback slugs only (~129 pages) |

---

## 3. Page Compatibility Matrix

### Fully compatible (static shell + client API)

| Area | Routes | Notes |
|------|--------|-------|
| Public listings | `/jobs`, `/internships`, `/companies` | Client-side `api.get()` — live data |
| Search | `/search?q=` | Client-side `useSearchParams` |
| Auth | `/auth/login`, `/auth/register` | Client → Render API + cookies |
| Admin CMS | `/admin/*` | All pages `'use client'` → Render admin API |
| Dashboard | `/dashboard/*` | `AuthGuard` + career API |
| Employer | `/employer/*` | `AuthGuard` + employer API |
| Career tools | `/resume/builder`, `/resume/ats-checker`, etc. | Client-side |

### Compatible with pre-rendered HTML (build-time API fetch)

| Routes | `generateStaticParams` | Limitation |
|--------|------------------------|------------|
| `/jobs/[slug]` | Yes | New job slugs need **rebuild** for SEO HTML |
| `/internships/[slug]` | Yes | Same |
| `/companies/[slug]` | Yes | Same |
| `/blog/[slug]` | Yes | Same |
| `/prepare/roadmaps/[slug]` | Yes | Same |
| `/jobs/in-{city}` | Yes (city slugs) | Fixed set of 9 cities |

### Required fixes applied (this audit)

| Issue | Fix applied |
|-------|-------------|
| `robots.ts` / `sitemap.ts` missing `force-static` | Added `export const dynamic = 'force-static'` |
| `generateStaticParams` empty when API fails | Fallback slugs in `lib/static-export-params.ts` |
| Admin `/admin/*/ [id]/edit` dynamic routes | Added `layout.tsx` with `generateStaticParams([{id:'_'}])` |
| `next.config.ts` redirects ignored | `.htaccess` 301 rules (already present) |
| Admin edit URLs with real UUIDs | `.htaccess` rewrite to `/_/edit/` shell |

---

## 4. Incompatible / Limited Items

### HIGH — New content after deploy (no rebuild)

**Problem:** Detail pages (`/jobs/[slug]`, `/blog/[slug]`, etc.) are static HTML files generated at build time.  
A new job created in CMS **will appear in listings** (client fetch) but **`/jobs/new-slug` returns wrong page** (`.htaccess` falls back to `index.html`).

**Fix options:**
1. **Recommended for launch:** Rebuild & re-upload `frontend/out/` after major content changes
2. **Future:** Convert detail pages to client-side fetch-by-slug (larger refactor)

### MEDIUM — Middleware auth bypass

**Problem:** `/admin` HTML is publicly downloadable; middleware doesn't run.

**Mitigation:** `PermissionGuard` blocks UI; all admin API routes require auth + role on Render. **Acceptable** if API is secure.

### MEDIUM — Footer newsletter form

**Problem:** `footer.tsx` posts to `/api/newsletter` — no Next.js route, no static handler.

**Fix:** Wire to Render endpoint or convert to client-side `api.post('/newsletter/subscribe')` (endpoint must exist on backend).

### LOW — `next.config.ts` redirects

**Problem:** `redirects()` ignored with `output: 'export'`.

**Mitigation:** `.htaccess` handles `/roadmaps` and `/interview-questions` redirects. **OK.**

### LOW — Sitemap incomplete

**Problem:** `sitemap.ts` lists static + city pages only; not all job/blog slugs.

**Fix (optional):** Generate sitemap from API at build time or serve dynamic sitemap from Render.

---

## 5. Cross-Origin Runtime (Render + Hostinger)

### API calls
Frontend uses `NEXT_PUBLIC_API_URL` baked in at build → `https://api.campusjobshub.com`

All `fetch()` uses `credentials: 'include'` — **correct for cookies**.

### Login flow (verified design)

```
Browser @ campusjobshub.com
  → POST api.campusjobshub.com/api/v1/auth/login
  ← Set-Cookie: cjh_session (Secure, SameSite=None)
  → GET api.campusjobshub.com/api/v1/auth/session (with cookie)
```

**Requirements:**
- `FRONTEND_URL=https://campusjobshub.com` on Render (CORS)
- HTTPS on both domains
- `AUTH_SECRET` identical on Render and frontend build env

### Admin CMS
All admin operations → `api.campusjobshub.com/api/v1/admin/*` — **works** on static hosting.

### Dashboards
Student `/dashboard/*`, employer `/employer/*` → career API on Render — **works**.

---

## 6. What Does NOT Work on Hostinger Alone

| Feature | Why |
|---------|-----|
| Next.js middleware | Disabled with static export |
| `next.config` redirects | Build-time only; use `.htaccess` |
| Server-side session check before HTML | Use client `AuthGuard` instead |
| ISR / on-demand revalidation | Not available |
| New detail-page slugs without rebuild | Static files not auto-generated |

---

## 7. Exact Changes Required (Checklist)

### Already fixed in codebase
- [x] `robots.ts` + `sitemap.ts` → `force-static`
- [x] Fallback `generateStaticParams` when API unavailable
- [x] Admin `[id]/edit` layout shells for static export
- [x] `.htaccess` admin edit rewrite rules

### Before production deploy
- [ ] Build with **production API URL** and seeded database
- [ ] Upload full `frontend/out/` including `.htaccess`
- [ ] Set `FRONTEND_URL` + CORS on Render
- [ ] Match `AUTH_SECRET` across Render and frontend build
- [ ] Change default admin passwords after seed

### Recommended post-launch
- [ ] Fix footer newsletter → Render API endpoint
- [ ] Document rebuild workflow when CMS adds new slugs
- [ ] Expand `sitemap.ts` to include dynamic slugs at build time
- [ ] Optional: client-side job/blog detail pages for zero-rebuild CMS

---

## 8. Deployment Command Summary

```powershell
# 1. Ensure Render API is live
curl https://api.campusjobshub.com/api/v1/health

# 2. Build static export (API must be reachable)
cd frontend
$env:STATIC_EXPORT="true"
$env:NEXT_PUBLIC_API_URL="https://api.campusjobshub.com"
$env:NEXT_PUBLIC_SITE_URL="https://campusjobshub.com"
npm run build

# 3. Upload frontend/out/ → Hostinger public_html/
```

Or use: `.\scripts\build-production-frontend.ps1`

---

## 9. Compatibility Scores

| Category | Score | Notes |
|----------|------:|-------|
| Static export build | 95/100 | Builds successfully to `out/` |
| Public SEO pages | 90/100 | Pre-rendered; rebuild for new slugs |
| Auth + dashboards | 85/100 | Client-side guards; cookies cross-origin |
| Admin CMS | 88/100 | Works via API; edit URLs need `.htaccess` |
| Middleware parity | 40/100 | Disabled; compensated by client guards |
| Post-deploy CMS (no rebuild) | 60/100 | Listings live; detail pages static |

**Overall: 82/100 — Deploy-ready for Hostinger + Render with documented limitations.**
