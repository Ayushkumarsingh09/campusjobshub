# Deployment Architecture (Revised)

**Last Updated:** June 7, 2026  
**Replaces:** VPS/Docker/K8s/PM2/Nginx sections in prior docs

---

## 1. Production Topology

```mermaid
flowchart LR
    USER[Users] --> DNS[Hostinger DNS]
    DNS --> FE[Hostinger Shared Hosting<br/>Next.js Static Export]
    DNS --> API[Render Free Tier<br/>Express REST API]
    API --> DB[(Supabase PostgreSQL)]
    FE --> API
    API --> CL[Cloudinary]
    FE --> CL
    GSC[Google Search Console] --> FE
    GA4[Google Analytics 4] --> FE
```

| Layer | Service | Purpose |
|-------|---------|---------|
| Frontend | Hostinger Shared Hosting | Static Next.js 15 export (`out/`) |
| Backend | Render Free Tier | Node.js Express REST API |
| Database | Supabase PostgreSQL Free | Managed Postgres via Prisma |
| Images | Cloudinary Free | Logos, blog images, resume PDFs |
| Analytics | Google Analytics 4 | Traffic (consent-gated) |
| SEO | Google Search Console | Index monitoring |
| Ads | Google AdSense (Phase 2) | Content monetization |

---

## 2. What We Removed

| Removed | Reason |
|---------|--------|
| Hostinger VPS | User uses shared hosting |
| Docker / docker-compose | No container runtime on shared hosting |
| Kubernetes | Over-engineered for current scale |
| PM2 / Nginx / systemd | VPS-specific process management |
| Redis | Avoid extra service; use in-memory rate limit on Render |
| Meilisearch | Postgres full-text search sufficient for MVP |
| BullMQ workers | Sync processing on Render; queue later if needed |
| Read replicas | Supabase handles connection pooling |
| Multi-node load balancer | Single Render web service |

---

## 3. Frontend Deployment (Hostinger)

### Build

```bash
cd frontend
npm run build    # produces frontend/out/
```

### Upload

Upload contents of `frontend/out/` to Hostinger `public_html/` via File Manager or FTP.

### Next.js Config

- `output: 'export'` — static HTML/JS/CSS
- `images.unoptimized: true` — Cloudinary URLs used directly
- `trailingSlash: true` — shared hosting directory routing
- All data fetched client-side or at build time from Render API

### Environment (build-time)

```env
NEXT_PUBLIC_SITE_URL=https://campusjobshub.com
NEXT_PUBLIC_API_URL=https://campusjobshub-api.onrender.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud
```

### `.htaccess` (Apache on Hostinger)

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set Referrer-Policy "strict-origin-when-cross-origin"
```

---

## 4. Backend Deployment (Render)

### `render.yaml`

```yaml
services:
  - type: web
    name: campusjobshub-api
    runtime: node
    plan: free
    buildCommand: cd backend && npm install && npx prisma generate && npm run build
    startCommand: cd backend && npm run start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: DIRECT_URL
        sync: false
      - key: AUTH_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production
      - key: FRONTEND_URL
        value: https://campusjobshub.com
    healthCheckPath: /api/v1/health
```

### Cold Start Mitigation

- Render free tier sleeps after 15 min inactivity
- Frontend shows skeleton loaders on first API call
- Optional: UptimeRobot ping `/api/v1/health` every 14 min (free)

### CORS

```typescript
origin: ['https://campusjobshub.com', 'https://www.campusjobshub.com']
credentials: true
```

---

## 5. Database (Supabase)

### Connection Strings

```env
# Prisma — pooled connection (Transaction mode)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Prisma migrations — direct connection
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

### Migrations

```bash
cd backend
npx prisma migrate deploy
```

### Row Level Security

RLS disabled on Supabase — authorization handled in Express API layer.

---

## 6. Authentication (Split Deployment)

NextAuth session endpoints run on **Render backend** via Auth.js Express adapter.

Frontend uses `next-auth/react` `SessionProvider` with:

```env
NEXTAUTH_URL=https://campusjobshub.com
NEXTAUTH_SECRET=<same as backend AUTH_SECRET>
NEXT_PUBLIC_API_URL=https://campusjobshub-api.onrender.com
```

Session cookie: `SameSite=None; Secure` for cross-origin if needed, or same-site if API proxied via Hostinger subdomain `api.campusjobshub.com` → Render.

**Recommended:** `api.campusjobshub.com` CNAME → Render (avoids third-party cookie issues).

---

## 7. Search Architecture (Simplified)

- PostgreSQL `tsvector` + GIN indexes (Prisma raw queries)
- No external search service
- Frontend debounced search → `GET /api/v1/search?q=`

---

## 8. Caching (Simplified)

| Layer | Strategy |
|-------|----------|
| Hostinger | Browser cache via `_headers` or `.htaccess` for static assets |
| API | `Cache-Control` headers on public GET routes (60–300s) |
| Client | SWR / React Query stale-while-revalidate |

No Redis required.

---

## 9. Logging

| Layer | Tool |
|-------|------|
| Backend | `pino` → stdout (Render log dashboard) |
| Frontend | `console.error` + optional Sentry later |
| Audit | `audit_logs` table in Supabase |

---

## 10. Minimal Third-Party Accounts

| Required | Optional (Phase 2) |
|----------|-------------------|
| Hostinger (domain + hosting) | Google AdSense |
| Render (API) | — |
| Supabase (DB) | — |
| Cloudinary (images) | — |
| Google (GA4 + GSC) | — |

**Total: 5 accounts** for production launch.

---

## 11. Scale Path (Without VPS)

| Trigger | Action |
|---------|--------|
| Render cold starts painful | Upgrade Render to Starter ($7/mo) |
| DB connections maxed | Supabase Pro plan |
| Static build too large | ISR via Vercel migration (frontend only) |
| 100K+ MAU | Re-evaluate; current stack handles 50K MAU |

---

## 12. CI/CD (Minimal)

GitHub Actions on push to `main`:

1. Lint + typecheck frontend + backend
2. `prisma migrate deploy` on Supabase
3. Deploy backend to Render (auto-deploy webhook)
4. Build frontend static export → FTP deploy to Hostinger (or manual)
