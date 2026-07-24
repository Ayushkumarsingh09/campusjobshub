# CampusJobsHub — Step-by-Step Hosting Guide

Deploy in this order: **Supabase → Render (API) → Hostinger (frontend)**.

Estimated time: 2–4 hours (first time).

---

## What you need before starting

| Account | Purpose | Cost |
|---------|---------|------|
| [Supabase](https://supabase.com) | PostgreSQL database | Free tier OK |
| [Render](https://render.com) | Backend API | Free tier OK |
| [Hostinger](https://hostinger.com) | Static website hosting | Your plan |
| [Cloudinary](https://cloudinary.com) | CMS media uploads | Free tier OK |
| Domain `campusjobshub.com` | Pointed to Hostinger | Already owned |
| GitHub repo | Render deploys from Git | Free |

---

## Phase 1 — Supabase (Database)

### 1.1 Create project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Choose region closest to India (e.g. Mumbai / Singapore)
3. Set a strong database password — **save it**

### 1.2 Get connection strings

Project → **Settings** → **Database** → **Connection string**

Copy two URLs:

| Variable | Connection type | Port |
|----------|-----------------|------|
| `DATABASE_URL` | **Transaction pooler** (Session mode) | **6543** |
| `DIRECT_URL` | **Direct connection** | **5432** |

Append to pooled URL if missing: `?pgbouncer=true`

Example shape:
```
DATABASE_URL=postgresql://postgres.xxxx:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxxx:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

### 1.3 Push schema & seed (from your PC)

Create `backend/.env.production` (do not commit):

```env
DATABASE_URL=<your pooled URL>
DIRECT_URL=<your direct URL>
AUTH_SECRET=<generate 32+ random chars — save this>
FRONTEND_URL=https://campusjobshub.com
NODE_ENV=production
```

Run locally (PowerShell):

```powershell
cd C:\Users\ayush\OneDrive\Desktop\cursor\campusjobs

# Temporarily use production DB
$env:DATABASE_URL="<pooled URL>"
$env:DIRECT_URL="<direct URL>"

npm run db:push
npm run db:seed
npm run logos:generate
```

You should see: 25 companies, 100 jobs, 50 internships, 55 blogs seeded.

---

## Phase 2 — Render (Backend API)

### 2.1 Push code to GitHub

```powershell
git init
git add .
git commit -m "Initial production deploy"
git remote add origin https://github.com/YOUR_USERNAME/campusjobshub.git
git push -u origin main
```

### 2.2 Create Render Web Service

1. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**
2. Connect your GitHub repo
3. Settings:

| Field | Value |
|-------|-------|
| Name | `campusjobshub-api` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install && npx prisma generate && npm run build` |
| Start Command | `npm run start` |
| Plan | Free |

Or use **Blueprint** → point to `backend/render.yaml` in repo.

### 2.3 Set environment variables (Render → Environment)

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Supabase pooled URL |
| `DIRECT_URL` | Supabase direct URL |
| `AUTH_SECRET` | Same secret as Phase 1 |
| `FRONTEND_URL` | `https://campusjobshub.com` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary |
| `CLOUDINARY_API_SECRET` | From Cloudinary |

Click **Save** → Render redeploys.

### 2.4 Verify API

After deploy (2–5 min), open:

```
https://campusjobshub-api.onrender.com/api/v1/health
```

Expected: `{"success":true,...}`

Also test:
```
https://campusjobshub-api.onrender.com/api/v1/jobs?page=1&limit=3
```

### 2.5 Custom domain `api.campusjobshub.com`

1. Render → your service → **Settings** → **Custom Domains**
2. Add `api.campusjobshub.com`
3. Render shows a CNAME target (e.g. `campusjobshub-api.onrender.com`)
4. In Hostinger DNS (or domain registrar):

| Type | Name | Value |
|------|------|-------|
| CNAME | `api` | `<render-hostname>.onrender.com` |

Wait 15–60 min for DNS. Then test:
```
https://api.campusjobshub.com/api/v1/health
```

---

## Phase 3 — Build frontend (static export)

**Important:** Build only after the API is live and seeded — static pages are generated from API data.

Create `frontend/.env.production`:

```env
STATIC_EXPORT=true
NEXT_PUBLIC_SITE_URL=https://campusjobshub.com
NEXT_PUBLIC_API_URL=https://api.campusjobshub.com
NEXT_PUBLIC_ENABLE_ADS=false
AUTH_SECRET=<same as backend>
NEXTAUTH_SECRET=<same as backend>
NEXTAUTH_URL=https://campusjobshub.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your cloud name>
```

Build (PowerShell):

```powershell
cd frontend

$env:STATIC_EXPORT="true"
$env:NEXT_PUBLIC_SITE_URL="https://campusjobshub.com"
$env:NEXT_PUBLIC_API_URL="https://api.campusjobshub.com"
$env:NEXT_PUBLIC_ENABLE_ADS="false"
$env:AUTH_SECRET="<your secret>"
$env:NEXTAUTH_SECRET="<your secret>"
$env:NEXTAUTH_URL="https://campusjobshub.com"

npm run build
```

Output folder: `frontend/out/`

Verify locally before upload:
```powershell
npx serve out
# Open http://localhost:3000 — jobs/companies should load from production API
```

---

## Phase 4 — Hostinger (Frontend)

### 4.1 DNS for main domain

In Hostinger → **Domains** → **DNS / Nameservers**:

| Type | Name | Value |
|------|------|-------|
| A | `@` | Hostinger server IP (from hPanel) |
| CNAME | `www` | `campusjobshub.com` |

### 4.2 Upload files

1. Hostinger hPanel → **Files** → **File Manager**
2. Open `public_html/`
3. **Delete** default files (or backup first)
4. Upload **all contents** of `frontend/out/` into `public_html/`
5. Confirm `.htaccess` is present (from `frontend/public/.htaccess` — copied into `out/` on build)

### 4.3 Enable SSL

Hostinger → **SSL** → Enable free SSL for `campusjobshub.com` and `www`

---

## Phase 5 — Post-deploy checks

```powershell
# From project root (replace URLs if needed)
$env:NEXT_PUBLIC_API_URL="https://api.campusjobshub.com"
$env:NEXT_PUBLIC_SITE_URL="https://campusjobshub.com"
npm run smoke-test
npm run smoke-test:auth
```

### Manual checklist

- [ ] https://campusjobshub.com loads
- [ ] https://campusjobshub.com/jobs shows listings
- [ ] https://campusjobshub.com/companies works
- [ ] https://campusjobshub.com/blog articles render (not raw markdown)
- [ ] Login at `/auth/login` with `superadmin@campusjobshub.com` / `Password123`
- [ ] CMS at `/admin` works after login
- [ ] Change super admin password in production!

---

## Updating the site later

### Content/API changes only
Push to GitHub → Render auto-redeploys.

### Frontend changes
```powershell
cd frontend
# set production env vars (see Phase 3)
npm run build
# re-upload frontend/out/ to Hostinger public_html
```

### Database changes
```powershell
$env:DATABASE_URL="<pooled>"
$env:DIRECT_URL="<direct>"
npm run db:push
# npm run db:seed  # only if you want to refresh demo data
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Companies/jobs "Failed to fetch" | Check `NEXT_PUBLIC_API_URL` was set **at build time**. Rebuild frontend. |
| Login works locally but not live | `AUTH_SECRET` must match on backend + frontend build. `FRONTEND_URL` must be `https://campusjobshub.com`. |
| API 502 / slow first request | Render free tier cold-starts (~30s). Upgrade or use uptime ping. |
| CORS error | Set `FRONTEND_URL=https://campusjobshub.com` on Render (exact, no trailing slash). |
| Admin 404 on subpages | Ensure full `out/` uploaded; `.htaccess` present. |
| Images broken | Logos are in `/logos/` inside `out/`. Re-run `npm run logos:generate` before build. |
| Blog shows `#` markdown | Rebuild frontend after latest code (markdown renderer added). |

---

## Security before going public

1. Change all seed passwords (`superadmin@`, `admin@`, etc.)
2. Generate new `AUTH_SECRET` (32+ chars): `openssl rand -base64 32`
3. Keep `NEXT_PUBLIC_ENABLE_ADS=false` until AdSense approves
4. Enable Supabase **database backups** in project settings

---

## Quick reference

| Service | URL |
|---------|-----|
| Website | https://campusjobshub.com |
| API | https://api.campusjobshub.com |
| CMS | https://campusjobshub.com/admin |
| API health | https://api.campusjobshub.com/api/v1/health |
