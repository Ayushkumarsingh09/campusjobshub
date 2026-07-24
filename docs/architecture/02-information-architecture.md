# Information Architecture

## 1. Design Principles

1. **Job-first navigation** — Primary IA orbits around Jobs and Internships
2. **SEO silos** — Each content type forms a crawlable cluster (jobs by city, blog by category)
3. **Progressive disclosure** — Guest sees listings; login unlocks apply, resume, saved jobs
4. **Flat URLs where possible** — Max 3 path segments for indexable pages
5. **Consistent taxonomy** — Shared Categories/Tags across jobs, blog, interview content

---

## 2. Content Types

| Content Type | Purpose | Primary Audience | Indexable |
|--------------|---------|------------------|-----------|
| Job Listing | Full-time opportunities | Students, graduates | Yes |
| Internship Listing | Short-term campus roles | Students | Yes |
| Company Profile | Employer brand + listings | All | Yes |
| Blog Post | Guides, news, placement tips | Students | Yes |
| Interview Question | Company/role Q&A | Students | Yes |
| Career Roadmap | Learning paths | Students | Yes |
| Resume (private) | User-generated | Logged-in users | No |
| ATS Report (private) | Analysis output | Logged-in users | No |
| Application (private) | Apply record | Student + employer | No |
| Testimonial | Social proof | Marketing | Yes (limited) |

---

## 3. Taxonomy

### 3.1 Job Categories (Hierarchical)

```
Technology
├── Software Engineering
├── Data Science & AI
├── DevOps & Cloud
├── QA & Testing
└── Product & Design

Business
├── Marketing
├── Sales
├── HR
└── Operations

Core Engineering
├── Mechanical
├── Civil
├── Electrical
└── Electronics

Finance & Commerce
├── Accounting
├── Banking
└── FinTech

Government & PSU (Phase 3)
```

### 3.2 Location Taxonomy

- **Country:** India (default)
- **State:** 28 states + 8 UTs
- **City:** Top 100 cities + "Remote" + "Hybrid"
- **URL pattern:** `/jobs/in-mumbai`, `/internships/in-bangalore`

### 3.3 Skills Taxonomy

- Flat tag list with optional grouping (programming languages, frameworks, soft skills)
- Many-to-many on jobs, internships, resumes, roadmaps

### 3.4 Blog Categories

| Category | Examples |
|----------|----------|
| Placement Tips | GD/PI prep, dress code, offer negotiation |
| Resume & CV | Format guides, ATS tips |
| Company Guides | TCS, Infosys, Google India process |
| Aptitude & Exams | Quant, logical reasoning |
| Career Advice | Branch selection, higher studies |
| Internship Stories | Student experiences |

### 3.5 Interview Question Dimensions

- Company (e.g., Amazon, Wipro)
- Role (SDE, Analyst, HR)
- Difficulty (Easy, Medium, Hard)
- Topic (DSA, SQL, Behavioral, HR)

---

## 4. Navigation Structure

### 4.1 Primary Navigation (Desktop)

```
[Logo]  Jobs ▾  Internships ▾  Companies  Prepare ▾  Resume AI  Blog  [Search]  [Login/Avatar]
```

**Jobs dropdown:**
- Browse All Jobs
- Jobs by City
- Jobs by Category
- Fresher Jobs
- Work From Home

**Internships dropdown:**
- Browse All Internships
- Summer Internships
- Paid Internships
- Internships with PPO

**Prepare dropdown:**
- Interview Questions
- Career Roadmaps
- Aptitude Resources (blog filter)
- Company Interview Guides

### 4.2 Footer Navigation

```
Platform          Resources         Company           Legal
─────────         ─────────         ───────           ─────
Jobs              Blog              About Us          Privacy Policy
Internships       Interview Qs      Contact           Terms of Service
Companies         Roadmaps          Careers           Cookie Policy
Resume AI         Newsletter        Advertise         Disclaimer
For Employers     Testimonials                        DPDP Notice
```

### 4.3 User Dashboard IA (Authenticated)

```
Dashboard
├── Overview (stats, recommendations)
├── My Applications
│   ├── Active
│   ├── Shortlisted
│   └── Archived
├── Saved Jobs
├── My Resumes
│   ├── Builder
│   └── ATS Reports
├── Profile & Settings
└── Notifications

Employer Dashboard
├── Company Profile
├── Job Listings
├── Internship Listings
├── Applications Inbox
├── Analytics (Phase 2)
└── Billing (Phase 3)

Admin Panel
├── Users
├── Jobs Moderation
├── Companies Verification
├── Blog CMS
├── Comments Queue
├── Newsletter
└── System Health
```

---

## 5. Labeling & Metadata Standards

| Field | Convention | Example |
|-------|------------|---------|
| Page title | `{Primary} \| CampusJobsHub` | `Software Engineer Jobs in Pune \| CampusJobsHub` |
| H1 | Human-readable primary keyword | `Software Engineer Jobs in Pune` |
| Breadcrumbs | Home > Section > Entity | `Home > Jobs > Mumbai > SDE at TCS` |
| Slug | kebab-case, unique | `software-engineer-tcs-mumbai-2026` |
| Meta description | 150–160 chars, CTA | `Apply to 50+ SDE jobs in Mumbai. Free resume ATS check.` |

---

## 6. Search & Filter IA

### Global Search Scopes

1. Jobs
2. Internships
3. Companies
4. Blog
5. Interview Questions

### Job/Internship Filters (Faceted)

| Facet | Type | Notes |
|-------|------|-------|
| Location | Multi-select | City + remote |
| Category | Tree select | Single or multi |
| Experience | Range | 0–15 years |
| Salary/Stipend | Range | INR |
| Job type | Enum | Full-time, contract |
| Skills | Multi-tag | AND/OR toggle |
| Posted date | Preset | 24h, 7d, 30d |
| Company | Autocomplete | — |

### Sort Options

- Relevance (default)
- Most recent
- Salary high to low
- Application count (popular)

---

## 7. Content Relationships

```
Company ──< Jobs
Company ──< Internships
Company ──< Testimonials
Company ──< InterviewQuestions (optional link)

Job ──< Applications
Internship ──< Applications

User ──< Applications
User ──< Resumes ──< ATSReports
User ──< SavedJobs (junction)
User ──< Comments

BlogPost ──< Comments
BlogPost >──< Categories
BlogPost >──< Tags

CareerRoadmap ──< RoadmapSteps
CareerRoadmap >──< Skills

InterviewQuestion >──< Tags
InterviewQuestion ──?── Company
```

---

## 8. Mental Models by Persona

### Student (Guest)

> "I want to see what's available near me without signing up."

- Lands on SEO page → browses listings → hits apply wall → registers

### Student (Registered)

> "I want one place to apply, track, and fix my resume."

- Dashboard-centric; resume AI is second top task after search

### Employer

> "I want to post fast and see applicants."

- Company setup once → listing wizard → inbox

### Content Consumer (SEO)

> "I googled 'TCS interview questions 2026'."

- Lands on interview hub → internal links to jobs at TCS + roadmap

---

## 9. Mobile IA Adaptations

- Bottom tab bar: Home, Jobs, Internships, Saved, Profile
- Filters as full-screen drawer
- Sticky apply CTA on job detail
- Resume builder: step wizard (one section per screen)

---

## 10. IA Governance

| Rule | Enforcement |
|------|-------------|
| Max 2 clicks to any job category from homepage | Nav audit quarterly |
| No orphan pages | Every page ≥1 internal link |
| Canonical on filter combos | `rel=canonical` to primary facet URL |
| Retired listings → 410 after 90 days | Redirect to category page 301 first 30 days |
