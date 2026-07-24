import type { DifficultyLevel } from '@prisma/client';
import { buildInterviewQuestionTemplate } from '../../src/lib/content/templates';
import { INTERVIEW_TOPIC_BANKS, slugForQuestion } from './data/interview';
import { blogImageUrl } from './data/stock-images';
import type { SeedContext } from './utils';

type InterviewArticleDef = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  readingTimeMinutes: number;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
};

const INTERVIEW_HUB_ARTICLES: InterviewArticleDef[] = [
  {
    slug: 'java-interview-questions-guide',
    title: 'Java Interview Questions — Complete Campus Preparation Guide',
    excerpt:
      'Master core Java, collections, multithreading, and Spring basics with a structured prep plan for TCS, Infosys, and product company technical rounds.',
    content: `# Java Interview Questions — Complete Campus Preparation Guide

Java remains the most widely tested language in Indian campus hiring. Service companies (TCS, Infosys, Wipro, Cognizant) assess OOP, collections, and exception handling in online tests and technical interviews. Product companies add JVM internals, concurrency, and Spring Boot architecture questions.

## What interviewers expect

Freshers should explain **JDK vs JRE vs JVM**, demonstrate **equals/hashCode** contracts, and compare **ArrayList vs LinkedList** with time complexity. Mid-level campus questions cover **HashMap internals**, **synchronized vs concurrent collections**, and **garbage collection generations**.

## 4-week study plan

**Week 1:** Core Java — classes, inheritance, interfaces, static/final, exception hierarchy.  
**Week 2:** Collections framework — List, Set, Map implementations and when to use each.  
**Week 3:** Multithreading — Runnable, ExecutorService, volatile, deadlocks.  
**Week 4:** Spring Boot basics — REST controllers, dependency injection, JPA entities.

## Common mistakes

- Using \`==\` for String comparison  
- Ignoring \`hashCode()\` when overriding \`equals()\`  
- Calling \`run()\` instead of \`start()\` on threads  
- Unable to explain project Java stack confidently

## Practice resources

Solve 30 curated Java Q&A on CampusJobsHub, build one REST API with Spring Boot, and revise two mini-projects before your drive.

Browse all [Java interview questions](/prepare/interview-questions/topic/java) with easy, medium, and hard difficulty filters.`,
    readingTimeMinutes: 12,
    metaTitle: 'Java Interview Questions Guide — Campus Prep 2026',
    metaDescription:
      'Complete Java interview preparation for Indian campus placements: OOP, collections, threads, Spring, and a 4-week study plan.',
    tags: ['technical-interview', 'placement-prep', 'coding-interview'],
  },
  {
    slug: 'python-interview-questions-guide',
    title: 'Python Interview Questions — Data & Backend Campus Guide',
    excerpt:
      'Prepare Python fundamentals, data structures, Django/FastAPI, and ML libraries for analytics, backend, and data science campus roles.',
    content: `# Python Interview Questions — Data & Backend Campus Guide

Python hiring spans backend web development, data analytics, and machine learning internships. Startups prefer FastAPI/Django profiles; data teams test Pandas, NumPy, and SQL integration.

## High-frequency topics

- List vs tuple, dict comprehensions, generators  
- GIL and multiprocessing vs threading  
- Decorators, context managers, and \`*args/**kwargs\`  
- Django MVT or FastAPI dependency injection  
- Pandas groupby, merge, and missing value handling

## Project talking points

Explain one analytics notebook and one API project. Interviewers probe how you structured modules, handled virtual environments, and wrote tests with pytest.

## 3-week sprint

Days 1–7: Python core + 50 HackerRank easy problems.  
Days 8–14: FastAPI CRUD + PostgreSQL.  
Days 15–21: Pandas case study + 30 medium Python Q&A revisions.

See the full [Python interview question bank](/prepare/interview-questions/topic/python).`,
    readingTimeMinutes: 10,
    metaTitle: 'Python Interview Questions — Campus Placement Guide',
    metaDescription:
      'Python interview prep for campus: core language, web frameworks, data stack, and project tips for Indian students.',
    tags: ['technical-interview', 'placement-prep', 'coding-interview'],
  },
  {
    slug: 'sql-interview-questions-guide',
    title: 'SQL Interview Questions — Queries, Joins & Optimization',
    excerpt:
      'Ace SQL rounds with joins, window functions, indexing, and normalization — essential for analyst, backend, and service-company aptitude tracks.',
    content: `# SQL Interview Questions — Queries, Joins & Optimization

SQL appears in almost every campus pipeline: standalone DB rounds, backend pairing interviews, and data analyst screenings. Indian service companies often include 10–15 SQL questions in technical assessments.

## Must-know concepts

**Joins:** INNER, LEFT, RIGHT, FULL — know when rows drop or duplicate.  
**Aggregations:** GROUP BY with HAVING filters after grouping.  
**Window functions:** ROW_NUMBER, RANK, LAG/LEAD for ranking and time-series.  
**Indexing:** B-tree basics, when indexes help vs hurt writes.  
**Normalization:** 1NF–3NF and when denormalization is justified.

## Practice approach

Use SQLBolt, LeetCode SQL study plan, and HackerRank SQL tracks. Write queries without GUI autocomplete to simulate interview pressure.

## Sample scenario questions

- Second highest salary per department  
- Monthly active users with cohort retention  
- Detect duplicate email registrations  
- Explain EXPLAIN plan for a slow query

Review [SQL interview questions](/prepare/interview-questions/topic/sql) sorted by difficulty.`,
    readingTimeMinutes: 11,
    metaTitle: 'SQL Interview Questions — Campus Database Prep',
    metaDescription:
      'SQL interview preparation: joins, window functions, indexing, and practice plan for campus placements in India.',
    tags: ['technical-interview', 'aptitude', 'placement-prep'],
  },
  {
    slug: 'javascript-interview-questions-guide',
    title: 'JavaScript Interview Questions — Frontend & Full Stack Prep',
    excerpt:
      'Closures, promises, event loop, and ES6+ patterns — the JavaScript topics every MERN and frontend campus candidate must master.',
    content: `# JavaScript Interview Questions — Frontend & Full Stack Prep

JavaScript fundamentals separate strong frontend candidates from resume-only applicants. Even backend Node.js roles start with language deep dives before framework questions.

## Core concepts interviewers love

- **Closures** and lexical scope  
- **Event loop**, microtasks vs macrotasks  
- **Promises, async/await**, error propagation  
- **Prototypes** vs class syntax  
- **this** binding rules in strict mode  
- Shallow vs deep copy strategies

## Coding patterns

Practice debounce, throttle, flatten nested arrays, polyfill Promise.all, and implement memoization. These appear frequently in startup onsite rounds.

## Preparation timeline

Spend 70% time on language, 30% on DOM/React if targeting frontend. Full-stack candidates should add Node event loop and stream basics.

Explore [JavaScript interview questions](/prepare/interview-questions/topic/javascript) with detailed answers.`,
    readingTimeMinutes: 10,
    metaTitle: 'JavaScript Interview Questions — Campus JS Guide',
    metaDescription:
      'JavaScript interview prep: closures, async, event loop, and coding patterns for Indian campus frontend and MERN roles.',
    tags: ['technical-interview', 'coding-interview', 'placement-prep'],
  },
  {
    slug: 'react-interview-questions-guide',
    title: 'React Interview Questions — Hooks, State & Performance',
    excerpt:
      'Prepare React hooks, reconciliation, state management, and Next.js SSR questions for frontend campus interviews at product companies.',
    content: `# React Interview Questions — Hooks, State & Performance

React dominates Indian startup and product company frontend hiring. Interviews progress from JSX basics to hooks, performance optimization, and system-level component design.

## Essential topics

- Virtual DOM and reconciliation algorithm  
- useState, useEffect cleanup, useRef, useMemo, useCallback  
- Controlled vs uncontrolled components  
- Context vs Redux/Zustand trade-offs  
- React 18 concurrent features overview  
- Next.js App Router vs Pages Router

## Build proof

Ship one polished portfolio app with routing, API integration, loading states, and accessibility. Walk through folder structure and state decisions in interviews.

## Mock question categories

Explain why keys matter in lists, how to prevent unnecessary re-renders, and when to lift state up vs use global store.

Study [React interview questions](/prepare/interview-questions/topic/react) with easy to hard filters.`,
    readingTimeMinutes: 9,
    metaTitle: 'React Interview Questions — Frontend Campus Guide',
    metaDescription:
      'React interview preparation: hooks, performance, state management, and Next.js for campus frontend hiring.',
    tags: ['technical-interview', 'coding-interview', 'placement-prep'],
  },
  {
    slug: 'nodejs-interview-questions-guide',
    title: 'Node.js Interview Questions — Backend & MERN Stack Guide',
    excerpt:
      'Event loop, Express middleware, authentication, and scaling Node APIs — complete prep for backend campus and startup interviews.',
    content: `# Node.js Interview Questions — Backend & MERN Stack Guide

Node.js powers MERN stack portfolios common in Indian campus projects. Interviewers test runtime internals before Express routing and database integration.

## Priority topics

- Event loop phases and libuv thread pool  
- Streams and backpressure  
- Express middleware chain and error handling  
- JWT authentication flow  
- MongoDB schema design vs PostgreSQL for Node APIs  
- Cluster module and horizontal scaling intro

## Security checklist

Validate inputs with Zod, rate-limit auth routes, use helmet, never store plaintext passwords, and sanitize NoSQL injection vectors in MongoDB queries.

## Capstone advice

Deploy an API with logging, health checks, Docker, and CI pipeline — then rehearse architecture explanation for 5 minutes without slides.

Browse [Node.js interview questions](/prepare/interview-questions/topic/nodejs).`,
    readingTimeMinutes: 10,
    metaTitle: 'Node.js Interview Questions — MERN Campus Prep',
    metaDescription:
      'Node.js interview guide: event loop, Express, auth, MongoDB, and deployment for campus backend roles.',
    tags: ['technical-interview', 'coding-interview', 'placement-prep'],
  },
  {
    slug: 'system-design-interview-guide',
    title: 'System Design Interview Guide for Campus Product Roles',
    excerpt:
      'Learn scalability basics, caching, sharding, and classic problems like URL shorteners — for final-year students targeting ₹15+ LPA product offers.',
    content: `# System Design Interview Guide for Campus Product Roles

System design rounds typically appear after clearing DSA screens at Amazon, Flipkart, Uber, and similar product companies recruiting from Indian campuses.

## Framework for 45-minute rounds

1. **Clarify requirements** — functional vs non-functional (scale, latency, consistency)  
2. **Estimate capacity** — DAU, QPS, storage per year  
3. **High-level diagram** — clients, LB, services, caches, databases  
4. **Deep dive** — data model, API design, bottlenecks  
5. **Trade-offs** — SQL vs NoSQL, strong vs eventual consistency

## Beginner-friendly problems

- URL shortener  
- Rate limiter  
- Notification system  
- News feed  
- Chat messaging

## Prerequisites

Complete at least 150 DSA problems and one backend project before system design — otherwise trade-off discussions lack grounding.

Practice with [System Design interview questions](/prepare/interview-questions/topic/system-design) and the [System Design roadmap](/prepare/roadmaps/system-design-roadmap).`,
    readingTimeMinutes: 14,
    metaTitle: 'System Design Interview Guide — Campus Product Prep',
    metaDescription:
      'System design interview framework, classic problems, and prep timeline for Indian campus product company hiring.',
    tags: ['system-design', 'technical-interview', 'product-companies'],
  },
  {
    slug: 'hr-interview-questions-guide',
    title: 'HR Interview Questions — Campus Placement HR Round Guide',
    excerpt:
      'Answer "Tell me about yourself", salary expectations, relocation, and gap-year questions confidently in service and product HR rounds.',
    content: `# HR Interview Questions — Campus Placement HR Round Guide

HR rounds filter communication, stability, and cultural fit after technical clearance. Indian service companies weight HR heavily for final offer decisions.

## Structure your answers

Use **Present → Past → Future** for introductions. Keep answers 60–90 seconds. Back claims with one concrete example from college projects, internships, or leadership roles.

## Frequently asked HR questions

- Tell me about yourself  
- Why should we hire you?  
- Why this company?  
- Strengths and weaknesses  
- Salary expectations  
- Willingness to relocate  
- Gap year / backlogs explanation  
- Where do you see yourself in 5 years?

## Red flags to avoid

Badmouthing previous employers, unrealistic salary demands without research, and vague career goals. Research company values and recent news before the call.

Review detailed [HR interview questions](/prepare/interview-questions/topic/hr) with sample scripts.`,
    readingTimeMinutes: 8,
    metaTitle: 'HR Interview Questions — Campus HR Round Prep',
    metaDescription:
      'HR interview preparation for campus placements: common questions, answer frameworks, and mistakes to avoid.',
    tags: ['hr-interview', 'placement-prep', 'on-campus'],
  },
  {
    slug: 'behavioral-interview-questions-guide',
    title: 'Behavioral Interview Questions — STAR Method Guide',
    excerpt:
      'Use the STAR method to answer leadership, conflict, and failure questions in behavioral rounds at product and consulting companies.',
    content: `# Behavioral Interview Questions — STAR Method Guide

Behavioral interviews assess how you handled real situations — teamwork, deadlines, ethical dilemmas, and failure recovery. Product companies and consulting firms use them alongside technical rounds.

## STAR method

**S**ituation — one sentence context  
**T**ask — your responsibility  
**A**ction — specific steps you took (use "I", not "we")  
**R**esult — measurable outcome or learning

## Prepare 6 story buckets

1. Technical challenge overcome  
2. Team conflict resolved  
3. Leadership without authority  
4. Tight deadline delivery  
5. Failure and improvement  
6. Initiative beyond coursework

## Campus-friendly examples

Open-source contribution, fest organizing, hackathon pivot, mentoring juniors, internship feedback implementation — all valid if structured with metrics.

Practice [Behavioral interview questions](/prepare/interview-questions/topic/behavioral) with STAR outlines.`,
    readingTimeMinutes: 9,
    metaTitle: 'Behavioral Interview Questions — STAR Method Campus',
    metaDescription:
      'Behavioral interview prep with STAR method, story buckets, and examples for Indian campus product hiring.',
    tags: ['hr-interview', 'placement-prep', 'product-companies'],
  },
  {
    slug: 'dsa-interview-questions-guide',
    title: 'DSA Interview Questions — Coding Round Master Guide',
    excerpt:
      'Pattern-based DSA preparation: arrays, trees, graphs, DP, and timed practice strategies for campus coding interviews.',
    content: `# DSA Interview Questions — Coding Round Master Guide

Coding rounds eliminate the largest share of campus applicants. A pattern-based approach beats random problem grinding for TCS CodeVita, Amazon OA, and onsite whiteboard rounds.

## Top patterns by frequency

1. Two pointers & sliding window  
2. Binary search on answer  
3. BFS/DFS on grids and graphs  
4. Top K with heaps  
5. Prefix sums  
6. Monotonic stack  
7. 1D/2D dynamic programming

## Weekly schedule (8 weeks)

- **Weeks 1–2:** Arrays, strings, hashing (80 problems)  
- **Weeks 3–4:** Linked lists, stacks, queues, trees (70 problems)  
- **Weeks 5–6:** Graphs, heaps, intervals (60 problems)  
- **Weeks 7–8:** DP + weekly contests + mistake log review

## Interview execution tips

Repeat the problem aloud, clarify edge cases, propose brute force then optimize, code cleanly, and test with custom examples before saying done.

Access [DSA interview questions](/prepare/interview-questions/topic/dsa) and the [DSA roadmap](/prepare/roadmaps/dsa-placement-roadmap).`,
    readingTimeMinutes: 13,
    metaTitle: 'DSA Interview Questions — Coding Round Campus Guide',
    metaDescription:
      'DSA interview preparation: patterns, 8-week plan, and coding round tips for Indian campus placements.',
    tags: ['dsa', 'coding-interview', 'placement-prep'],
  },
];

