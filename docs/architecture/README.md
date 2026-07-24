# CampusJobsHub — Architecture Documentation

**Domain:** [campusjobshub.com](https://campusjobshub.com)  
**Version:** 1.0  
**Last Updated:** June 7, 2026  
**Target Scale:** 10M monthly active users (MAU)

---

## Document Index

| # | Document | Description |
|---|----------|-------------|
| 1 | [PRD](./01-PRD.md) | Product Requirement Document |
| 2 | [Information Architecture](./02-information-architecture.md) | Content taxonomy, navigation, mental models |
| 3 | [Sitemap](./03-sitemap.md) | Full URL hierarchy and route map |
| 4 | [User Flows](./04-user-flows.md) | Journey diagrams for all personas |
| 5 | [Database Design](./05-database-design.md) | Schema rationale, indexes, constraints |
| 6 | [ER Diagrams](./06-er-diagrams.md) | Entity-relationship visualizations |
| 7 | [Folder Structure](./07-folder-structure.md) | Enterprise monorepo layout |
| 8 | [API Architecture](./08-api-architecture.md) | REST design, versioning, contracts |
| 9 | [Authentication](./09-authentication-architecture.md) | NextAuth flows, RBAC, sessions |
| 10 | [SEO Architecture](./10-seo-architecture.md) | Technical SEO, schema, crawl strategy |
| 11 | [AdSense Compliance](./11-adsense-architecture.md) | Ad placement, policy, consent |
| 12 | [Security](./12-security-architecture.md) | Threat model, controls, compliance |
| 13 | [Scalability](./13-scalability-architecture.md) | 10M MAU infrastructure plan |
| 14 | [Feature Prioritization](./14-feature-prioritization.md) | MoSCoW roadmap by phase |
| 15 | [Deployment Architecture](./15-deployment-architecture.md) | Hostinger + Render + Supabase |

## Database Schema (Executable DDL)

- [schema.sql](../../database/schema.sql) — PostgreSQL DDL with indexes, constraints, triggers

## Quick Reference

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion |
| Backend | Next.js API Routes (App Router) |
| Database | PostgreSQL 16+ |
| Auth | NextAuth.js v5 (Auth.js) |
| Storage | Cloudinary |
| Deployment | Hostinger VPS → multi-node cluster (scale path) |

### Personas

1. **Student / Job Seeker** — Browse jobs, apply, build resume, prep for placements
2. **Employer / Recruiter** — Post jobs/internships, manage applications
3. **Content Editor** — Blog, career guides, interview questions
4. **Admin** — Moderation, analytics, platform config
5. **Guest** — SEO landing, newsletter, limited browse

### Core Value Proposition

> India's unified platform for campus hiring — jobs, internships, AI resume optimization, ATS scoring, and placement preparation in one destination.
