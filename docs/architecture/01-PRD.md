# Product Requirement Document (PRD)

## CampusJobsHub

**Product:** CampusJobsHub  
**Domain:** campusjobshub.com  
**Document Owner:** Product Architecture  
**Status:** Draft v1.0  
**Target Launch:** Phase 1 MVP (Q3 2026)

---

## 1. Executive Summary

CampusJobsHub is India's premier campus career platform combining **job & internship discovery**, **AI-powered resume building**, **ATS analysis**, **placement preparation content**, and **career roadmaps** into a single SEO-optimized, AdSense-compliant experience.

The platform targets **undergraduate and postgraduate students**, **recent graduates**, and **campus recruiters** across India, with content localized for Indian hiring cycles (campus drives, off-campus, government exams context where relevant).

**North Star Metric:** Monthly Active Job Seekers who complete at least one high-intent action (apply, resume scan, or save job).

**12-Month Goal:** 500K MAU → **Long-term:** 10M MAU with sub-200ms P95 page loads on cached routes.

---

## 2. Problem Statement

| Problem | Impact |
|---------|--------|
| Job listings scattered across Naukri, LinkedIn, college portals, WhatsApp groups | Students miss opportunities; employers get low-quality applicants |
| Resume tools lack India-specific ATS context | Rejection before human review |
| Placement prep content is fragmented (YouTube, PDFs, coaching centers) | No structured, searchable, free path |
| Internship discovery is poor for Tier-2/3 colleges | Geographic and college-tier bias |
| Employers lack affordable campus-focused posting | High cost on generic job boards |

---

## 3. Goals & Non-Goals

### Goals

- Become the **default campus jobs destination** for Indian students (SEO + brand)
- Provide **end-to-end job seeker journey**: discover → prepare → apply → track
- Offer **employer self-serve** job/internship posting with application management
- Monetize via **Google AdSense** (content) + future **employer subscriptions** (Phase 3+)
- Architect for **10M MAU** with clear scale path from single VPS

### Non-Goals (Phase 1–2)

- Full applicant tracking system (ATS) for enterprises
- Video interview platform
- Payment gateway / paid job boosts (Phase 3)
- Mobile native apps (PWA first)
- International job markets (India-first)

---

## 4. User Personas

### 4.1 Priya — Final-Year B.Tech Student (Primary)

- **Age:** 21 | **Location:** Pune | **College:** Tier-2 engineering
- **Needs:** Internships → full-time roles, resume that passes TCS/Infosys ATS, interview prep
- **Pain:** Overwhelmed by irrelevant listings; resume rejected silently
- **Success:** Lands 3 relevant interviews in 60 days

### 4.2 Rahul — MBA Placement Cell Coordinator (Secondary)

- **Age:** 28 | **Role:** Posts campus drive openings for college
- **Needs:** Bulk posting, branded company pages, application export
- **Success:** 200+ student applications per drive

### 4.3 Ananya — Content & SEO Growth (Internal)

- **Role:** Editor publishing placement guides, company reviews, interview questions
- **Needs:** CMS workflow, internal linking, schema markup automation
- **Success:** 1M organic sessions/month from blog + job pages

### 4.4 Vikram — Startup Recruiter (Employer)

- **Needs:** Post 5 internships/month, filter by skills, low cost
- **Success:** 50 quality applications per posting

---

## 5. User Stories (Epics)

### Epic A — Discovery & Search

| ID | Story | Priority |
|----|-------|----------|
| A1 | As a student, I can search jobs by role, location, skills, and experience so I find relevant openings | P0 |
| A2 | As a student, I can filter internships by duration, stipend, and WFH/hybrid | P0 |
| A3 | As a guest, I can browse job listings without login (SEO pages) | P0 |
| A4 | As a student, I can save jobs and get email alerts | P1 |

### Epic B — Applications

| ID | Story | Priority |
|----|-------|----------|
| B1 | As a student, I can apply with profile + resume in one click | P0 |
| B2 | As a student, I can track application status | P1 |
| B3 | As an employer, I can view and shortlist applicants | P1 |
| B4 | As an employer, I can close/reopen listings | P0 |

### Epic C — Resume AI

| ID | Story | Priority |
|----|-------|----------|
| C1 | As a student, I can build a resume from templates | P0 |
| C2 | As a student, I can run ATS score against a job description | P0 |
| C3 | As a student, I can export PDF/DOCX | P0 |
| C4 | As a student, I can get AI suggestions for bullet improvements | P1 |

### Epic D — Placement Preparation

| ID | Story | Priority |
|----|-------|----------|
| D1 | As a student, I can browse interview questions by company/role | P0 |
| D2 | As a student, I can follow career roadmaps (DSA, System Design, etc.) | P1 |
| D3 | As a student, I can read blog guides (aptitude, HR rounds) | P0 |

### Epic E — Employer & Admin

| ID | Story | Priority |
|----|-------|----------|
| E1 | As an employer, I can register and verify company | P0 |
| E2 | As an admin, I can moderate job posts and comments | P0 |
| E3 | As an admin, I can view platform analytics | P1 |

### Epic F — Growth & Monetization

| ID | Story | Priority |
|----|-------|----------|
| F1 | As a guest, I can subscribe to newsletter by category | P0 |
| F2 | As a visitor, I see non-intrusive AdSense on content pages | P1 |
| F3 | As SEO, every job/company/blog has structured data | P0 |

---

## 6. Functional Requirements

### 6.1 Jobs Module