const SUPPLEMENTARY_ARTICLES: InterviewArticleDef[] = [
  {
    slug: 'campus-technical-interview-checklist',
    title: 'Campus Technical Interview Checklist — Day-Before & Day-Of',
    excerpt: 'A practical checklist covering logistics, revision priorities, and mindset for campus technical interview day.',
    content: `# Campus Technical Interview Checklist

## Day before
- Confirm venue/link, ID documents, and dress code  
- Revise 5 weak DSA patterns and 10 flashcard concepts  
- Prepare 2-min self-intro and 3 project talking points  
- Sleep 7+ hours — fatigue kills recursion intuition

## Day of
- Reach 20 minutes early (or join virtual room 5 min early)  
- Carry pen, notebook, water, and printed resume copies  
- Ask clarifying questions before coding  
- Communicate thought process continuously

## After each round
- Note questions you struggled with within 30 minutes  
- Send thank-you email if recruiter shared contact (optional, brief)

Combine this checklist with topic guides for [Java](/blog/java-interview-questions-guide), [DSA](/blog/dsa-interview-questions-guide), and [HR](/blog/hr-interview-questions-guide) preparation.`,
    readingTimeMinutes: 5,
    metaTitle: 'Technical Interview Checklist — Campus Day Guide',
    metaDescription: 'Day-before and day-of checklist for campus technical interviews: logistics, revision, and communication tips.',
    tags: ['placement-prep', 'technical-interview', 'on-campus'],
  },
  {
    slug: 'how-to-explain-projects-in-interviews',
    title: 'How to Explain College Projects in Technical Interviews',
    excerpt: 'Structure project explanations with problem, architecture, your role, challenges, and metrics interviewers remember.',
    content: `# How to Explain College Projects in Technical Interviews

Interviewers use projects to verify resume claims. A weak explanation raises red flags even when DSA answers are strong.

## 2-minute project template

1. **Problem** — who needed what and why it mattered  
2. **Stack** — languages, frameworks, database, deployment  
3. **Your role** — specific modules you owned  
4. **Challenge** — one technical hurdle and how you solved it  
5. **Outcome** — users, performance metric, or learning

## Common pitfalls

Listing technologies without depth, claiming team work without personal contribution, and no demo or GitHub link ready.

## Preparation drill

Record yourself explaining each project twice. Cut filler words. Prepare one architecture sketch on paper.

Pair this guide with [behavioral interview prep](/blog/behavioral-interview-questions-guide).`,
    readingTimeMinutes: 7,
    metaTitle: 'Explain Projects in Interviews — Campus Guide',
    metaDescription: 'How to present college projects in campus interviews with a clear 2-minute structure and examples.',
    tags: ['technical-interview', 'resume', 'placement-prep'],
  },
  {
    slug: 'service-company-vs-product-company-interviews',
    title: 'Service Company vs Product Company Interviews — What Changes?',
    excerpt: 'Compare TCS/Infosys style interviews with Amazon/Flipkart rounds — DSA depth, HR weight, and compensation negotiation.',
    content: `# Service Company vs Product Company Interviews

Indian students often apply to both service MNCs and product firms — preparation differs materially.

## Service companies (TCS, Infosys, Wipro, Cognizant)
- Aptitude + moderate coding  
- Java/C basics and SQL  
- HR round heavily weighted  
- Training bond and location flexibility topics  
- Typical fresher band: ₹3.3–7 LPA

## Product companies
- Harder DSA online assessments  
- Multiple technical rounds + system design (senior tracks)  
- Strong project and internship scrutiny  
- Compensation bands wider: ₹10–40+ LPA for top tiers

## Strategy
Apply broadly early semester; shift focus based on shortlists. Do not use identical prep intensity for both — product tracks need 2× DSA volume.

Explore [interview questions by topic](/prepare/interview-questions) on CampusJobsHub.`,
    readingTimeMinutes: 8,
    metaTitle: 'Service vs Product Interview Prep — Campus Guide',
    metaDescription: 'Compare service and product company campus interviews in India: format, difficulty, and prep strategy.',
    tags: ['service-companies', 'product-companies', 'placement-prep'],
  },
  {
    slug: 'coding-interview-time-management',
    title: 'Coding Interview Time Management — 45-Minute Round Strategy',
    excerpt: 'Split coding interview time across understanding, approach, coding, and testing without rushing or stalling.',
    content: `# Coding Interview Time Management

Most campus coding rounds allow 30–45 minutes per problem. Time allocation separates hires from near-misses.

## Suggested split (45 min)
- **0–5 min:** Repeat problem, examples, edge cases  
- **5–12 min:** Brute force + optimized approach  
- **12–35 min:** Clean implementation  
- **35–45 min:** Test cases + complexity analysis

## Signals interviewers want
- Early communication before silent coding  
- Willingness to accept hints without ego  
- Structured debugging when tests fail

## Practice
Use timer on LeetCode medium problems. Stop at 35 minutes even if unfinished — review solution, add pattern to mistake log.

See [DSA interview guide](/blog/dsa-interview-questions-guide) for pattern priorities.`,
    readingTimeMinutes: 6,
    metaTitle: 'Coding Interview Time Management — Campus Tips',
    metaDescription: '45-minute coding interview time split: clarify, plan, code, and test for campus DSA rounds.',
    tags: ['coding-interview', 'dsa', 'placement-prep'],
  },
  {
    slug: 'sql-for-non-cs-students',
    title: 'SQL Interview Prep for Non-CS Engineering Branches',
    excerpt: 'Electronics, mechanical, and civil students targeting analyst and service-company tracks — SQL basics that pass screening.',
    content: `# SQL Interview Prep for Non-CS Students

Many Indian service companies hire non-CS branches into analyst and developer trainee roles with SQL-heavy screenings.

## Minimum viable SQL (2 weeks)
- SELECT, WHERE, ORDER BY, LIMIT  
- INNER JOIN two tables  
- COUNT, SUM, AVG, GROUP BY  
- INSERT, UPDATE (theory level)  
- Primary key vs foreign key concepts

## Practice path
SQLBolt lessons 1–18, then 20 HackerRank easy SQL tasks. Focus on reading queries, not DBA administration.

## Pair with aptitude
Non-CS candidates often face higher aptitude weight — balance weekly schedule 50/50 SQL+aptitude until first shortlist.

Browse [SQL interview questions](/prepare/interview-questions/topic/sql) for structured Q&A.`,
    readingTimeMinutes: 7,
    metaTitle: 'SQL Prep for Non-CS Campus Candidates',
    metaDescription: 'SQL interview preparation for non-CS engineering students targeting analyst and service company roles.',
    tags: ['aptitude', 'technical-interview', 'placement-prep'],
  },
  {
    slug: 'mock-interview-schedule-final-year',
    title: 'Mock Interview Schedule for Final-Year Placement Season',
    excerpt: 'A 6-week mock interview calendar mixing DSA, HR, and system design with peers and mentors.',
    content: `# Mock Interview Schedule for Final-Year Students

Mocks convert knowledge into interview performance. Solo LeetCode practice is insufficient for communication-heavy Indian campus formats.

## 6-week calendar
- **Week 1–2:** 2× peer DSA mocks (45 min each)  
- **Week 3:** 1× HR mock + resume review  
- **Week 4:** 2× technical mocks (Java/Python + project deep dive)  
- **Week 5:** 1× system design mock (product aspirants)  
- **Week 6:** Full loop simulation (OA + tech + HR)

## Feedback capture
Score communication, correctness, and speed 1–5. Track recurring weak patterns.

## Resources
Use CampusJobsHub [interview question bank](/prepare/interview-questions) as mock question source.`,
    readingTimeMinutes: 6,
    metaTitle: 'Mock Interview Schedule — Final Year Placements',
    metaDescription: '6-week mock interview plan for final-year campus placement season with DSA, HR, and system design.',
    tags: ['placement-prep', 'technical-interview', 'on-campus'],
  },
  {
    slug: 'internship-to-ppo-interview-prep',
    title: 'Internship to PPO — Interview Preparation Guide',
    excerpt: 'Convert summer internships into pre-placement offers with performance reviews, stakeholder visibility, and PPO interview prep.',
    content: `# Internship to PPO Interview Preparation

PPO interviews are shorter but higher stakes — interviewers already know your internship performance.

## During internship
- Document weekly deliverables  
- Ask for mid-internship feedback  
- Ship one visible improvement with metrics  
- Build mentor relationship for referral support

## PPO interview focus
- Deep dive on internship project  
- Culture fit and team collaboration examples  
- Willingness to join full-time location and date

## If PPO fails
Request referral to other teams, add manager LinkedIn recommendation, and leverage brand on resume for off-campus.

Find [PPO internships](/internships/ppo) and [HR questions](/prepare/interview-questions/topic/hr).`,
    readingTimeMinutes: 7,
    metaTitle: 'Internship to PPO Interview Prep Guide',
    metaDescription: 'Convert internships to PPO offers: performance tips and interview preparation for Indian students.',
    tags: ['internship', 'placement-prep', 'hr-interview'],
  },
  {
    slug: 'online-assessment-hacks-campus',
    title: 'Online Assessment (OA) Strategy for Campus Hiring',
    excerpt: 'Proctoring rules, tab switching, IDE setup, and problem-order strategy for CodeVita, HackerRank, and Mettl OAs.',
    content: `# Online Assessment Strategy for Campus Hiring

Most Indian campus pipelines start with proctored OAs on HackerRank, AMCAT, Mettl, or custom platforms.

## Before OA day
- Test webcam, mic, and stable internet  
- Practice on the same platform vendor if known  
- Review company-specific OA archives on CampusJobsHub and LeetCode discuss

## During OA
- Skim all questions first — solve easiest for confidence  
- Watch time boxes; do not stuck on one hard problem  
- For proctored tests: no phone, clear desk, good lighting

## After OA
Note question patterns for batchmates (ethically — no sharing active questions). Update prep plan within 24 hours.

Combine with [DSA guide](/blog/dsa-interview-questions-guide).`,
    readingTimeMinutes: 6,
    metaTitle: 'Campus Online Assessment Strategy — OA Tips',
    metaDescription: 'Online assessment tips for campus hiring: proctoring, time strategy, and platform preparation.',
    tags: ['coding-interview', 'on-campus', 'placement-prep'],
  },
  {
    slug: 'group-discussion-to-interview-transition',
    title: 'From Group Discussion to Technical Interview — What to Expect',
    excerpt: 'After GD shortlists in mass recruiters, prepare for aptitude, coding, and HR — transition timeline explained.',
    content: `# From Group Discussion to Technical Interview

Mass recruiters (especially service companies) use GD filters before technical tests.

## Typical pipeline
1. Resume screening  
2. Aptitude test  
3. Group discussion  
4. Technical interview  
5. HR interview  
6. Offer roll-out

## Post-GD preparation (1–2 weeks gap)
- Revise OOP and SQL flashcards  
- Practice 2 easy + 1 medium coding problem daily  
- Prepare HR intro and company research

## GD tips that carry forward
Structured speaking in GD trains interview communication — use same clarity in technical explanations.

See [HR interview guide](/blog/hr-interview-questions-guide).`,
    readingTimeMinutes: 5,
    metaTitle: 'GD to Technical Interview — Campus Pipeline Guide',
    metaDescription: 'What happens after group discussion in campus hiring and how to prepare for technical rounds.',
    tags: ['group-discussion', 'on-campus', 'placement-prep'],
  },
  {
    slug: 'salary-negotiation-campus-offers',
    title: 'Salary Negotiation for Campus Offers — When and How',
    excerpt: 'Understand CTC breakdown, competing offers, and polite negotiation scripts for campus placement offers in India.',
    content: `# Salary Negotiation for Campus Offers

First job negotiation feels intimidating but modest improvements compound over a career.

## Know your CTC
Separate fixed, variable, joining bonus, and stock. Compare take-home, not headline CTC alone.

## When negotiation works
- Multiple offers in hand  
- Niche skills (ML, security, full-stack with deployment)  
- Product companies with band flexibility  
Rare for single service offer with fixed campus band — focus on location preference instead.

## Script example
"Thank you for the offer. Based on my internship experience in X and competing opportunity at Y LPA fixed, is there flexibility in the fixed component?"

Read [HR salary questions](/prepare/interview-questions/topic/hr) for interviewer perspective.`,
    readingTimeMinutes: 8,
    metaTitle: 'Campus Offer Salary Negotiation — India Guide',
    metaDescription: 'Salary negotiation tips for campus placement offers: CTC breakdown, timing, and sample scripts.',
    tags: ['salary-negotiation', 'hr-interview', 'placement-prep'],
  },
  {
    slug: 'resume-keywords-for-ats-interviews',
    title: 'Resume Keywords That Survive ATS and Impress Interviewers',
    excerpt: 'Align resume skills with job descriptions and interview topics so ATS screens and technical rounds stay consistent.',
    content: `# Resume Keywords for ATS and Interviews

Mismatch between resume skills and interview answers is a common rejection reason.

## Keyword strategy
- Mirror JD skills section honestly  
- Group skills: Languages, Frameworks, Tools, Soft skills  
- Quantify projects (latency reduced 40%, 500+ users)  
- One page for freshers; no photo unless employer requests

## Interview alignment
If resume lists Redis, prepare one caching scenario. If React is listed, expect hook questions.

Use [Resume AI](/resume) and [JavaScript interview prep](/blog/javascript-interview-questions-guide).`,
    readingTimeMinutes: 6,
    metaTitle: 'Resume Keywords for ATS — Campus Interview Align',
    metaDescription: 'ATS-friendly resume keywords aligned with campus interview topics for Indian students.',
    tags: ['resume', 'ats', 'placement-prep'],
  },
  {
    slug: 'off-campus-interview-preparation',
    title: 'Off-Campus Interview Preparation — Referrals and OA Trackers',
    excerpt: 'Apply off-campus when college drives miss dream companies — referrals, LinkedIn, and consistent OA practice.',
    content: `# Off-Campus Interview Preparation

Off-campus hiring expands options beyond college T&P restrictions.

## Channels
- Employee referrals (strongest)  
- Company career pages and LinkedIn Easy Apply  
- Community job boards and hackathon networks  
- Startup job listings on CampusJobsHub

## Weekly rhythm
- 5 tailored applications  
- 10 DSA problems  
- 1 mock interview  
- Track status in spreadsheet

## Mindset
Rejection volume is higher — treat each OA as practice data.

Browse [fresher jobs](/jobs/fresher) and [interview questions](/prepare/interview-questions).`,
    readingTimeMinutes: 7,
    metaTitle: 'Off-Campus Interview Prep — India Student Guide',
    metaDescription: 'Off-campus placement preparation: referrals, applications, and interview practice for Indian graduates.',
    tags: ['off-campus', 'placement-prep', 'fresher-jobs'],
  },
  {
    slug: 'machine-learning-interview-campus',
    title: 'Machine Learning Interview Questions for Campus AI Roles',
    excerpt: 'ML fresher interviews cover sklearn pipelines, bias-variance, evaluation metrics, and project depth — prep guide.',
    content: `# Machine Learning Interview Questions for Campus AI Roles

ML campus roles expect statistics intuition plus Python implementation — not just Coursera certificates.

## Core topics
- Train/validation/test splits and cross-validation  
- Bias-variance trade-off  
- Precision, recall, F1, ROC-AUC  
- Overfitting regularization (L1/L2)  
- Feature scaling and encoding  
- Basic neural network concepts

## Project expectations
End-to-end notebook: problem statement, EDA, model comparison, error analysis, deployment sketch.

Link to [Python interview guide](/blog/python-interview-questions-guide) and [AI/ML roadmap](/prepare/roadmaps/ai-ml-engineer-roadmap).`,
    readingTimeMinutes: 10,
    metaTitle: 'ML Interview Questions — Campus AI Hiring Guide',
    metaDescription: 'Machine learning interview preparation for campus AI/ML roles: metrics, projects, and study topics.',
    tags: ['technical-interview', 'placement-prep', 'coding-interview'],
  },
  {
    slug: 'devops-interview-questions-campus',
    title: 'DevOps Interview Questions for Campus Platform Roles',
    excerpt: 'Linux, Git, Docker, CI/CD, and Kubernetes basics for DevOps graduate trainee and platform engineer campus tracks.',
    content: `# DevOps Interview Questions for Campus Platform Roles

DevOps campus hiring grew as companies ship faster with containers and pipelines.

## Interview stack
- Linux commands and permissions  
- Git branching (GitFlow vs trunk)  
- Dockerfile best practices  
- CI/CD YAML pipelines  
- Kubernetes pods, services, deployments  
- Cloud IAM basics

## Portfolio proof
GitHub Actions pipeline deploying a Dockerized app beats listing tools without demos.

See [DevOps roadmap](/prepare/roadmaps/devops-engineer-roadmap) and [Node.js backend guide](/blog/nodejs-interview-questions-guide).`,
    readingTimeMinutes: 9,
    metaTitle: 'DevOps Interview Questions — Campus Platform Prep',
    metaDescription: 'DevOps campus interview prep: Linux, Docker, Kubernetes, CI/CD, and project ideas.',
    tags: ['technical-interview', 'placement-prep', 'coding-interview'],
  },
  {
    slug: 'frontend-system-design-lite',
    title: 'Frontend System Design — Component Architecture for Interviews',
    excerpt: 'Lightweight frontend design interviews: component trees, state, API layers, and performance for product UI roles.',
    content: `# Frontend System Design Lite

Some product companies ask frontend architecture questions — especially for React-heavy teams.

## Design prompts
- Design autocomplete search component  
- Design infinite scroll feed  
- Design multi-step form wizard with validation  
- Design notification bell with real-time updates

## Framework
Requirements → component hierarchy → state location → API contract → loading/error states → accessibility → performance (virtualization).

Pair with [React interview guide](/blog/react-interview-questions-guide) and [Frontend roadmap](/prepare/roadmaps/frontend-developer-roadmap).`,
    readingTimeMinutes: 8,
    metaTitle: 'Frontend System Design — Campus UI Interview',
    metaDescription: 'Frontend system design interview prep: components, state, and performance for campus UI roles.',
    tags: ['system-design', 'technical-interview', 'coding-interview'],
  },
];

