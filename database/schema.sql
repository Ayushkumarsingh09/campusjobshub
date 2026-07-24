-- ============================================================================
-- CampusJobsHub — PostgreSQL Schema
-- Version: 1.0.0
-- Target: PostgreSQL 16+
-- Scale: Designed for 10M MAU with partitioning & read replica support
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('student', 'employer', 'editor', 'admin');

CREATE TYPE company_size AS ENUM (
  '1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'
);

CREATE TYPE employment_type AS ENUM (
  'full_time', 'part_time', 'contract', 'freelance', 'temporary'
);

CREATE TYPE application_method AS ENUM ('internal', 'external');

CREATE TYPE listing_status AS ENUM (
  'draft', 'pending_review', 'active', 'closed', 'expired'
);

CREATE TYPE application_status AS ENUM (
  'submitted', 'under_review', 'shortlisted', 'rejected', 'hired', 'withdrawn'
);

CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

CREATE TYPE category_type AS ENUM ('job', 'blog', 'both');

CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'spam', 'deleted');

CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');

CREATE TYPE subscriber_status AS ENUM (
  'pending', 'active', 'unsubscribed', 'bounced'
);

CREATE TYPE consent_type AS ENUM (
  'terms', 'privacy', 'marketing', 'cookies', 'analytics'
);

-- ============================================================================
-- UTILITY: updated_at trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- USERS
-- ============================================================================

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           CITEXT NOT NULL,
  email_verified_at TIMESTAMPTZ,
  password_hash   VARCHAR(255),
  name            VARCHAR(150) NOT NULL,
  role            user_role NOT NULL DEFAULT 'student',
  avatar_url      TEXT,
  phone           VARCHAR(20),
  college         VARCHAR(200),
  graduation_year SMALLINT CHECK (graduation_year BETWEEN 1990 AND 2040),
  bio             TEXT,
  profile_completion SMALLINT NOT NULL DEFAULT 0 CHECK (profile_completion BETWEEN 0 AND 100),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_users_email_active ON users (email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users (role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users (created_at DESC);
CREATE INDEX idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- NEXTAUTH TABLES
-- ============================================================================

CREATE TABLE accounts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                VARCHAR(50) NOT NULL,
  provider            VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token       TEXT,
  access_token        TEXT,
  expires_at          INTEGER,
  token_type          VARCHAR(50),
  scope               TEXT,
  id_token            TEXT,
  session_state       TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, provider_account_id)
);

CREATE INDEX idx_accounts_user_id ON accounts (user_id);

CREATE TABLE sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) NOT NULL UNIQUE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires       TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions (user_id);
CREATE INDEX idx_sessions_expires ON sessions (expires);

CREATE TABLE verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token      VARCHAR(255) NOT NULL UNIQUE,
  expires    TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ============================================================================
-- COMPANIES
-- ============================================================================