- CRUD for full-time job listings (employer + admin)
- Fields: title, description (rich text), company, location(s), skills[], salary range, experience, job type, application method (internal/external), expiry, status
- Slug-based public URLs: `/jobs/[slug]`
- Listing pages: `/jobs`, `/jobs/in-[city]`, `/jobs/[category]`
- Duplicate detection on title + company + location
- Soft delete with `deleted_at`

### 6.2 Internships Module

- Parallel schema to jobs with internship-specific fields: duration, stipend, PPO possibility
- URLs: `/internships/[slug]`
- Cross-link jobs ↔ internships on company pages

### 6.3 Companies Module

- Company profiles with logo (Cloudinary), description, industry, size, website, social links
- Verified badge workflow
- Aggregate: open jobs count, reviews (future), testimonials

### 6.4 Applications Module

- One application per user per job/internship (unique constraint)
- Status pipeline: `submitted → under_review → shortlisted → rejected → hired`
- Resume snapshot at apply time (immutable)
- Employer notes (private)

### 6.5 Resume AI Module

- Multiple resumes per user; one `is_primary`
- JSON-based resume builder schema (sections: experience, education, skills, projects)
- ATS report: score 0–100, keyword match, formatting issues, suggestions
- PDF generation via server-side render
- Rate limit: 5 ATS scans/day free tier

### 6.6 Content Module (Blog)

- BlogPosts with Categories, Tags, Comments
- Author attribution, reading time, featured image
- Related posts algorithm (tags + category)
- Comment moderation queue

### 6.7 Interview Questions & Roadmaps

- Structured Q&A by company, role, difficulty
- Career roadmaps as ordered step nodes with resources
- Progress tracking per user (Phase 2)

### 6.8 Newsletter

- Double opt-in subscription
- Category preferences (jobs, internships, blog, placement tips)
- Unsubscribe token (no login required)

### 6.9 Testimonials

- Student success stories with moderation
- Display on homepage and category landing pages

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | LCP < 2.5s, TTFB < 600ms (cached), P95 API < 300ms |
| Availability | 99.9% uptime (Phase 2+ multi-node) |
| Scalability | 10M MAU, 50K concurrent read peak |
| Security | OWASP Top 10 mitigations, GDPR-lite consent, India DPDP awareness |
| SEO | Indexable job/blog pages, sitemap, canonical URLs |
| Accessibility | WCAG 2.1 AA on core flows |
| i18n | English (Phase 1); Hindi UI labels (Phase 3) |
| Data retention | Applications 7 years; logs 90 days; PII export on request |

---

## 8. Success Metrics (KPIs)

| Metric | Phase 1 Target | 10M Scale Target |
|--------|----------------|------------------|
| MAU | 50K | 10M |
| Organic traffic share | 40% | 65% |
| Job applications/month | 10K | 2M |
| Resume ATS scans/month | 5K | 500K |
| Employer active listings | 500 | 50K |
| Newsletter subscribers | 10K | 2M |
| AdSense RPM | — | Optimized per vertical |
| Application completion rate | >60% | >75% |

---

## 9. Competitive Landscape

| Competitor | Strength | CampusJobsHub Differentiation |
|------------|----------|-------------------------------|
| Naukri | Scale, brand | Campus-first, free resume ATS, prep content |
| Internshala | Internships | Jobs + prep + AI resume unified |
| LinkedIn | Network | India campus SEO, no paywall for students |
| AmbitionBox | Reviews | Application + prep in same funnel |

---

## 10. Monetization Strategy

### Phase 1 — AdSense

- Display ads on blog, interview questions, roadmaps, job listing sidebars
- No ads on apply flow, resume editor, auth pages

### Phase 2 — Employer Freemium

- Free: 2 active listings
- Pro: unlimited listings, featured badge, analytics

### Phase 3 — Premium Student (Optional)

- Unlimited ATS scans, premium templates, mock interview AI

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| SEO sandbox / slow indexing | Programmatic city+role pages, structured data, fast Core Web Vitals |
| AdSense rejection | Content depth, privacy policy, consent, no thin pages |
| VPS single point of failure | Cloudflare CDN, read replicas, documented K8s migration |
| Job spam | Employer verification, rate limits, admin queue |
| AI resume cost | Cache reports, rate limits, batch processing queue |
| DPDP compliance | Consent logs, data export API, minimal PII collection |

---

## 12. Release Phases (Summary)

See [Feature Prioritization](./14-feature-prioritization.md) for full MoSCoW breakdown.

| Phase | Timeline | Focus |
|-------|----------|-------|
| Phase 1 — MVP | Months 1–3 | Jobs, internships, auth, blog, basic resume |
| Phase 2 — Growth | Months 4–6 | ATS AI, applications, employer dashboard, newsletter |
| Phase 3 — Scale | Months 7–12 | Roadmaps, interview DB, AdSense, caching layer, search |
| Phase 4 — Enterprise | Year 2+ | Multi-region, employer billing, mobile PWA, 10M path |

---

## 13. Open Questions

1. External apply redirect vs. in-platform apply default?
2. College email verification for student badge?
3. LLM provider for resume AI (OpenAI vs. self-hosted)?
4. Government job listings inclusion?
5. Hindi content generation for SEO clusters?

---

## 14. Appendix — Glossary

| Term | Definition |
|------|------------|
| ATS | Applicant Tracking System — automated resume screening |
| MAU | Monthly Active Users |
| PPO | Pre-Placement Offer |
| Campus drive | On-campus recruitment event |
| Slug | URL-safe unique identifier |
