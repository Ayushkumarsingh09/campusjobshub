# CampusJobsHub — Production Deployment Guide

## Architecture

| Component | Provider | URL |
|-----------|----------|-----|
| Frontend (static) | Hostinger Shared Hosting | `https://campusjobshub.com` |
| Backend API | Render Free Tier | `https://api.campusjobshub.com` |
| Database | Supabase PostgreSQL | Pooled + direct URLs |
| Media | Cloudinary | CDN delivery |

---

## Environment Variable Checklist

### Backend (Render)

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | Supabase **pooled** connection (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Yes | Supabase **direct** connection (port 5432) for migrations |
| `AUTH_SECRET` | Yes | Min 32 random chars; must match frontend |
| `FRONTEND_URL` | Yes | `https://campusjobshub.com` |
| `NODE_ENV` | Yes | `production` |
| `PORT` | Auto | Render sets automatically |
| `CLOUDINARY_CLOUD_NAME` | Yes | For media uploads |
| `CLOUDINARY_API_KEY` | Yes | |
| `CLOUDINARY_API_SECRET` | Yes | |
| `LOG_LEVEL` | No | Default `info` |

### Frontend (Hostinger / build-time)

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://campusjobshub.com` |
| `NEXT_PUBLIC_API_URL` | Yes | `https://api.campusjobshub.com` |
| `AUTH_SECRET` | Yes | Same as backend |
| `NEXTAUTH_SECRET` | Yes | Same as `AUTH_SECRET` |
| `NEXTAUTH_URL` | Yes | `https://campusjobshub.com` |
| `STATIC_EXPORT` | Yes | `true` for Hostinger static export |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No | Image URLs |

---

## Build Commands

```bash
# Install
npm install

# Database (run from CI or local with DIRECT_URL)
npm run db:push
npm run db:seed

# Backend
cd backend && npm run build
# Start: node dist/index.js (Render uses render.yaml)

# Frontend static export
cd frontend
STATIC_EXPORT=true npm run build
# Output: frontend/out/
```

---

## DNS Setup

| Record | Type | Value |
|--------|------|-------|
| `@` | A | Hostinger server IP |
| `www` | CNAME | `campusjobshub.com` |
| `api` | CNAME | `<your-service>.onrender.com` |

### api.campusjobshub.com on Render

1. Create Web Service from `backend/render.yaml`
2. Render Dashboard → Settings → Custom Domains → Add `api.campusjobshub.com`
3. Add CNAME at DNS provider pointing to Render hostname
4. Enable HTTPS (automatic on Render)

---

## Deployment Checklist

- [ ] Supabase project created; connection strings copied
- [ ] `npm run db:push && npm run db:seed` against production DB
- [ ] `AUTH_SECRET` generated (32+ chars) and set on Render + build env
- [ ] Render service deployed and health check passes: `GET /api/v1/health`
- [ ] CORS `FRONTEND_URL` matches production domain
- [ ] Frontend built with `STATIC_EXPORT=true`
- [ ] `frontend/out/` uploaded to Hostinger `public_html/`
- [ ] `.htaccess` copied for SPA/static routing
- [ ] DNS propagated (check `dig api.campusjobshub.com`)
- [ ] Cookie login tested on production domain
- [ ] Admin login tested (`superadmin@campusjobshub.com`)
- [ ] Google Search Console sitemap submitted
- [ ] Google Analytics receiving events

---

## Rollback Strategy

1. **Frontend:** Keep previous `out/` zip on Hostinger; restore via File Manager
2. **Backend:** Render → Deploys → Rollback to last successful deploy
3. **Database:** Supabase Point-in-Time Recovery (paid plan) or restore from manual dump

```bash
# Manual DB backup before major releases
pg_dump "$DIRECT_URL" -Fc -f backup-$(date +%Y%m%d).dump
```

---

## Backup Strategy

| Asset | Frequency | Method |
|-------|-----------|--------|
| PostgreSQL | Daily | Supabase automated backups (enable on project) |
| Media | Continuous | Cloudinary versioning |
| Code | Every commit | GitHub |
| Env secrets | On change | Password manager / Render env export |

---

## Local Development

```bash
# Start Postgres (requires Docker Desktop running)
# Uses host port 5433 to avoid conflicts with existing Windows Postgres on 5432
docker compose up -d

# backend/.env (local):
# DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5433/campusjobshub
# DIRECT_URL=postgresql://postgres:postgres@127.0.0.1:5433/campusjobshub

npm run db:push
npm run db:seed
npm run dev

# If next dev hangs (common on OneDrive paths), use production mode locally:
npm run build --workspace=frontend
npm run start --workspace=frontend

# Automated audit (38 checks)
npm run smoke-test
npm run smoke-test:auth
npm run audit:production
```
