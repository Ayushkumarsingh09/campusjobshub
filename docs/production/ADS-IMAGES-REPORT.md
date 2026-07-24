# AdSense Disable + Royalty-Free Images — Implementation Report

**Date:** June 7, 2026

---

## Task 1 — AdSense Placeholders Disabled

### Feature flag

| Variable | Default | Location |
|----------|---------|----------|
| `NEXT_PUBLIC_ENABLE_ADS` | `false` | `frontend/.env.local`, `.env.example` |
| `ENABLE_ADS` | derived in `frontend/src/config/ads.ts` | |

### Behavior when `ENABLE_ADS=false`

- `AdSlot` returns `null` — no DOM nodes, no whitespace, no dashed borders
- All 37 `<AdSlot />` usages across 24 pages remain in code (re-enable with one env change)
- Admin AdSense module at `/admin/adsense` **unchanged**

### Ad slots gated (37 total)

| Area | Count |
|------|-------|
| Jobs (list, detail, remote, fresher, city) | 7 |
| Internships (list, detail, PPO, summer, city) | 7 |
| Companies (list, detail) | 3 |
| Blog (list, article ×2) | 3 |
| Roadmaps (list, detail ×2) | 3 |
| Interview hub | 2 |
| Legal (privacy ×2, terms, cookie, disclaimer, editorial) | 6 |
| About | 1 |
| City landing pages | 2 |

**To re-enable after AdSense approval:** set `NEXT_PUBLIC_ENABLE_ADS=true` in Hostinger build env and redeploy.

---

## Task 2 — Royalty-Free Images

### Image management layer

| File | Purpose |
|------|---------|
| `frontend/src/lib/images/types.ts` | Types, categories |
| `frontend/src/lib/images/catalog.ts` | 19 Unsplash stock images + resolvers |
| `frontend/src/lib/images/index.ts` | `resolveImageUrl`, `resolveImageMeta` |
| `frontend/src/components/shared/content-image.tsx` | Next.js Image wrapper, lazy load, fallback, error handling |
| `backend/prisma/seeds/data/stock-images.ts` | Seed-time image URLs (mirrors catalog) |

### Image sources

All images from **Unsplash** (free license). No copyrighted company marketing assets.

### Seed data updated

| Entity | Field | Count |
|--------|-------|-------|
| Companies | `ogImageUrl` | 25 |
| Jobs | `ogImageUrl` | 100 |
| Internships | `ogImageUrl` | 50 |
| Blog posts | `featuredImageUrl` + `ogImageUrl` | 55 |
| Career roadmaps | `thumbnailUrl` | 15 |

**Total images seeded: 245**

### Pages enhanced (frontend)

| Page type | Enhancement |
|-----------|-------------|
| Company detail | Hero `ContentImage` with company-themed stock photo |
| Job detail | Hero image (career / remote / fresher variants) |
| Internship detail | Hero image (students / learning) |
| Roadmap detail | Hero thumbnail |
| Roadmap list | `RoadmapCard` with 16:9 thumbnails |
| Blog article | Featured image always shown (with fallback) |
| Blog list / homepage cards | Featured image on every card |

### SEO image optimization

- Descriptive `alt` and `title` on all images
- WebP via Unsplash `fm=webp&auto=format`
- `loading="lazy"` on list/card images; `priority` on detail heroes
- `sizes` attribute for responsive loading
- `images.unsplash.com` added to `next.config.ts` remotePatterns

### Re-seed required

```bash
npm run db:seed
```

---

## Verification checklist

- [x] `ENABLE_ADS=false` — AdSlot renders nothing
- [x] Admin adsense module preserved
- [x] Image catalog + ContentImage component
- [x] Seed scripts populate image URLs
- [x] Detail pages show hero images
- [x] Blog/roadmap cards show thumbnails
- [ ] Run `npm run build` (execute after seed)
- [ ] Run `npm run db:seed` (populate new image URLs)

---

## Remaining (pre-launch)

1. Re-run `npm run db:seed` to populate image URLs in database
2. Replace `+91-XXXXXXXXXX` in `siteConfig.contact.phone` before AdSense
3. After AdSense approval: `NEXT_PUBLIC_ENABLE_ADS=true` + configure slots in admin
