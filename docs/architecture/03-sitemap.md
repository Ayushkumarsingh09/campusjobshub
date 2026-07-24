# Sitemap

## 1. URL Strategy

- **Base:** `https://campusjobshub.com`
- **Trailing slash:** No trailing slash (consistent 301 from `/path/` → `/path`)
- **Locale prefix:** None in Phase 1 (`/hi/` in Phase 3)
- **Dynamic segments:** `[slug]` for entities, `[city]` for geo pages
- **Pagination:** `?page=2` with `rel=prev/next` (or `/page/2` for blog — choose one globally)

---

## 2. Complete Sitemap Tree

```
/
├── /jobs
│   ├── /jobs/[job-slug]                    # Job detail
│   ├── /jobs/in-[city]                     # City landing (e.g., /jobs/in-delhi)
│   ├── /jobs/category/[category-slug]      # Category landing
│   ├── /jobs/fresher                       # Fresher jobs hub
│   ├── /jobs/remote                        # Remote jobs hub
│   └── /jobs/search                        # Search results (noindex if query-only)
│
├── /internships
│   ├── /internships/[internship-slug]      # Internship detail
│   ├── /internships/in-[city]              # City landing
│   ├── /internships/category/[category-slug]
│   ├── /internships/summer                 # Seasonal hub
│   ├── /internships/ppo                    # PPO internships hub
│   └── /internships/search
│
├── /companies
│   ├── /companies/[company-slug]           # Company profile + listings
│   └── /companies/search
│
├── /prepare
│   ├── /interview-questions
│   │   ├── /interview-questions/[company-slug]
│   │   ├── /interview-questions/role/[role-slug]
│   │   └── /interview-questions/[question-slug]   # Individual Q (Phase 2)
│   │
│   └── /roadmaps
│       ├── /roadmaps/[roadmap-slug]        # Roadmap overview
│       └── /roadmaps/[roadmap-slug]/[step-slug]
│
├── /resume
│   ├── /resume                             # Marketing landing (public)
│   ├── /resume/builder                     # Auth required
│   ├── /resume/templates                   # Public gallery
│   └── /resume/ats-checker                 # Auth required
│
├── /blog
│   ├── /blog                               # Blog index
│   ├── /blog/category/[category-slug]
│   ├── /blog/tag/[tag-slug]
│   └── /blog/[post-slug]                   # Article detail
│
├── /testimonials
│   └── /testimonials/[testimonial-slug]    # Optional individual pages
│
├── /newsletter
│   ├── /newsletter/subscribe
│   ├── /newsletter/confirm/[token]
│   └── /newsletter/unsubscribe/[token]
│
├── /auth
│   ├── /auth/login
│   ├── /auth/register
│   ├── /auth/forgot-password
│   ├── /auth/reset-password/[token]
│   └── /auth/verify-email/[token]
│
├── /dashboard                              # Student dashboard (auth)
│   ├── /dashboard/applications
│   ├── /dashboard/applications/[id]
│   ├── /dashboard/saved
│   ├── /dashboard/resumes
│   ├── /dashboard/resumes/[id]
│   ├── /dashboard/resumes/[id]/ats-reports/[reportId]
│   ├── /dashboard/profile
│   ├── /dashboard/settings
│   └── /dashboard/notifications
│
├── /employer                               # Employer portal (auth + role)
│   ├── /employer/onboarding
│   ├── /employer/company
│   ├── /employer/jobs
│   ├── /employer/jobs/new
│   ├── /employer/jobs/[id]/edit
│   ├── /employer/internships
│   ├── /employer/internships/new
│   ├── /employer/internships/[id]/edit
│   ├── /employer/applications
│   └── /employer/applications/[id]
│
├── /admin                                    # Admin (auth + role)
│   ├── /admin
│   ├── /admin/users
│   ├── /admin/jobs
│   ├── /admin/companies
│   ├── /admin/blog
│   ├── /admin/comments
│   ├── /admin/newsletter
│   └── /admin/settings
│
├── /about
├── /contact
├── /careers                                  # CampusJobsHub hiring
├── /advertise
├── /privacy-policy
├── /terms-of-service
├── /cookie-policy
├── /disclaimer
│
└── /api                                      # See API Architecture (not in HTML sitemap)
    └── /api/v1/...
```

