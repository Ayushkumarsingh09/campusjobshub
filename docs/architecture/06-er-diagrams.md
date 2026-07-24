# ER Diagrams

## 1. Core Domain — Jobs & Applications

```mermaid
erDiagram
    USERS ||--o{ APPLICATIONS : submits
    USERS ||--o{ RESUMES : owns
    USERS ||--o{ SAVED_JOBS : saves
    USERS ||--o| COMPANIES : "owns (employer)"
    USERS ||--o{ BLOG_POSTS : authors
    USERS ||--o{ COMMENTS : writes

    COMPANIES ||--o{ JOBS : posts
    COMPANIES ||--o{ INTERNSHIPS : posts
    COMPANIES ||--o{ INTERVIEW_QUESTIONS : "associated with"
    COMPANIES ||--o{ TESTIMONIALS : "placed at"

    JOBS ||--o{ APPLICATIONS : receives
    INTERNSHIPS ||--o{ APPLICATIONS : receives
    JOBS }o--|| CATEGORIES : "belongs to"
    INTERNSHIPS }o--|| CATEGORIES : "belongs to"

    RESUMES ||--o{ APPLICATIONS : "used in"
    RESUMES ||--o{ ATS_REPORTS : "analyzed in"
    JOBS ||--o{ ATS_REPORTS : "compared against"

    JOBS }o--o{ TAGS : "job_tags"
    INTERNSHIPS }o--o{ TAGS : "internship_tags"

    USERS {
        uuid id PK
        string email UK
        enum role
        string name
        timestamp email_verified_at
        timestamp deleted_at
    }

    COMPANIES {
        uuid id PK
        string slug UK
        string name
        uuid owner_user_id FK
        boolean is_verified
        int job_count
    }

    JOBS {
        uuid id PK
        string slug UK
        string title
        uuid company_id FK
        uuid category_id FK
        enum status
        text_array skills
        timestamp expires_at
    }

    INTERNSHIPS {
        uuid id PK
        string slug UK
        uuid company_id FK
        smallint duration_months
        boolean ppo_available
    }

    APPLICATIONS {
        uuid id PK
        uuid user_id FK
        uuid job_id FK
        uuid internship_id FK
        uuid resume_id FK
        jsonb resume_snapshot
        enum status
        timestamp applied_at
    }

    RESUMES {
        uuid id PK
        uuid user_id FK
        jsonb content
        boolean is_primary
        string pdf_url
    }

    ATS_REPORTS {
        uuid id PK
        uuid resume_id FK
        uuid user_id FK
        smallint overall_score
        jsonb suggestions
    }
```

---

## 2. Content Domain — Blog & Taxonomy

```mermaid
erDiagram
    CATEGORIES ||--o{ CATEGORIES : "parent-child"
    CATEGORIES ||--o{ JOBS : classifies
    CATEGORIES ||--o{ BLOG_POSTS : classifies

    BLOG_POSTS ||--o{ COMMENTS : has
    BLOG_POSTS }o--o{ TAGS : "blog_post_tags"
    COMMENTS ||--o{ COMMENTS : "parent (thread)"

    USERS ||--o{ BLOG_POSTS : authors
    USERS ||--o{ COMMENTS : writes

    CATEGORIES {
        uuid id PK
        string slug UK
        string name
        uuid parent_id FK
        enum type
    }

    TAGS {
        uuid id PK
        string slug UK
        string name
        int usage_count
    }

    BLOG_POSTS {
        uuid id PK
        string slug UK
        string title
        text content
        uuid author_id FK
        uuid category_id FK
        enum status
        tsvector search_vector
    }

    COMMENTS {
        uuid id PK
        uuid blog_post_id FK
        uuid user_id FK
        uuid parent_id FK
        text content
        enum status
    }

    BLOG_POST_TAGS {
        uuid blog_post_id FK
        uuid tag_id FK
    }
```

---

## 3. Placement Prep Domain