const ALL_INTERVIEW_ARTICLES = [...INTERVIEW_HUB_ARTICLES, ...SUPPLEMENTARY_ARTICLES];

export async function seedInterviewQuestions(ctx: SeedContext): Promise<string[]> {
  const paths: string[] = [];
  let globalIndex = 0;

  for (const bank of INTERVIEW_TOPIC_BANKS) {
    for (let i = 0; i < bank.questions.length; i++) {
      const entry = bank.questions[i]!;
      const slug = slugForQuestion(bank.topicSlug, i, entry.difficulty);
      const template = buildInterviewQuestionTemplate({
        question: entry.question,
        slug,
        answer: entry.answer,
        topic: bank.topic,
        difficulty: entry.difficulty,
        role: bank.topic === 'HR' || bank.topic === 'Behavioral' ? 'HR' : 'Technical',
      });

      await ctx.prisma.interviewQuestion.upsert({
        where: { slug: template.slug },
        update: {
          question: template.question,
          answer: template.answer,
          topic: template.topic,
          difficulty: template.difficulty as DifficultyLevel,
          role: template.role,
          isPublished: true,
          metaTitle: template.seo.metaTitle,
          metaDescription: template.seo.metaDescription,
        },
        create: {
          slug: template.slug,
          question: template.question,
          answer: template.answer,
          topic: template.topic,
          difficulty: template.difficulty as DifficultyLevel,
          role: template.role,
          isPublished: true,
          metaTitle: template.seo.metaTitle,
          metaDescription: template.seo.metaDescription,
        },
      });

      paths.push(`/prepare/interview-questions/${template.slug}`);
      globalIndex++;
    }

    paths.push(`/prepare/interview-questions/topic/${bank.topicSlug}`);
  }

  paths.push('/prepare/interview-questions');
  console.log(`Seeded ${globalIndex} interview questions across ${INTERVIEW_TOPIC_BANKS.length} topics`);
  return paths;
}

