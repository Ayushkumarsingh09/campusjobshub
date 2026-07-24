# Database Design

## 1. Overview

**Engine:** PostgreSQL 16+  
**ORM (planned):** Prisma or Drizzle  
**Naming:** `snake_case` tables/columns; UUID primary keys for distributed safety  
**Timestamps:** All core tables include `created_at`, `updated_at`; soft deletes via `deleted_at` where noted

### Design Goals for 10M MAU

- UUID v7 (time-sortable) for insert performance vs random UUID v4
- Partitioning on high-volume tables (`applications`, `ats_reports`, `audit_logs`)
- Read replicas for listing/search queries
- Denormalized counters (`application_count`, `view_count`) with async reconciliation
- Full-text search via `tsvector` columns + future Meilisearch sync
- Connection pooling via PgBouncer (transaction mode)

---

## 2. Entity Summary

| Table | Est. Rows @ 10M MAU | Partitioned | Notes |
|-------|---------------------|-------------|-------|
| users | 8M | No | Includes students, employers, admins |
| companies | 100K | No | Verified employer orgs |
| jobs | 500K active | No | Archive to `jobs_archive` |
| internships | 300K active | No | Parallel to jobs |
| applications | 50M+ | Yes (monthly) | Highest write volume |
| blog_posts | 50K | No | Content |
| categories | 500 | No | Shared taxonomy |
| tags | 10K | No | Shared taxonomy |
| comments | 5M | Yes (yearly) | Blog moderation |
| resumes | 15M | No | JSON document storage |
| ats_reports | 30M | Yes (monthly) | Heavy reads |
| interview_questions | 100K | No | Prep content |
| career_roadmaps | 500 | No | With steps child table |
| testimonials | 10K | No | Marketing |
| newsletter_subscribers | 5M | No | Email list |

---

## 3. Core Tables — Detailed Spec

### 3.1 `users`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default `gen_random_uuid()` |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| email_verified_at | TIMESTAMPTZ | NULL |
| password_hash | VARCHAR(255) | NULL (OAuth-only users) |
| name | VARCHAR(150) | NOT NULL |
| role | user_role ENUM | NOT NULL, default `student` |
| avatar_url | TEXT | NULL |
| phone | VARCHAR(20) | NULL |
| college | VARCHAR(200) | NULL |
| graduation_year | SMALLINT | NULL |
| bio | TEXT | NULL |
| profile_completion | SMALLINT | 0–100 |
| is_active | BOOLEAN | default true |
| last_login_at | TIMESTAMPTZ | NULL |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |
| deleted_at | TIMESTAMPTZ | NULL |

**Indexes:** `UNIQUE(email) WHERE deleted_at IS NULL`, `idx_users_role`, `idx_users_created_at`

**Roles enum:** `student`, `employer`, `editor`, `admin`

---

### 3.2 `companies`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| slug | VARCHAR(200) | UNIQUE, NOT NULL |
| name | VARCHAR(200) | NOT NULL |
| description | TEXT | NULL |
| logo_url | TEXT | NULL (Cloudinary) |
| website | VARCHAR(500) | NULL |
| industry | VARCHAR(100) | NULL |
| company_size | company_size_enum | NULL |
| headquarters_city | VARCHAR(100) | NULL |
| headquarters_state | VARCHAR(100) | NULL |
| is_verified | BOOLEAN | default false |
| verified_at | TIMESTAMPTZ | NULL |
| owner_user_id | UUID | FK → users.id |
| job_count | INTEGER | default 0 (denormalized) |
| internship_count | INTEGER | default 0 |
| created_at, updated_at, deleted_at | TIMESTAMPTZ | — |

**Indexes:** `UNIQUE(slug)`, `idx_companies_verified`, `idx_companies_owner`, GIN on `name` for search

---