```mermaid
erDiagram
    CAREER_ROADMAPS ||--|{ ROADMAP_STEPS : contains
    CAREER_ROADMAPS }o--o{ TAGS : "roadmap_tags"
    INTERVIEW_QUESTIONS }o--o{ TAGS : "interview_question_tags"
    INTERVIEW_QUESTIONS }o--o| COMPANIES : "optional"

    CAREER_ROADMAPS {
        uuid id PK
        string slug UK
        string title
        text description
        enum difficulty
        boolean is_published
    }

    ROADMAP_STEPS {
        uuid id PK
        uuid roadmap_id FK
        string slug
        string title
        int step_order
        string resource_url
    }

    INTERVIEW_QUESTIONS {
        uuid id PK
        string slug UK
        text question
        text answer
        uuid company_id FK
        string role
        enum difficulty
    }
```

---

## 4. Auth & Newsletter Domain

```mermaid
erDiagram
    USERS ||--o{ ACCOUNTS : "OAuth"
    USERS ||--o{ SESSIONS : has
    USERS ||--o{ CONSENT_LOGS : records

    NEWSLETTER_SUBSCRIBERS {
        uuid id PK
        string email UK
        enum status
        jsonb preferences
        string confirm_token UK
        string unsubscribe_token UK
    }

    ACCOUNTS {
        uuid id PK
        uuid user_id FK
        string provider
        string provider_account_id
    }

    SESSIONS {
        uuid id PK
        uuid user_id FK
        string session_token UK
        timestamp expires
    }

    VERIFICATION_TOKENS {
        string identifier
        string token UK
        timestamp expires
    }

    CONSENT_LOGS {
        uuid id PK
        uuid user_id FK
        string consent_type
        boolean granted
        timestamp created_at
    }
```

---

## 5. Saved Jobs Junction

```mermaid
erDiagram
    USERS ||--o{ SAVED_JOBS : saves
    JOBS ||--o{ SAVED_JOBS : "saved as"
    INTERNSHIPS ||--o{ SAVED_JOBS : "saved as"

    SAVED_JOBS {
        uuid id PK
        uuid user_id FK
        uuid job_id FK
        uuid internship_id FK
        timestamp created_at
    }
```

**Constraint:** Exactly one of `job_id` or `internship_id` must be set.

---

## 6. Relationship Cardinality Summary

| From | To | Relationship | FK Location |
|------|-----|--------------|-------------|
| User | Application | 1:N | applications.user_id |
| User | Resume | 1:N | resumes.user_id |
| User | Company | 1:1 (owner) | companies.owner_user_id |
| Company | Job | 1:N | jobs.company_id |
| Company | Internship | 1:N | internships.company_id |
| Job | Application | 1:N | applications.job_id |
| Resume | Application | 1:N | applications.resume_id |
| Resume | ATSReport | 1:N | ats_reports.resume_id |
| BlogPost | Comment | 1:N | comments.blog_post_id |
| Category | Category | 1:N (tree) | categories.parent_id |
| CareerRoadmap | RoadmapStep | 1:N | roadmap_steps.roadmap_id |
| Job ↔ Tag | M:N | job_tags junction |
| BlogPost ↔ Tag | M:N | blog_post_tags junction |

---

## 7. Data Flow — Application Submit

```mermaid
flowchart LR
    U[User] --> R[Resume JSON]
    R --> S[Snapshot JSONB]
    S --> A[Application Row]
    J[Job] --> A
    A --> C[Increment job.application_count]
    A --> N[Notification Queue]
```

---

## 8. Partitioning Diagram — Applications

```mermaid
flowchart TB
    subgraph applications [applications parent table]
        P[Partition Key: applied_at]
    end

    P --> M202601[applications_2026_01]
    P --> M202602[applications_2026_02]
    P --> M202603[applications_2026_03]
    P --> MDEFAULT[applications_default]
```

Queries always include `applied_at` range for partition pruning.