CREATE TABLE companies (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                VARCHAR(200) NOT NULL,
  name                VARCHAR(200) NOT NULL,
  description         TEXT,
  logo_url            TEXT,
  website             VARCHAR(500),
  industry            VARCHAR(100),
  company_size        company_size,
  headquarters_city   VARCHAR(100),
  headquarters_state  VARCHAR(100),
  is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at         TIMESTAMPTZ,
  owner_user_id       UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  job_count           INTEGER NOT NULL DEFAULT 0 CHECK (job_count >= 0),
  internship_count    INTEGER NOT NULL DEFAULT 0 CHECK (internship_count >= 0),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_companies_slug_active ON companies (slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_verified ON companies (is_verified) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_owner ON companies (owner_user_id);
CREATE INDEX idx_companies_name_trgm ON companies USING GIN (name gin_trgm_ops);

CREATE TRIGGER trg_companies_updated_at
  BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- CATEGORIES
-- ============================================================================

CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        VARCHAR(100) NOT NULL UNIQUE,
  name        VARCHAR(150) NOT NULL,
  description TEXT,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  type        category_type NOT NULL DEFAULT 'both',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories (parent_id);
CREATE INDEX idx_categories_type ON categories (type);

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- TAGS
-- ============================================================================

CREATE TABLE tags (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         VARCHAR(100) NOT NULL UNIQUE,
  name         VARCHAR(100) NOT NULL,
  usage_count  INTEGER NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tags_name_trgm ON tags USING GIN (name gin_trgm_ops);

-- ============================================================================
-- JOBS
-- ============================================================================

CREATE TABLE jobs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                VARCHAR(250) NOT NULL,
  title               VARCHAR(300) NOT NULL,
  description         TEXT NOT NULL,
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  category_id         UUID REFERENCES categories(id) ON DELETE SET NULL,
  posted_by_user_id   UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  location_city       VARCHAR(100),
  location_state      VARCHAR(100),
  is_remote           BOOLEAN NOT NULL DEFAULT FALSE,
  experience_min      SMALLINT NOT NULL DEFAULT 0 CHECK (experience_min >= 0),
  experience_max      SMALLINT CHECK (experience_max IS NULL OR experience_max >= experience_min),
  salary_min          INTEGER CHECK (salary_min IS NULL OR salary_min >= 0),
  salary_max          INTEGER CHECK (salary_max IS NULL OR salary_max >= 0),
  salary_disclosed    BOOLEAN NOT NULL DEFAULT TRUE,
  employment_type     employment_type NOT NULL DEFAULT 'full_time',
  skills              TEXT[] NOT NULL DEFAULT '{}',
  application_method  application_method NOT NULL DEFAULT 'internal',
  external_apply_url  TEXT,
  status              listing_status NOT NULL DEFAULT 'draft',
  view_count          INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  application_count   INTEGER NOT NULL DEFAULT 0 CHECK (application_count >= 0),
  expires_at          TIMESTAMPTZ NOT NULL,
  published_at        TIMESTAMPTZ,
  search_vector       TSVECTOR,
  meta_title          VARCHAR(70),
  meta_description    VARCHAR(160),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ,
  CONSTRAINT chk_jobs_salary_range
    CHECK (salary_max IS NULL OR salary_min IS NULL OR salary_max >= salary_min),
  CONSTRAINT chk_jobs_external_url
    CHECK (application_method = 'internal' OR external_apply_url IS NOT NULL)
);

CREATE UNIQUE INDEX idx_jobs_slug_active ON jobs (slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_active_listing ON jobs (published_at DESC)
  WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX idx_jobs_company_status ON jobs (company_id, status);
CREATE INDEX idx_jobs_location ON jobs (location_city, location_state)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_category ON jobs (category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_expires ON jobs (expires_at) WHERE status = 'active';
CREATE INDEX idx_jobs_skills ON jobs USING GIN (skills);
CREATE INDEX idx_jobs_search ON jobs USING GIN (search_vector);
CREATE INDEX idx_jobs_title_trgm ON jobs USING GIN (title gin_trgm_ops);

CREATE TRIGGER trg_jobs_updated_at
  BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- INTERNSHIPS
-- ============================================================================

CREATE TABLE internships (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                VARCHAR(250) NOT NULL,
  title               VARCHAR(300) NOT NULL,
  description         TEXT NOT NULL,
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  category_id         UUID REFERENCES categories(id) ON DELETE SET NULL,
  posted_by_user_id   UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  location_city       VARCHAR(100),
  location_state      VARCHAR(100),
  is_remote           BOOLEAN NOT NULL DEFAULT FALSE,
  duration_months     SMALLINT CHECK (duration_months IS NULL OR duration_months BETWEEN 1 AND 24),
  stipend_min         INTEGER CHECK (stipend_min IS NULL OR stipend_min >= 0),
  stipend_max         INTEGER CHECK (stipend_max IS NULL OR stipend_max >= 0),
  is_paid             BOOLEAN NOT NULL DEFAULT TRUE,
  ppo_available       BOOLEAN NOT NULL DEFAULT FALSE,
  start_date          DATE,
  skills              TEXT[] NOT NULL DEFAULT '{}',
  application_method  application_method NOT NULL DEFAULT 'internal',
  external_apply_url  TEXT,
  status              listing_status NOT NULL DEFAULT 'draft',
  view_count          INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  application_count   INTEGER NOT NULL DEFAULT 0 CHECK (application_count >= 0),
  expires_at          TIMESTAMPTZ NOT NULL,
  published_at        TIMESTAMPTZ,
  search_vector       TSVECTOR,
  meta_title          VARCHAR(70),
  meta_description    VARCHAR(160),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ,
  CONSTRAINT chk_internships_stipend_range
    CHECK (stipend_max IS NULL OR stipend_min IS NULL OR stipend_max >= stipend_min),
  CONSTRAINT chk_internships_external_url
    CHECK (application_method = 'internal' OR external_apply_url IS NOT NULL)
);

CREATE UNIQUE INDEX idx_internships_slug_active ON internships (slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_internships_active_listing ON internships (published_at DESC)
  WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX idx_internships_company_status ON internships (company_id, status);
CREATE INDEX idx_internships_location ON internships (location_city, location_state);
CREATE INDEX idx_internships_ppo ON internships (ppo_available) WHERE status = 'active';
CREATE INDEX idx_internships_skills ON internships USING GIN (skills);
CREATE INDEX idx_internships_search ON internships USING GIN (search_vector);

CREATE TRIGGER trg_internships_updated_at
  BEFORE UPDATE ON internships FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- TAG JUNCTIONS
-- ============================================================================

CREATE TABLE job_tags (
  job_id  UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  tag_id  UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, tag_id)
);

CREATE INDEX idx_job_tags_tag ON job_tags (tag_id);

CREATE TABLE internship_tags (
  internship_id UUID NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
  tag_id        UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (internship_id, tag_id)
);

CREATE INDEX idx_internship_tags_tag ON internship_tags (tag_id);

-- ============================================================================
-- RESUMES
-- ============================================================================

CREATE TABLE resumes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(150) NOT NULL,
  template_id  VARCHAR(50) NOT NULL DEFAULT 'modern',
  content      JSONB NOT NULL DEFAULT '{}',
  pdf_url      TEXT,
  is_primary   BOOLEAN NOT NULL DEFAULT FALSE,
  version      INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ
);

CREATE INDEX idx_resumes_user ON resumes (user_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_resumes_primary_per_user ON resumes (user_id)
  WHERE is_primary = TRUE AND deleted_at IS NULL;

CREATE TRIGGER trg_resumes_updated_at
  BEFORE UPDATE ON resumes FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- APPLICATIONS (Partitioned by applied_at)
-- ============================================================================

CREATE TABLE applications (
  id                UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL,
  job_id            UUID,
  internship_id     UUID,
  resume_id         UUID NOT NULL,
  resume_snapshot   JSONB NOT NULL,
  cover_letter      TEXT,
  status            application_status NOT NULL DEFAULT 'submitted',
  employer_notes    TEXT,
  applied_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, applied_at),
  CONSTRAINT chk_application_target CHECK (
    (job_id IS NOT NULL AND internship_id IS NULL) OR
    (job_id IS NULL AND internship_id IS NOT NULL)
  )
) PARTITION BY RANGE (applied_at);

-- Default partition (migrate monthly as volume grows)
CREATE TABLE applications_default PARTITION OF applications DEFAULT;

CREATE INDEX idx_applications_user ON applications (user_id, applied_at DESC);
CREATE INDEX idx_applications_job ON applications (job_id, status, applied_at DESC)
  WHERE job_id IS NOT NULL;
CREATE INDEX idx_applications_internship ON applications (internship_id, status, applied_at DESC)
  WHERE internship_id IS NOT NULL;

-- Unique constraints per partition (enforced via application logic + partial indexes on parent)
CREATE UNIQUE INDEX idx_applications_unique_job
  ON applications (user_id, job_id, applied_at) WHERE job_id IS NOT NULL;
CREATE UNIQUE INDEX idx_applications_unique_internship
  ON applications (user_id, internship_id, applied_at) WHERE internship_id IS NOT NULL;

-- FK constraints on partitioned table (PostgreSQL 12+)
ALTER TABLE applications ADD CONSTRAINT fk_applications_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE applications ADD CONSTRAINT fk_applications_job
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;
ALTER TABLE applications ADD CONSTRAINT fk_applications_internship
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE;
ALTER TABLE applications ADD CONSTRAINT fk_applications_resume
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE RESTRICT;

-- ============================================================================
-- ATS REPORTS (Partitioned)
-- ============================================================================

CREATE TABLE ats_reports (
  id                   UUID NOT NULL DEFAULT gen_random_uuid(),
  resume_id            UUID NOT NULL,
  user_id              UUID NOT NULL,
  job_id               UUID,
  job_description_text TEXT,
  overall_score        SMALLINT NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  keyword_score        SMALLINT CHECK (keyword_score BETWEEN 0 AND 100),
  formatting_score     SMALLINT CHECK (formatting_score BETWEEN 0 AND 100),
  match_details        JSONB NOT NULL DEFAULT '{}',
  suggestions          JSONB NOT NULL DEFAULT '[]',
  model_version        VARCHAR(50) NOT NULL DEFAULT 'v1',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE ats_reports_default PARTITION OF ats_reports DEFAULT;

CREATE INDEX idx_ats_reports_user ON ats_reports (user_id, created_at DESC);
CREATE INDEX idx_ats_reports_resume ON ats_reports (resume_id, created_at DESC);

ALTER TABLE ats_reports ADD CONSTRAINT fk_ats_reports_resume
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE;
ALTER TABLE ats_reports ADD CONSTRAINT fk_ats_reports_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE ats_reports ADD CONSTRAINT fk_ats_reports_job
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL;

-- ============================================================================
-- BLOG POSTS
-- ============================================================================

CREATE TABLE blog_posts (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 VARCHAR(250) NOT NULL,
  title                VARCHAR(300) NOT NULL,
  excerpt              TEXT,
  content              TEXT NOT NULL,
  featured_image_url   TEXT,
  author_id            UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  category_id          UUID REFERENCES categories(id) ON DELETE SET NULL,
  status               content_status NOT NULL DEFAULT 'draft',
  reading_time_minutes SMALLINT CHECK (reading_time_minutes IS NULL OR reading_time_minutes > 0),
  view_count           INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  published_at         TIMESTAMPTZ,
  search_vector        TSVECTOR,
  meta_title           VARCHAR(70),
  meta_description     VARCHAR(160),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_blog_posts_slug_active ON blog_posts (slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_blog_posts_published ON blog_posts (published_at DESC)
  WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_blog_posts_category ON blog_posts (category_id);
CREATE INDEX idx_blog_posts_author ON blog_posts (author_id);
CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN (search_vector);

CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE blog_post_tags (
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id       UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_post_id, tag_id)
);

CREATE INDEX idx_blog_post_tags_tag ON blog_post_tags (tag_id);

-- ============================================================================
-- COMMENTS (Partitioned yearly)
-- ============================================================================

CREATE TABLE comments (
  id            UUID NOT NULL DEFAULT gen_random_uuid(),
  blog_post_id  UUID NOT NULL,
  user_id       UUID NOT NULL,
  parent_id     UUID,
  content       TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 5000),
  status        comment_status NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE comments_default PARTITION OF comments DEFAULT;

CREATE INDEX idx_comments_post ON comments (blog_post_id, created_at DESC);
CREATE INDEX idx_comments_user ON comments (user_id);
CREATE INDEX idx_comments_status ON comments (status) WHERE status = 'pending';

ALTER TABLE comments ADD CONSTRAINT fk_comments_post
  FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE;
ALTER TABLE comments ADD CONSTRAINT fk_comments_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ============================================================================
-- INTERVIEW QUESTIONS
-- ============================================================================

CREATE TABLE interview_questions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         VARCHAR(250) NOT NULL UNIQUE,
  question     TEXT NOT NULL,
  answer       TEXT NOT NULL,
  company_id   UUID REFERENCES companies(id) ON DELETE SET NULL,
  role         VARCHAR(100),
  difficulty   difficulty_level NOT NULL DEFAULT 'medium',
  topic        VARCHAR(100),
  view_count   INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interview_questions_company ON interview_questions (company_id);
CREATE INDEX idx_interview_questions_topic ON interview_questions (topic);
CREATE INDEX idx_interview_questions_difficulty ON interview_questions (difficulty);
CREATE INDEX idx_interview_questions_published ON interview_questions (is_published, created_at DESC);

CREATE TRIGGER trg_interview_questions_updated_at
  BEFORE UPDATE ON interview_questions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE interview_question_tags (
  interview_question_id UUID NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
  tag_id                UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (interview_question_id, tag_id)
);

-- ============================================================================
-- CAREER ROADMAPS
-- ============================================================================

CREATE TABLE career_roadmaps (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             VARCHAR(200) NOT NULL UNIQUE,
  title            VARCHAR(250) NOT NULL,
  description      TEXT,
  difficulty       difficulty_level NOT NULL DEFAULT 'medium',
  estimated_hours  SMALLINT CHECK (estimated_hours IS NULL OR estimated_hours > 0),
  thumbnail_url    TEXT,
  is_published     BOOLEAN NOT NULL DEFAULT FALSE,
  view_count       INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_career_roadmaps_published ON career_roadmaps (is_published);

CREATE TRIGGER trg_career_roadmaps_updated_at
  BEFORE UPDATE ON career_roadmaps FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE roadmap_steps (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id      UUID NOT NULL REFERENCES career_roadmaps(id) ON DELETE CASCADE,
  slug            VARCHAR(200) NOT NULL,
  title           VARCHAR(250) NOT NULL,
  description     TEXT,
  step_order      INTEGER NOT NULL CHECK (step_order > 0),
  resource_url    TEXT,
  resource_type   VARCHAR(50),
  estimated_hours SMALLINT CHECK (estimated_hours IS NULL OR estimated_hours > 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (roadmap_id, step_order),
  UNIQUE (roadmap_id, slug)
);

CREATE INDEX idx_roadmap_steps_roadmap ON roadmap_steps (roadmap_id, step_order);

CREATE TRIGGER trg_roadmap_steps_updated_at
  BEFORE UPDATE ON roadmap_steps FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- TESTIMONIALS
-- ============================================================================

CREATE TABLE testimonials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(200) NOT NULL UNIQUE,
  name            VARCHAR(150) NOT NULL,
  college         VARCHAR(200),
  company_placed  VARCHAR(200),
  role_placed     VARCHAR(150),
  quote           TEXT NOT NULL,
  avatar_url      TEXT,
  rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_testimonials_featured ON testimonials (is_featured, is_published);

CREATE TRIGGER trg_testimonials_updated_at
  BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================================

CREATE TABLE newsletter_subscribers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             CITEXT NOT NULL UNIQUE,
  status            subscriber_status NOT NULL DEFAULT 'pending',
  preferences       JSONB NOT NULL DEFAULT '{"jobs":true,"internships":true,"blog":true,"placement_tips":true}',
  confirm_token     VARCHAR(64) NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  unsubscribe_token VARCHAR(64) NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  confirmed_at      TIMESTAMPTZ,
  unsubscribed_at   TIMESTAMPTZ,
  source            VARCHAR(50) DEFAULT 'footer',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_newsletter_status ON newsletter_subscribers (status);
CREATE INDEX idx_newsletter_created ON newsletter_subscribers (created_at DESC);

CREATE TRIGGER trg_newsletter_updated_at
  BEFORE UPDATE ON newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- SAVED JOBS
-- ============================================================================

CREATE TABLE saved_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id          UUID REFERENCES jobs(id) ON DELETE CASCADE,
  internship_id   UUID REFERENCES internships(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_saved_jobs_target CHECK (
    (job_id IS NOT NULL AND internship_id IS NULL) OR
    (job_id IS NULL AND internship_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX idx_saved_jobs_user_job ON saved_jobs (user_id, job_id) WHERE job_id IS NOT NULL;
CREATE UNIQUE INDEX idx_saved_jobs_user_internship ON saved_jobs (user_id, internship_id)
  WHERE internship_id IS NOT NULL;
CREATE INDEX idx_saved_jobs_user ON saved_jobs (user_id, created_at DESC);

-- ============================================================================
-- CONSENT LOGS (AdSense / DPDP)
-- ============================================================================

CREATE TABLE consent_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id    VARCHAR(100),
  consent_type  consent_type NOT NULL,
  granted       BOOLEAN NOT NULL,
  ip_hash       VARCHAR(64),
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consent_logs_user ON consent_logs (user_id, created_at DESC);
CREATE INDEX idx_consent_logs_type ON consent_logs (consent_type, created_at DESC);

-- ============================================================================
-- AUDIT LOGS (Admin actions — partitioned)
-- ============================================================================

CREATE TABLE audit_logs (
  id          UUID NOT NULL DEFAULT gen_random_uuid(),
  actor_id    UUID,
  action      VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id   UUID,
  metadata    JSONB DEFAULT '{}',
  ip_hash     VARCHAR(64),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE audit_logs_default PARTITION OF audit_logs DEFAULT;

CREATE INDEX idx_audit_logs_actor ON audit_logs (actor_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id);

-- ============================================================================
-- SEARCH VECTOR UPDATE FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION update_job_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.skills, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_jobs_search_vector
  BEFORE INSERT OR UPDATE OF title, description, skills ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_job_search_vector();

CREATE OR REPLACE FUNCTION update_internship_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.skills, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_internships_search_vector
  BEFORE INSERT OR UPDATE OF title, description, skills ON internships
  FOR EACH ROW EXECUTE FUNCTION update_internship_search_vector();

CREATE OR REPLACE FUNCTION update_blog_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_blog_search_vector
  BEFORE INSERT OR UPDATE OF title, excerpt, content ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_blog_search_vector();

-- ============================================================================
-- APPLICATION COUNT INCREMENT
-- ============================================================================

CREATE OR REPLACE FUNCTION increment_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.job_id IS NOT NULL THEN
    UPDATE jobs SET application_count = application_count + 1 WHERE id = NEW.job_id;
  ELSIF NEW.internship_id IS NOT NULL THEN
    UPDATE internships SET application_count = application_count + 1 WHERE id = NEW.internship_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_applications_count
  AFTER INSERT ON applications FOR EACH ROW EXECUTE FUNCTION increment_application_count();

-- ============================================================================
-- VIEWS (Read replica friendly)
-- ============================================================================

CREATE VIEW v_active_jobs AS
SELECT j.*, c.name AS company_name, c.slug AS company_slug, c.logo_url AS company_logo
FROM jobs j
JOIN companies c ON c.id = j.company_id
WHERE j.status = 'active' AND j.deleted_at IS NULL AND j.expires_at > NOW();

CREATE VIEW v_active_internships AS
SELECT i.*, c.name AS company_name, c.slug AS company_slug, c.logo_url AS company_logo
FROM internships i
JOIN companies c ON c.id = i.company_id
WHERE i.status = 'active' AND i.deleted_at IS NULL AND i.expires_at > NOW();

-- ============================================================================
-- SEED: Default categories (optional — run in migration seed)
-- ============================================================================

-- INSERT INTO categories (slug, name, type) VALUES
--   ('technology', 'Technology', 'job'),
--   ('software-engineering', 'Software Engineering', 'job'),
--   ('placement-tips', 'Placement Tips', 'blog');
