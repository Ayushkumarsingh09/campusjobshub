# User Flow Diagrams

## 1. Persona Overview

```mermaid
flowchart LR
    subgraph Actors
        G[Guest]
        S[Student]
        E[Employer]
        A[Admin]
        ED[Editor]
    end

    subgraph Platform
        CJH[CampusJobsHub]
    end

    G -->|Browse SEO| CJH
    G -->|Subscribe| CJH
    S -->|Apply, Resume| CJH
    E -->|Post, Review Apps| CJH
    ED -->|Publish Content| CJH
    A -->|Moderate| CJH
```

---

## 2. Guest → Student Conversion Flow

```mermaid
flowchart TD
    A[Land on SEO page<br/>Job / Blog / Interview] --> B{Interested in applying?}
    B -->|No| C[Browse more / Subscribe newsletter]
    B -->|Yes| D[Click Apply]
    D --> E{Logged in?}
    E -->|Yes| F[Application flow]
    E -->|No| G[Auth modal / Register page]
    G --> H[Email + Password or Google OAuth]
    H --> I[Email verification]
    I --> J[Complete profile<br/>skills, college, resume]
    J --> F
    F --> K[Select resume / upload]
    K --> L[Submit application]
    L --> M[Confirmation + dashboard link]
    M --> N[Email notification sent]
```

---

## 3. Job Search & Apply Flow (Student)

```mermaid
flowchart TD
    A[Homepage / Jobs index] --> B[Apply filters<br/>city, skills, exp]
    B --> C[View results list]
    C --> D[Open job detail]
    D --> E{Save job?}
    E -->|Yes| F[Add to saved<br/>requires auth]
    E -->|No| G{Apply now?}
    F --> G
    G -->|External apply| H[Redirect to company URL<br/>track click event]
    G -->|Internal apply| I[Application wizard]
    I --> J[Review profile snapshot]
    J --> K[Submit]
    K --> L[Status: Submitted]
    L --> M[Track in /dashboard/applications]
```

---

## 4. Resume Builder & ATS Flow

```mermaid
flowchart TD
    A[/resume marketing page/] --> B{Authenticated?}
    B -->|No| C[Register / Login]
    B -->|Yes| D[/resume/builder/]
    C --> D
    D --> E[Choose template]
    E --> F[Fill sections<br/>Experience, Education, Skills]
    F --> G[Live preview]
    G --> H[Save resume JSON]
    H --> I{Run ATS check?}
    I -->|Yes| J[Paste job description or select saved job]
    J --> K[Queue ATS analysis]
    K --> L[Display score + suggestions]
    L --> M[Apply suggestions / re-scan]
    M --> N[Export PDF via Cloudinary]
    I -->|No| N
```

---

## 5. Employer Onboarding & Job Post Flow

```mermaid
flowchart TD
    A[Click 'Post a Job'] --> B{Logged in as Employer?}
    B -->|No| C[Register with EMPLOYER role]
    C --> D[Company onboarding form]
    B -->|Yes| D
    D --> E[Submit company details + logo]
    E --> F{Admin verification}
    F -->|Rejected| G[Email + resubmit]
    F -->|Approved| H[Employer dashboard]
    H --> I[Create job listing wizard]
    I --> J[Title, description, location, skills]
    J --> K[Preview listing]
    K --> L[Publish → status ACTIVE]
    L --> M[Job indexed in sitemap<br/>within 6h cron]
    M --> N[Applications arrive in inbox]
    N --> O[Shortlist / Reject / Notes]
```

---

## 6. Application Status Flow (State Machine)

```mermaid
stateDiagram-v2
    [*] --> submitted: Student applies
    submitted --> under_review: Employer opens
    under_review --> shortlisted: Employer shortlists
    under_review --> rejected: Employer rejects
    shortlisted --> hired: Offer accepted
    shortlisted --> rejected: Not selected
    rejected --> [*]
    hired --> [*]

    note right of submitted
        Email notify employer
    end note
    note right of shortlisted
        Email notify student
    end note
```

---

## 7. Blog & Content Consumption Flow

```mermaid
flowchart TD
    A[Organic search / Social] --> B[Blog article page]
    B --> C[Read content + AdSense sidebar]
    C --> D[Related jobs widget]
    D --> E{Click related job?}
    E -->|Yes| F[Job detail → Apply funnel]
    E -->|No| G[Related posts / Newsletter CTA]
    G --> H[Subscribe with preferences]
    H --> I[Double opt-in email]
    I --> J[Confirmed subscriber]
```

---

## 8. Newsletter Subscription Flow

```mermaid
flowchart TD
    A[Footer / Blog CTA] --> B[Enter email + preferences]
    B --> C[POST /api/v1/newsletter/subscribe]
    C --> D[Create pending subscriber]
    D --> E[Send confirmation email]
    E --> F{Click confirm link?}
    F -->|Within 7 days| G[Status: active]
    F -->|Expired| H[Resubscribe prompt]
    G --> I[Receive weekly digest]
    I --> J{Unsubscribe?}
    J -->|Yes| K[One-click unsubscribe token]
    K --> L[Status: unsubscribed]
```

---

## 9. Admin Moderation Flow

```mermaid
flowchart TD
    A[New job/company/comment submitted] --> B[Moderation queue]
    B --> C{Auto rules pass?}
    C -->|Spam score high| D[Auto-reject + notify]
    C -->|Pass| E[Admin review]
    E --> F{Decision}
    F -->|Approve| G[Publish + index]
    F -->|Reject| H[Notify with reason]
    F -->|Edit| I[Admin edits + approve]
```

---

## 10. Authentication Flow (NextAuth)

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Next.js Frontend
    participant NA as NextAuth
    participant DB as PostgreSQL
    participant OAuth as Google OAuth

    U->>FE: Click Login
    FE->>NA: signIn(credentials | google)
    alt Credentials
        NA->>DB: Verify email + bcrypt hash
        DB-->>NA: User record
    else Google OAuth
        NA->>OAuth: Authorization
        OAuth-->>NA: Profile + email
        NA->>DB: Upsert User + Account
    end
    NA->>NA: Create JWT session
    NA-->>FE: Set httpOnly cookie
    FE-->>U: Redirect to callback URL
```

---

## 11. Error & Edge Case Flows

| Scenario | Behavior |
|----------|----------|
| Apply to expired job | Block submit; show similar jobs |
| Duplicate application | Show existing application status |
| ATS rate limit exceeded | Upsell message; retry after 24h |
| Unverified email | Allow browse; block apply |
| Employer unverified | Jobs saved as `pending_review` |
| Session expired mid-apply | Save draft in localStorage; re-auth resume |

---

## 12. Notification Touchpoints

| Event | Channel | Recipient |
|-------|---------|-----------|
| Application submitted | Email + in-app | Student, Employer |
| Status change | Email + in-app | Student |
| New job match (saved search) | Email | Student (Phase 2) |
| Job expiring in 3 days | Email | Employer |
| Newsletter weekly | Email | Subscriber |
| Comment reply | Email | Comment author (Phase 2) |
