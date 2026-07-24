# Enterprise Folder Structure

## Design Principles

1. **Route groups** mirror IA and auth boundaries
2. **Colocation** — feature modules own components, hooks, types, and server actions
3. **Strict boundaries** — `app/` (routes), `features/` (domain), `shared/` (cross-cutting)
4. **API versioning** — `/api/v1/` from day one
5. **Test mirroring** — `__tests__` adjacent to modules

---

## Complete Tree

```
campusjobs/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Lint, typecheck, test, build
│   │   ├── deploy-staging.yml
│   │   └── deploy-production.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── dependabot.yml
│
├── .husky/
│   ├── pre-commit
│   └── commit-msg
│
├── database/
│   ├── schema.sql                    # Master DDL
│   ├── migrations/                   # Prisma/Drizzle migrations
│   │   └── .gitkeep
│   ├── seeds/
│   │   ├── categories.seed.ts
│   │   ├── tags.seed.ts
│   │   └── demo-data.seed.ts
│   └── scripts/
│       ├── create-partitions.ts      # Monthly partition creator
│       └── reconcile-counters.ts
│
├── docs/
│   ├── architecture/                 # This documentation set
│   ├── api/                          # OpenAPI specs (generated)
│   └── runbooks/
│       ├── deployment.md
│       ├── incident-response.md
│       └── database-restore.md
│
├── public/
│   ├── favicon.ico
│   ├── robots.txt                    # Static fallback; dynamic preferred
│   ├── manifest.json                 # PWA
│   ├── og-default.png
│   ├── ads.txt                       # AdSense requirement
│   └── images/
│       ├── logos/
│       └── placeholders/
│
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── globals.css
│   │   ├── layout.tsx                # Root layout
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   │
│   │   ├── (marketing)/              # Public pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── careers/page.tsx
│   │   │   ├── advertise/page.tsx
│   │   │   ├── privacy-policy/page.tsx
│   │   │   ├── terms-of-service/page.tsx
│   │   │   ├── cookie-policy/page.tsx
│   │   │   ├── disclaimer/page.tsx
│   │   │   │
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [slug]/page.tsx
│   │   │   │   ├── in-[city]/page.tsx
│   │   │   │   ├── category/[slug]/page.tsx
│   │   │   │   ├── fresher/page.tsx
│   │   │   │   ├── remote/page.tsx
│   │   │   │   └── search/page.tsx
│   │   │   │
│   │   │   ├── internships/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [slug]/page.tsx
│   │   │   │   ├── in-[city]/page.tsx
│   │   │   │   ├── category/[slug]/page.tsx
│   │   │   │   ├── summer/page.tsx
│   │   │   │   ├── ppo/page.tsx
│   │   │   │   └── search/page.tsx
│   │   │   │
│   │   │   ├── companies/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [slug]/page.tsx
│   │   │   │   └── search/page.tsx
│   │   │   │
│   │   │   ├── prepare/
│   │   │   │   ├── interview-questions/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [company-slug]/page.tsx
│   │   │   │   │   └── role/[role-slug]/page.tsx
│   │   │   │   └── roadmaps/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── [slug]/page.tsx
│   │   │   │       └── [slug]/[step-slug]/page.tsx
│   │   │   │
│   │   │   ├── resume/
│   │   │   │   ├── page.tsx          # Marketing
│   │   │   │   └── templates/page.tsx
│   │   │   │
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [slug]/page.tsx
│   │   │   │   ├── category/[slug]/page.tsx
│   │   │   │   └── tag/[slug]/page.tsx
│   │   │   │
│   │   │   ├── testimonials/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── newsletter/
│   │   │       ├── subscribe/page.tsx
│   │   │       ├── confirm/[token]/page.tsx
│   │   │       └── unsubscribe/[token]/page.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   └── auth/
│   │   │       ├── login/page.tsx
│   │   │       ├── register/page.tsx
│   │   │       ├── forgot-password/page.tsx
│   │   │       ├── reset-password/[token]/page.tsx
│   │   │       └── verify-email/[token]/page.tsx
│   │   │
│   │   ├── (dashboard)/              # Student portal
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/
│   │   │       ├── page.tsx
│   │   │       ├── applications/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       ├── saved/page.tsx
│   │   │       ├── resumes/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── builder/page.tsx
│   │   │       │   ├── ats-checker/page.tsx
│   │   │       │   └── [id]/
│   │   │       │       ├── page.tsx
│   │   │       │       └── ats-reports/[reportId]/page.tsx
│   │   │       ├── profile/page.tsx
│   │   │       ├── settings/page.tsx
│   │   │       └── notifications/page.tsx
│   │   │
│   │   ├── (employer)/
│   │   │   ├── layout.tsx
│   │   │   └── employer/
│   │   │       ├── onboarding/page.tsx
│   │   │       ├── page.tsx
│   │   │       ├── company/page.tsx
│   │   │       ├── jobs/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── new/page.tsx
│   │   │       │   └── [id]/edit/page.tsx
│   │   │       ├── internships/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── new/page.tsx
│   │   │       │   └── [id]/edit/page.tsx
│   │   │       └── applications/
│   │   │           ├── page.tsx
│   │   │           └── [id]/page.tsx
│   │   │
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx
│   │   │       ├── users/page.tsx
│   │   │       ├── jobs/page.tsx
│   │   │       ├── companies/page.tsx
│   │   │       ├── blog/page.tsx
│   │   │       ├── comments/page.tsx
│   │   │       ├── newsletter/page.tsx
│   │   │       └── settings/page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── health/route.ts
│   │   │   ├── v1/
│   │   │   │   ├── jobs/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── [id]/route.ts
│   │   │   │   │   └── search/route.ts
│   │   │   │   ├── internships/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/route.ts
│   │   │   │   ├── companies/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/route.ts
│   │   │   │   ├── applications/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/route.ts
│   │   │   │   ├── resumes/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── [id]/route.ts
│   │   │   │   │   └── [id]/ats/route.ts
│   │   │   │   ├── blog/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [slug]/route.ts
│   │   │   │   ├── comments/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── interview-questions/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── roadmaps/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── newsletter/
│   │   │   │   │   ├── subscribe/route.ts
│   │   │   │   │   ├── confirm/route.ts
│   │   │   │   │   └── unsubscribe/route.ts
│   │   │   │   ├── saved-jobs/route.ts
│   │   │   │   ├── upload/route.ts       # Cloudinary signed upload
│   │   │   │   ├── search/route.ts       # Global search
│   │   │   │   └── admin/
│   │   │   │       ├── moderate/route.ts
│   │   │   │       └── analytics/route.ts
│   │   │   │
│   │   │   ├── sitemap.xml/route.ts
│   │   │   ├── sitemap-[type].xml/route.ts
│   │   │   └── revalidate/route.ts       # On-demand ISR webhook
│   │   │
│   │   └── sitemap.ts                    # Next.js metadata sitemap
│   │
│   ├── features/                       # Domain modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── actions/
│   │   │   ├── schemas/
│   │   │   └── types.ts
│   │   ├── jobs/
│   │   │   ├── components/
│   │   │   │   ├── job-card.tsx
│   │   │   │   ├── job-filters.tsx
│   │   │   │   ├── job-detail.tsx
│   │   │   │   └── apply-button.tsx
│   │   │   ├── hooks/
│   │   │   ├── actions/
│   │   │   ├── queries/
│   │   │   ├── schemas/
│   │   │   └── types.ts
│   │   ├── internships/                # Mirror jobs structure
│   │   ├── companies/
│   │   ├── applications/
│   │   ├── resumes/
│   │   │   ├── components/
│   │   │   │   ├── resume-builder/
│   │   │   │   ├── template-gallery/
│   │   │   │   └── ats-report/
│   │   │   ├── lib/
│   │   │   │   ├── ats-engine.ts
│   │   │   │   └── pdf-generator.ts
│   │   │   └── types.ts
│   │   ├── blog/
│   │   ├── interview-questions/
│   │   ├── roadmaps/
│   │   ├── newsletter/
│   │   ├── testimonials/
│   │   ├── search/
│   │   ├── employer/
│   │   ├── admin/
│   │   └── ads/                          # AdSense slot components
│   │
│   ├── shared/                           # Cross-cutting
│   │   ├── components/
│   │   │   ├── ui/                       # Shadcn components
│   │   │   ├── layout/
│   │   │   │   ├── header.tsx
│   │   │   │   ├── footer.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   └── mobile-nav.tsx
│   │   │   ├── seo/
│   │   │   │   ├── json-ld.tsx
│   │   │   │   ├── breadcrumbs.tsx
│   │   │   │   └── meta-tags.tsx
│   │   │   ├── forms/
│   │   │   ├── feedback/
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   └── empty-state.tsx
│   │   │   └── consent/
│   │   │       └── cookie-banner.tsx
│   │   ├── hooks/
│   │   │   ├── use-debounce.ts
│   │   │   ├── use-media-query.ts
│   │   │   └── use-consent.ts
│   │   ├── lib/
│   │   │   ├── db/
│   │   │   │   ├── client.ts             # Prisma/Drizzle singleton
│   │   │   │   └── read-replica.ts
│   │   │   ├── auth/
│   │   │   │   ├── config.ts             # NextAuth config
│   │   │   │   ├── session.ts
│   │   │   │   └── rbac.ts
│   │   │   ├── cache/
│   │   │   │   └── redis.ts
│   │   │   ├── storage/
│   │   │   │   └── cloudinary.ts
│   │   │   ├── email/
│   │   │   │   ├── client.ts
│   │   │   │   └── templates/
│   │   │   ├── search/
│   │   │   │   └── meilisearch.ts
│   │   │   ├── queue/
│   │   │   │   └── bullmq.ts
│   │   │   ├── rate-limit.ts
│   │   │   ├── logger.ts
│   │   │   ├── errors.ts
│   │   │   ├── api-response.ts
│   │   │   ├── slug.ts
│   │   │   ├── format.ts
│   │   │   └── constants.ts
│   │   ├── types/
│   │   │   ├── api.ts
│   │   │   ├── database.ts
│   │   │   └── global.d.ts
│   │   └── utils/
│   │       ├── cn.ts
│   │       ├── date.ts
│   │       └── validation.ts
│   │
│   ├── config/
│   │   ├── site.ts                       # Site metadata, nav links
│   │   ├── ads.ts                        # AdSense slot IDs
│   │   ├── seo.ts                        # Default SEO config
│   │   └── roles.ts                      # RBAC permissions map
│   │
│   └── middleware.ts                     # Auth, rate limit, geo headers
│
├── tests/
│   ├── unit/
│   ├── integration/
│   │   └── api/
│   └── e2e/
│       ├── playwright.config.ts
│       └── specs/
│
├── scripts/
│   ├── generate-sitemap.ts
│   ├── seed-db.ts
│   └── backup-db.sh
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml          # Local dev: postgres, redis
│   │   └── docker-compose.prod.yml
│   ├── nginx/
│   │   └── campusjobshub.conf
│   ├── systemd/
│   │   └── campusjobs.service
│   └── monitoring/
│       ├── prometheus.yml
│       └── grafana-dashboard.json
│
├── .env.example
├── .env.local                          # Gitignored
├── .eslintrc.json
├── .prettierrc
├── components.json                     # Shadcn config
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## Module Boundaries

| Layer | May Import From | Must NOT Import |
|-------|-----------------|-----------------|
| `app/` pages | `features/`, `shared/` | Other `app/` route internals |
| `features/` | `shared/`, same feature | Other features directly |
| `shared/` | npm packages only | `features/`, `app/` |
| `api/` routes | `features/`, `shared/lib` | React components |

**Cross-feature communication:** via `shared/lib/events` or API calls — never direct component imports.

---

## Naming Conventions

| Asset | Convention | Example |
|-------|------------|---------|
| Components | PascalCase | `JobCard.tsx` |
| Hooks | camelCase, `use` prefix | `useJobFilters.ts` |
| Server actions | camelCase | `submitApplication.ts` |
| API routes | kebab folders | `ats-reports/` |
| DB tables | snake_case | `blog_posts` |
| Env vars | SCREAMING_SNAKE | `DATABASE_URL` |

---

## Environment Files

```
.env.example          # Committed template
.env.local            # Local overrides (gitignored)
.env.staging          # CI/CD injected
.env.production       # CI/CD injected (secrets manager)
```

Required variables preview:

```
DATABASE_URL=
DATABASE_READ_REPLICA_URL=
REDIS_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=
MEILISEARCH_HOST=
ADSENSE_CLIENT_ID=
```