export async function seedInterviewArticles(ctx: SeedContext): Promise<string[]> {
  const paths: string[] = [];
  const categoryId =
    ctx.categoryIds.get('placement-tips') ?? ctx.categoryIds.values().next().value;

  if (!categoryId) {
    console.warn('seedInterviewArticles: no blog category found, skipping articles');
    return paths;
  }

  for (const article of ALL_INTERVIEW_ARTICLES) {
    const tagConnect = article.tags
      .map((tagSlug) => ctx.tagIds.get(tagSlug))
      .filter((id): id is string => Boolean(id))
      .map((tagId) => ({ tagId }));

    await ctx.prisma.blogPost.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        readingTimeMinutes: article.readingTimeMinutes,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        ogImageUrl: blogImageUrl(article.slug, 'interview-articles'),
        status: 'published',
        publishedAt: new Date(),
        isFeatured: INTERVIEW_HUB_ARTICLES.some((h) => h.slug === article.slug),
        categoryId,
        ...(tagConnect.length > 0
          ? {
              tags: {
                deleteMany: {},
                create: tagConnect,
              },
            }
          : {}),
      },
      create: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        authorId: ctx.authorId,
        categoryId,
        status: 'published',
        readingTimeMinutes: article.readingTimeMinutes,
        publishedAt: new Date(),
        isFeatured: INTERVIEW_HUB_ARTICLES.some((h) => h.slug === article.slug),
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        ogImageUrl: blogImageUrl(article.slug, 'interview-articles'),
        canonicalUrl: `/blog/${article.slug}`,
        ...(tagConnect.length > 0 ? { tags: { create: tagConnect } } : {}),
      },
    });

    paths.push(`/blog/${article.slug}`);
  }

  console.log(`Seeded ${ALL_INTERVIEW_ARTICLES.length} interview hub articles`);
  return paths;
}

/** Seeds interview question bank + hub articles in one call */
export async function seedInterviewContent(ctx: SeedContext): Promise<string[]> {
  const questionPaths = await seedInterviewQuestions(ctx);
  const articlePaths = await seedInterviewArticles(ctx);
  return [...questionPaths, ...articlePaths];
}

export { ALL_INTERVIEW_ARTICLES, INTERVIEW_HUB_ARTICLES };