---

## 3. XML Sitemap Index Structure

```
/sitemap.xml                    # Sitemap index
├── /sitemap-static.xml         # Homepage, about, legal (priority 0.8–1.0)
├── /sitemap-jobs.xml           # Active jobs (priority 0.9, changefreq daily)
├── /sitemap-internships.xml    # Active internships
├── /sitemap-companies.xml      # Verified companies
├── /sitemap-blog.xml           # Published posts (changefreq weekly)
├── /sitemap-interview.xml      # Interview hubs
├── /sitemap-roadmaps.xml       # Roadmaps
├── /sitemap-geo-jobs.xml       # City + category combo pages (programmatic)
└── /sitemap-images.xml         # Image sitemap for job logos, blog featured
```

**Generation:** Cron job every 6 hours; split files at 50K URLs per sitemap file (Google limit).

---

## 4. Robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /employer/
Disallow: /auth/
Disallow: /resume/builder
Disallow: /resume/ats-checker
Disallow: /*?*utm_
Disallow: /jobs/search?*
Disallow: /internships/search?*

User-agent: AdsBot-Google
Allow: /blog/
Allow: /interview-questions/
Allow: /roadmaps/

Sitemap: https://campusjobshub.com/sitemap.xml
```

---

## 5. Page Priority Matrix

| URL Pattern | Priority | Changefreq | Index |
|-------------|----------|------------|-------|
| `/` | 1.0 | daily | yes |
| `/jobs/[slug]` | 0.9 | daily | yes |
| `/internships/[slug]` | 0.9 | daily | yes |
| `/companies/[slug]` | 0.8 | weekly | yes |
| `/blog/[slug]` | 0.8 | monthly | yes |
| `/jobs/in-[city]` | 0.85 | daily | yes |
| `/interview-questions/*` | 0.75 | weekly | yes |
| `/dashboard/*` | — | — | no |
| `/auth/*` | — | — | no |
| Search with params only | — | — | noindex |

---

## 6. Programmatic SEO Pages (Phase 2+)

High-value combo pages (auto-generated when ≥5 active listings):

```
/jobs/[category]-jobs-in-[city]           # e.g., /jobs/software-engineer-jobs-in-pune
/internships/[category]-internships-in-[city]
/companies/hiring-in-[city]
/blog/placement-season-[year]
```

**Guardrails:** Minimum content block (intro + FAQ + listing grid); noindex if <3 listings.

---

## 7. Redirect Map (Launch)

| Old / Alias | Target | Type |
|-------------|--------|------|
| `/job/[slug]` | `/jobs/[slug]` | 301 |
| `/internship/[slug]` | `/internships/[slug]` | 301 |
| `/register` | `/auth/register` | 301 |
| `/login` | `/auth/login` | 301 |
| Expired job (30d) | Parent category page | 301 |
| Expired job (90d+) | — | 410 Gone |

---

## 8. Route → Next.js App Router Mapping (Preview)

| Route Group | Layout | Middleware |
|-------------|--------|------------|
| `(marketing)` | Public header/footer | None |
| `(auth)` | Minimal layout | Guest-only redirect if logged in |
| `(dashboard)` | Student sidebar | `auth` + role `STUDENT` |
| `(employer)` | Employer sidebar | `auth` + role `EMPLOYER` |
| `(admin)` | Admin sidebar | `auth` + role `ADMIN` |
| `api/v1` | N/A | Rate limit + auth per route |

See [Folder Structure](./07-folder-structure.md) for full file mapping.