### 3.3 `jobs`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| slug | VARCHAR(250) | UNIQUE, NOT NULL |
| title | VARCHAR(300) | NOT NULL |
| description | TEXT | NOT NULL |
| company_id | UUID | FK → companies.id, NOT NULL |
| category_id | UUID | FK → categories.id |
| posted_by_user_id | UUID | FK → users.id |
| location_city | VARCHAR(100) | NULL |
| location_state | VARCHAR(100) | NULL |
| is_remote | BOOLEAN | default false |
| experience_min | SMALLINT | default 0 |
| experience_max | SMALLINT | NULL |
| salary_min | INTEGER | NULL (INR annual) |
| salary_max | INTEGER | NULL |
| salary_disclosed | BOOLEAN | default true |
| employment_type | employment_type_enum | NOT NULL |
| skills | TEXT[] | GIN index |
| application_method | application_method_enum | `internal` / `external` |
| external_apply_url | TEXT | NULL |
| status | listing_status_enum | `draft`, `pending_review`, `active`, `closed`, `expired` |
| view_count | INTEGER | default 0 |
| application_count | INTEGER | default 0 |
| expires_at | TIMESTAMPTZ | NOT NULL |
| published_at | TIMESTAMPTZ | NULL |
| search_vector | TSVECTOR | Generated/stored |
| created_at, updated_at, deleted_at | TIMESTAMPTZ | — |

**Indexes:**
- `idx_jobs_status_expires` (status, expires_at) — listing queries
- `idx_jobs_company_status`
- `idx_jobs_location` (location_city, location_state)
- `idx_jobs_category`
- `GIN(skills)`, `GIN(search_vector)`
- `idx_jobs_published_at DESC`

---

### 3.4 `internships`

Mirrors `jobs` with additional columns:

| Column | Type | Notes |
|--------|------|-------|
| duration_months | SMALLINT | 1–12 |
| stipend_min | INTEGER | INR/month |
| stipend_max | INTEGER | |
| is_paid | BOOLEAN | |
| ppo_available | BOOLEAN | Pre-placement offer |
| start_date | DATE | NULL |

Same indexing strategy as `jobs`.

---

### 3.5 `applications`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| job_id | UUID | FK → jobs.id, NULL |
| internship_id | UUID | FK → internships.id, NULL |
| resume_id | UUID | FK → resumes.id |
| resume_snapshot | JSONB | Immutable copy at apply time |
| cover_letter | TEXT | NULL |
| status | application_status_enum | NOT NULL |
| employer_notes | TEXT | NULL (private) |
| applied_at | TIMESTAMPTZ | NOT NULL |
| status_changed_at | TIMESTAMPTZ | |
| created_at, updated_at | TIMESTAMPTZ | — |

**Constraints:**
- `CHECK (job_id IS NOT NULL OR internship_id IS NOT NULL)`
- `CHECK (NOT (job_id IS NOT NULL AND internship_id IS NOT NULL))`
- `UNIQUE(user_id, job_id) WHERE job_id IS NOT NULL`
- `UNIQUE(user_id, internship_id) WHERE internship_id IS NOT NULL`

**Partitioning:** `RANGE(applied_at)` monthly partitions

**Indexes:** `idx_applications_user`, `idx_applications_job_status`, `idx_applications_internship_status`

---

### 3.6 `blog_posts`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| slug | VARCHAR(250) | UNIQUE |
| title | VARCHAR(300) | NOT NULL |
| excerpt | TEXT | |
| content | TEXT | NOT NULL |
| featured_image_url | TEXT | |
| author_id | UUID | FK → users.id |
| category_id | UUID | FK → categories.id |
| status | content_status_enum | `draft`, `published`, `archived` |
| reading_time_minutes | SMALLINT | |
| view_count | INTEGER | default 0 |
| published_at | TIMESTAMPTZ | NULL |
| search_vector | TSVECTOR | |
| meta_title | VARCHAR(70) | SEO |
| meta_description | VARCHAR(160) | SEO |
| created_at, updated_at, deleted_at | TIMESTAMPTZ | — |

---

### 3.7 `categories`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| slug | VARCHAR(100) | UNIQUE |
| name | VARCHAR(150) | NOT NULL |
| description | TEXT | |
| parent_id | UUID | FK → categories.id (self-ref) |
| type | category_type_enum | `job`, `blog`, `both` |
| sort_order | INTEGER | default 0 |
| created_at, updated_at | TIMESTAMPTZ | — |

---

### 3.8 `tags`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| slug | VARCHAR(100) | UNIQUE |
| name | VARCHAR(100) | NOT NULL |
| usage_count | INTEGER | default 0 |
| created_at | TIMESTAMPTZ | — |

**Junction tables:** `blog_post_tags`, `job_tags`, `internship_tags`, `interview_question_tags`

---

### 3.9 `comments`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| blog_post_id | UUID | FK → blog_posts.id |
| user_id | UUID | FK → users.id |
| parent_id | UUID | FK → comments.id (threading) |
| content | TEXT | NOT NULL |
| status | comment_status_enum | `pending`, `approved`, `spam`, `deleted` |
| created_at, updated_at | TIMESTAMPTZ | — |

**Partitioning:** yearly by `created_at`

---

### 3.10 `resumes`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| title | VARCHAR(150) | e.g., "SDE Resume 2026" |
| template_id | VARCHAR(50) | |
| content | JSONB | Structured resume data |
| pdf_url | TEXT | Cloudinary URL |
| is_primary | BOOLEAN | default false |
| version | INTEGER | default 1 |
| created_at, updated_at, deleted_at | TIMESTAMPTZ | — |

**Constraint:** One primary per user via partial unique index  
`UNIQUE(user_id) WHERE is_primary = true AND deleted_at IS NULL`

---

### 3.11 `ats_reports`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| resume_id | UUID | FK → resumes.id |
| user_id | UUID | FK → users.id |
| job_id | UUID | FK → jobs.id, NULL |
| job_description_text | TEXT | NULL |
| overall_score | SMALLINT | 0–100 |
| keyword_score | SMALLINT | |
| formatting_score | SMALLINT | |
| match_details | JSONB | keywords matched/missing |
| suggestions | JSONB | AI suggestions array |
| model_version | VARCHAR(50) | |
| created_at | TIMESTAMPTZ | — |

**Partitioning:** monthly by `created_at`  
**Index:** `idx_ats_reports_user_created`

---

### 3.12 `interview_questions`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| slug | VARCHAR(250) | UNIQUE |
| question | TEXT | NOT NULL |
| answer | TEXT | NOT NULL |
| company_id | UUID | FK → companies.id, NULL |
| role | VARCHAR(100) | |
| difficulty | difficulty_enum | easy, medium, hard |
| topic | VARCHAR(100) | DSA, HR, SQL, etc. |
| view_count | INTEGER | default 0 |
| is_published | BOOLEAN | default true |
| created_at, updated_at | TIMESTAMPTZ | — |

---

### 3.13 `career_roadmaps` + `roadmap_steps`

**career_roadmaps:**

| Column | Type |
|--------|------|
| id, slug, title, description, difficulty, estimated_hours |
| thumbnail_url, is_published, view_count |
| created_at, updated_at |

**roadmap_steps:**

| Column | Type |
|--------|------|
| id, roadmap_id (FK), slug, title, description |
| step_order, resource_url, resource_type |
| estimated_hours, created_at, updated_at |

**UNIQUE(roadmap_id, step_order)**

---

### 3.14 `testimonials`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| slug | VARCHAR(200) | UNIQUE |
| name | VARCHAR(150) | |
| college | VARCHAR(200) | |
| company_placed | VARCHAR(200) | |
| role_placed | VARCHAR(150) | |
| quote | TEXT | NOT NULL |
| avatar_url | TEXT | |
| rating | SMALLINT | 1–5 |
| is_featured | BOOLEAN | default false |
| is_published | BOOLEAN | default false |
| created_at, updated_at | TIMESTAMPTZ | — |

---

### 3.15 `newsletter_subscribers`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| status | subscriber_status_enum | `pending`, `active`, `unsubscribed`, `bounced` |
| preferences | JSONB | `{jobs: true, blog: true, ...}` |
| confirm_token | VARCHAR(64) | UNIQUE |
| unsubscribe_token | VARCHAR(64) | UNIQUE |
| confirmed_at | TIMESTAMPTZ | NULL |
| unsubscribed_at | TIMESTAMPTZ | NULL |
| source | VARCHAR(50) | footer, blog, popup |
| created_at, updated_at | TIMESTAMPTZ | — |

---

## 4. Supporting Tables

### 4.1 NextAuth Tables

- `accounts` — OAuth provider linkage
- `sessions` — database sessions (optional; prefer JWT)
- `verification_tokens` — email verify, password reset

### 4.2 Junction / Feature Tables

| Table | Purpose |
|-------|---------|
| `saved_jobs` | user_id + job_id OR internship_id |
| `job_tags` | jobs ↔ tags |
| `blog_post_tags` | blog ↔ tags |
| `company_users` | multi-user employer access (Phase 2) |
| `user_skills` | profile skills |
| `audit_logs` | admin actions (partitioned) |
| `rate_limits` | API throttling counters |
| `consent_logs` | GDPR/DPDP consent records |

---

## 5. Constraints & Business Rules

```sql
-- Salary sanity
ALTER TABLE jobs ADD CONSTRAINT chk_salary_range
  CHECK (salary_max IS NULL OR salary_min IS NULL OR salary_max >= salary_min);

-- Experience sanity
ALTER TABLE jobs ADD CONSTRAINT chk_experience_range
  CHECK (experience_max IS NULL OR experience_max >= experience_min);

-- Application target
ALTER TABLE applications ADD CONSTRAINT chk_application_target
  CHECK (
    (job_id IS NOT NULL AND internship_id IS NULL) OR
    (job_id IS NULL AND internship_id IS NOT NULL)
  );
```

---

## 6. Indexing Strategy

### Hot Query Patterns

| Query | Index |
|-------|-------|
| Active jobs by city | `(status, location_city, published_at DESC)` |
| Jobs by company | `(company_id, status)` |
| User applications | `(user_id, applied_at DESC)` |
| Employer inbox | `(job_id, status)` via applications |
| Blog by category | `(category_id, published_at DESC)` |
| Full-text job search | GIN `search_vector` |
| Slug lookups | UNIQUE on all slug columns |

### Partial Indexes

```sql
CREATE INDEX idx_jobs_active ON jobs (published_at DESC)
  WHERE status = 'active' AND deleted_at IS NULL;

CREATE INDEX idx_internships_active ON internships (published_at DESC)
  WHERE status = 'active' AND deleted_at IS NULL;
```

---

## 7. Triggers & Async Jobs

| Trigger / Job | Action |
|---------------|--------|
| `on_application_insert` | Increment `jobs.application_count` |
| `on_job_publish` | Regenerate `search_vector`, enqueue sitemap |
| `on_comment_insert` | Set status `pending` if links detected |
| Nightly cron | Expire jobs past `expires_at` |
| Nightly cron | Reconcile denormalized counters |
| Hourly | Sync jobs to Meilisearch (Phase 3) |

---

## 8. Caching Layer (Redis)

| Key Pattern | TTL | Data |
|-------------|-----|------|
| `job:{slug}` | 5 min | Serialized job detail |
| `jobs:list:{hash}` | 2 min | Filtered listing page |
| `company:{slug}` | 10 min | Company + job count |
| `blog:{slug}` | 15 min | Post content |
| `user:session:{id}` | session | Role + permissions |
| `rate:ats:{userId}` | 24h | Daily scan count |

---

## 9. Backup & DR

| Policy | Setting |
|--------|---------|
| Full backup | Daily 02:00 IST |
| WAL archiving | Continuous to object storage |
| Retention | 30 days hot, 1 year cold |
| RPO | < 5 minutes |
| RTO | < 1 hour (runbook) |
| Test restore | Monthly |

---

## 10. Migration Strategy

1. **v1.0** — Core tables (users, companies, jobs, internships, applications)
2. **v1.1** — Content (blog, categories, tags, comments)
3. **v1.2** — Resume + ATS
4. **v1.3** — Interview questions, roadmaps, testimonials, newsletter
5. **v2.0** — Partition applications + ats_reports; read replica

Executable DDL: [`database/schema.sql`](../../database/schema.sql)
