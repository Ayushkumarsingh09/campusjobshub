import type {
  BlogPost,
  CareerRoadmap,
  Company,
  Internship,
  InterviewQuestion,
  Job,
} from '@/types/api';
import { companyLogoPath } from '@/lib/images/company-logos';
import { FALLBACK_BLOG_SLUGS, FALLBACK_COMPANY_SLUGS, FALLBACK_ROADMAP_SLUGS } from './static-export-params';

const NOW = '2026-06-01T00:00:00.000Z';

const COMPANY_META: Record<
  string,
  { name: string; industry: string; city: string; state: string; website: string }
> = {
  google: { name: 'Google', industry: 'Technology & Internet', city: 'Bangalore', state: 'Karnataka', website: 'https://www.google.com' },
  microsoft: { name: 'Microsoft', industry: 'Technology & Software', city: 'Hyderabad', state: 'Telangana', website: 'https://www.microsoft.com' },
  amazon: { name: 'Amazon', industry: 'E-commerce & Cloud Computing', city: 'Bangalore', state: 'Karnataka', website: 'https://www.amazon.in' },
  meta: { name: 'Meta', industry: 'Social Media & Technology', city: 'Gurugram', state: 'Haryana', website: 'https://www.meta.com' },
  apple: { name: 'Apple', industry: 'Consumer Electronics & Software', city: 'Hyderabad', state: 'Telangana', website: 'https://www.apple.com' },
  netflix: { name: 'Netflix', industry: 'Entertainment & Streaming', city: 'Mumbai', state: 'Maharashtra', website: 'https://www.netflix.com' },
  adobe: { name: 'Adobe', industry: 'Software & Creative Technology', city: 'Noida', state: 'Uttar Pradesh', website: 'https://www.adobe.com' },
  oracle: { name: 'Oracle', industry: 'Enterprise Software & Cloud', city: 'Bangalore', state: 'Karnataka', website: 'https://www.oracle.com' },
  ibm: { name: 'IBM', industry: 'Technology & Consulting', city: 'Bangalore', state: 'Karnataka', website: 'https://www.ibm.com' },
  tcs: { name: 'Tata Consultancy Services', industry: 'Consulting & IT Services', city: 'Mumbai', state: 'Maharashtra', website: 'https://www.tcs.com' },
  infosys: { name: 'Infosys', industry: 'IT Services & Consulting', city: 'Bangalore', state: 'Karnataka', website: 'https://www.infosys.com' },
  wipro: { name: 'Wipro', industry: 'IT Services & Consulting', city: 'Bangalore', state: 'Karnataka', website: 'https://www.wipro.com' },
  accenture: { name: 'Accenture', industry: 'Consulting & IT Services', city: 'Bangalore', state: 'Karnataka', website: 'https://www.accenture.com' },
  cognizant: { name: 'Cognizant', industry: 'IT Services & Digital Engineering', city: 'Chennai', state: 'Tamil Nadu', website: 'https://www.cognizant.com' },
  capgemini: { name: 'Capgemini', industry: 'Consulting & Technology Services', city: 'Mumbai', state: 'Maharashtra', website: 'https://www.capgemini.com' },
  deloitte: { name: 'Deloitte', industry: 'Professional Services & Consulting', city: 'Hyderabad', state: 'Telangana', website: 'https://www.deloitte.com' },
  hcl: { name: 'HCLTech', industry: 'IT Services & Products', city: 'Noida', state: 'Uttar Pradesh', website: 'https://www.hcltech.com' },
  zoho: { name: 'Zoho', industry: 'SaaS & Business Software', city: 'Chennai', state: 'Tamil Nadu', website: 'https://www.zoho.com' },
  'tech-mahindra': { name: 'Tech Mahindra', industry: 'IT Services & Consulting', city: 'Pune', state: 'Maharashtra', website: 'https://www.techmahindra.com' },
  'lti-mindtree': { name: 'LTI Mindtree', industry: 'IT Services & Consulting', city: 'Mumbai', state: 'Maharashtra', website: 'https://www.ltimindtree.com' },
  flipkart: { name: 'Flipkart', industry: 'E-commerce & Technology', city: 'Bangalore', state: 'Karnataka', website: 'https://www.flipkart.com' },
  razorpay: { name: 'Razorpay', industry: 'Fintech & Payments', city: 'Bangalore', state: 'Karnataka', website: 'https://razorpay.com' },
  freshworks: { name: 'Freshworks', industry: 'SaaS & Customer Experience', city: 'Chennai', state: 'Tamil Nadu', website: 'https://www.freshworks.com' },
  paytm: { name: 'Paytm', industry: 'Fintech & Digital Payments', city: 'Noida', state: 'Uttar Pradesh', website: 'https://paytm.com' },
  phonepe: { name: 'PhonePe', industry: 'Fintech & Payments', city: 'Bangalore', state: 'Karnataka', website: 'https://www.phonepe.com' },
};

/** Legacy/wrong slugs → canonical seed slugs */
export const LEGACY_SLUG_REDIRECTS: Record<string, string> = {
  'dsa-placement-prep': 'dsa-placement-roadmap',
  'full-stack-web-development': 'full-stack-developer-roadmap',
  'data-science-fundamentals': 'data-science-roadmap',
  'backend-developer-roadmap': 'backend-developer-roadmap',
  'frontend-developer-roadmap': 'frontend-developer-roadmap',
};

export function resolveCanonicalSlug(slug: string): string {
  const normalized = slug.toLowerCase().trim().replace(/\s+/g, '-');
  return LEGACY_SLUG_REDIRECTS[normalized] ?? normalized;
}

function makeCompany(slug: string, index: number): Company {
  const meta = COMPANY_META[slug] ?? {
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    industry: 'Technology',
    city: 'Bangalore',
    state: 'Karnataka',
    website: 'https://campusjobshub.com',
  };
  return {
    id: `fallback-co-${slug}`,
    slug,
    name: meta.name,
    description: `${meta.name} actively hires campus talent and fresh graduates across India. Browse open jobs, internships, and interview preparation guides on CampusJobsHub.`,
    logoUrl: companyLogoPath(slug),
    website: meta.website,
    industry: meta.industry,
    headquartersCity: meta.city,
    headquartersState: meta.state,
    isVerified: true,
    ownerUserId: 'fallback',
    jobCount: 3 + (index % 5),
    internshipCount: 1 + (index % 3),
    createdAt: NOW,
    updatedAt: NOW,
  };
}

export const FALLBACK_COMPANIES: Company[] = FALLBACK_COMPANY_SLUGS.map(makeCompany);

export function getFallbackCompany(slug: string): Company | null {
  const canonical = resolveCanonicalSlug(slug);
  return FALLBACK_COMPANIES.find((c) => c.slug === canonical) ?? null;
}

const FEATURED_JOB_DEFS = [
  { slug: 'job-000-software-engineer-google-bangalore-2026', title: 'Software Engineer', companySlug: 'google', city: 'Bangalore', state: 'Karnataka', skills: ['Java', 'Python', 'DSA'] },
  { slug: 'job-001-associate-software-engineer-microsoft-hyderabad-2026', title: 'Associate Software Engineer', companySlug: 'microsoft', city: 'Hyderabad', state: 'Telangana', skills: ['C#', '.NET', 'Azure'] },
  { slug: 'job-002-full-stack-developer-amazon-pune-2026', title: 'Full Stack Developer', companySlug: 'amazon', city: 'Pune', state: 'Maharashtra', skills: ['React', 'Node.js', 'AWS'] },
  { slug: 'job-003-backend-developer-meta-mumbai-2026', title: 'Backend Developer', companySlug: 'meta', city: 'Mumbai', state: 'Maharashtra', skills: ['Python', 'GraphQL', 'PostgreSQL'] },
  { slug: 'job-004-frontend-developer-apple-chennai-2026', title: 'Frontend Developer', companySlug: 'apple', city: 'Chennai', state: 'Tamil Nadu', skills: ['React', 'TypeScript', 'CSS'] },
  { slug: 'job-005-devops-engineer-netflix-delhi-ncr-2026', title: 'DevOps Engineer', companySlug: 'netflix', city: 'Delhi NCR', state: 'Delhi', skills: ['Docker', 'Kubernetes', 'CI/CD'] },
] as const;

function makeJob(def: (typeof FEATURED_JOB_DEFS)[number], index: number): Job {
  const company = getFallbackCompany(def.companySlug)!;
  return {
    id: `fallback-job-${index}`,
    slug: def.slug,
    title: def.title,
    description: `${company.name} is hiring a ${def.title} in ${def.city}. Apply through CampusJobsHub for campus and fresher openings.`,
    companyId: company.id,
    postedByUserId: 'fallback',
    locationCity: def.city,
    locationState: def.state,
    isRemote: index % 4 === 0,
    experienceMin: 0,
    experienceMax: 1,
    salaryMin: 400000,
    salaryMax: 1200000,
    salaryDisclosed: true,
    employmentType: 'full_time',
    skills: [...def.skills],
    applicationMethod: 'internal',
    status: 'active',
    viewCount: 0,
    applicationCount: 0,
    expiresAt: '2026-12-31T00:00:00.000Z',
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    company: { id: company.id, name: company.name, slug: company.slug, logoUrl: company.logoUrl, isVerified: true },
  };
}

export const FALLBACK_FEATURED_JOBS: Job[] = FEATURED_JOB_DEFS.map(makeJob);

export function getFallbackJob(slug: string): Job | null {
  const canonical = resolveCanonicalSlug(slug);
  return FALLBACK_FEATURED_JOBS.find((j) => j.slug === canonical) ?? null;
}

const INTERNSHIP_DEFS = [
  { slug: 'internship-000-software-development-intern-google-bangalore-2026', title: 'Software Development Intern', companySlug: 'google', city: 'Bangalore', state: 'Karnataka', skills: ['Java', 'Python', 'Git'], ppo: true },
  { slug: 'internship-001-data-science-intern-microsoft-hyderabad-2026', title: 'Data Science Intern', companySlug: 'microsoft', city: 'Hyderabad', state: 'Telangana', skills: ['Python', 'Pandas', 'SQL'], ppo: false },
  { slug: 'internship-002-machine-learning-intern-amazon-pune-2026', title: 'Machine Learning Intern', companySlug: 'amazon', city: 'Pune', state: 'Maharashtra', skills: ['Python', 'TensorFlow', 'ML'], ppo: true },
  { slug: 'internship-003-frontend-development-intern-meta-mumbai-2026', title: 'Frontend Development Intern', companySlug: 'meta', city: 'Mumbai', state: 'Maharashtra', skills: ['React', 'TypeScript', 'CSS'], ppo: false },
  { slug: 'internship-004-backend-development-intern-apple-chennai-2026', title: 'Backend Development Intern', companySlug: 'apple', city: 'Chennai', state: 'Tamil Nadu', skills: ['Node.js', 'API', 'SQL'], ppo: true },
  { slug: 'internship-005-devops-intern-netflix-delhi-ncr-2026', title: 'DevOps Intern', companySlug: 'netflix', city: 'Delhi NCR', state: 'Delhi', skills: ['Docker', 'Linux', 'AWS'], ppo: false },
] as const;

function makeInternship(def: (typeof INTERNSHIP_DEFS)[number], index: number): Internship {
  const company = getFallbackCompany(def.companySlug)!;
  return {
    id: `fallback-intern-${index}`,
    slug: def.slug,
    title: def.title,
    description: `${company.name} offers a ${def.title} in ${def.city}. Paid internship for students — apply on CampusJobsHub.`,
    companyId: company.id,
    postedByUserId: 'fallback',
    locationCity: def.city,
    locationState: def.state,
    isRemote: index % 5 === 0,
    durationMonths: 3 + (index % 3),
    stipendMin: 15000,
    stipendMax: 40000,
    isPaid: true,
    ppoAvailable: def.ppo,
    skills: [...def.skills],
    applicationMethod: 'internal',
    status: 'active',
    viewCount: 0,
    applicationCount: 0,
    expiresAt: '2026-12-31T00:00:00.000Z',
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    company: { id: company.id, name: company.name, slug: company.slug, logoUrl: company.logoUrl, isVerified: true },
  };
}

export const FALLBACK_INTERNSHIPS: Internship[] = INTERNSHIP_DEFS.map(makeInternship);

export function getFallbackInternship(slug: string): Internship | null {
  return FALLBACK_INTERNSHIPS.find((i) => i.slug === slug) ?? null;
}

const BLOG_DEFS: { slug: string; title: string; excerpt: string; category: string; readingTime: number }[] = [
  { slug: 'tcs-campus-hiring-guide-2026', title: 'How to Prepare for TCS NQT 2026', excerpt: 'A complete week-by-week study plan covering aptitude, coding, and interview rounds for TCS National Qualifier Test.', category: 'Placement Prep', readingTime: 8 },
  { slug: 'hr-interview-questions-campus-placement', title: 'Top 50 HR Interview Questions for Freshers', excerpt: 'Practice answers for tell me about yourself, strengths, weaknesses, and salary expectations tailored for Indian campus hiring.', category: 'Interviews', readingTime: 12 },
  { slug: 'ats-friendly-resume-format-india-2026', title: 'Resume Format for Campus Placements in India', excerpt: 'One-page resume templates, section ordering, and ATS-friendly tips that recruiters at Indian IT companies expect.', category: 'Resume', readingTime: 6 },
  { slug: 'google-campus-hiring-guide-2026', title: 'Google Campus Hiring Guide 2026', excerpt: 'Eligibility, interview process, compensation bands, and DSA preparation strategy for Google India campus drives.', category: 'Company Guides', readingTime: 10 },
  { slug: 'microsoft-campus-hiring-guide-2026', title: 'Microsoft Campus Hiring Guide 2026', excerpt: 'OA patterns, technical interview topics, and offer timelines for Microsoft India Development Center.', category: 'Company Guides', readingTime: 9 },
  { slug: 'java-interview-questions-guide', title: 'Java Interview Questions — Complete Campus Guide', excerpt: 'Core Java, collections, multithreading, and Spring basics for TCS, Infosys, and product company technical rounds.', category: 'Interview Prep', readingTime: 12 },
  { slug: 'campus-placement-preparation-guide-2026', title: 'Campus Placement Preparation Guide 2026', excerpt: 'Month-by-month roadmap from pre-final year to offer letter for Indian engineering students.', category: 'Placement Prep', readingTime: 15 },
  { slug: 'machine-learning-interview-campus', title: 'Machine Learning Interview Questions for Campus', excerpt: 'Supervised learning, model evaluation, and project discussion tips for ML intern and fresher roles.', category: 'Interview Prep', readingTime: 11 },
  { slug: 'technical-interview-dsa-roadmap', title: 'Technical Interview DSA Roadmap', excerpt: 'Structured 90-day plan covering arrays, trees, graphs, and dynamic programming for coding rounds.', category: 'DSA', readingTime: 14 },
  { slug: 'internship-to-ppo-strategy', title: 'Internship to PPO Strategy', excerpt: 'How to convert your summer internship into a pre-placement offer at Indian product and service companies.', category: 'Internships', readingTime: 7 },
  { slug: 'coding-profile-building-leetcode-codechef', title: 'Building Your Coding Profile on LeetCode & CodeChef', excerpt: 'Rating targets, contest frequency, and profile presentation for campus shortlisting.', category: 'Placement Prep', readingTime: 8 },
  { slug: 'mock-interview-preparation-guide', title: 'Mock Interview Preparation Guide', excerpt: 'How to run effective mock interviews with peers and mentors before your campus drive.', category: 'Interviews', readingTime: 6 },
];

function makeBlogPost(def: (typeof BLOG_DEFS)[number], index: number): BlogPost {
  return {
    id: `fallback-blog-${index}`,
    slug: def.slug,
    title: def.title,
    excerpt: def.excerpt,
    content: def.excerpt,
    authorId: 'fallback-author',
    categoryId: `cat-${index}`,
    status: 'published',
    readingTimeMinutes: def.readingTime,
    viewCount: 0,
    isFeatured: index < 3,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    author: { id: 'fallback-author', name: 'Editorial Team' },
    category: { id: `cat-${index}`, slug: def.category.toLowerCase().replace(/\s+/g, '-'), name: def.category },
  };
}

export const FALLBACK_BLOG_POSTS: BlogPost[] = BLOG_DEFS.map(makeBlogPost);

export function getFallbackBlogPost(slug: string): BlogPost | null {
  const canonical = resolveCanonicalSlug(slug);
  return FALLBACK_BLOG_POSTS.find((p) => p.slug === canonical) ?? null;
}

const ROADMAP_DEFS: { slug: string; title: string; description: string; topic: string; difficulty: 'easy' | 'medium' | 'hard'; hours: number; steps: number }[] = [
  { slug: 'dsa-placement-roadmap', title: 'DSA for Campus Placements', description: 'Master arrays, trees, graphs, and dynamic programming for coding interviews.', topic: 'DSA', difficulty: 'hard', hours: 220, steps: 7 },
  { slug: 'full-stack-developer-roadmap', title: 'Full Stack Developer Roadmap', description: 'HTML, CSS, JavaScript, React, Node.js, and databases — zero to job-ready.', topic: 'Full Stack', difficulty: 'medium', hours: 200, steps: 12 },
  { slug: 'data-science-roadmap', title: 'Data Science Fundamentals', description: 'Python, statistics, pandas, and machine learning basics for analytics roles.', topic: 'Data Science', difficulty: 'medium', hours: 180, steps: 15 },
  { slug: 'frontend-developer-roadmap', title: 'Frontend Developer Roadmap', description: 'Modern UI development with React, TypeScript, and responsive design.', topic: 'Web Development', difficulty: 'medium', hours: 160, steps: 10 },
  { slug: 'backend-developer-roadmap', title: 'Backend Developer Roadmap', description: 'APIs, databases, authentication, and deployment for server-side engineering.', topic: 'Web Development', difficulty: 'medium', hours: 170, steps: 11 },
  { slug: 'devops-engineer-roadmap', title: 'DevOps Engineer Roadmap', description: 'CI/CD, Docker, Kubernetes, and cloud infrastructure for production systems.', topic: 'DevOps', difficulty: 'hard', hours: 190, steps: 9 },
];

function makeRoadmap(def: (typeof ROADMAP_DEFS)[number], index: number): CareerRoadmap {
  return {
    id: `fallback-roadmap-${index}`,
    slug: def.slug,
    title: def.title,
    description: def.description,
    topic: def.topic,
    difficulty: def.difficulty,
    estimatedHours: def.hours,
    isPublished: true,
    viewCount: 0,
    createdAt: NOW,
    updatedAt: NOW,
    steps: Array.from({ length: def.steps }, (_, i) => ({
      id: `step-${index}-${i}`,
      roadmapId: `fallback-roadmap-${index}`,
      slug: `step-${i + 1}`,
      title: `Step ${i + 1}`,
      description: `Learning milestone ${i + 1} for ${def.title}.`,
      stepOrder: i + 1,
      estimatedHours: Math.ceil(def.hours / def.steps),
      createdAt: NOW,
      updatedAt: NOW,
    })),
  };
}

export const FALLBACK_ROADMAPS: CareerRoadmap[] = ROADMAP_DEFS.map(makeRoadmap);

export function getFallbackRoadmap(slug: string): CareerRoadmap | null {
  const canonical = resolveCanonicalSlug(slug);
  return FALLBACK_ROADMAPS.find((r) => r.slug === canonical) ?? null;
}

const INTERVIEW_FALLBACK_ENTRIES: { topic: string; question: string; answer: string; difficulty: 'easy' | 'medium' | 'hard' }[] = [
  { topic: 'HR', question: 'Tell me about yourself.', answer: 'Structure a 60–90 second pitch: education, relevant projects or internships, key skills, and why you fit this role. Avoid personal biography or repeating your entire resume.', difficulty: 'easy' },
  { topic: 'HR', question: 'Why do you want to join our company?', answer: 'Connect your skills to the company products, culture, and campus programs. Mention specific initiatives you researched — avoid generic praise or salary-only motivation.', difficulty: 'easy' },
  { topic: 'HR', question: 'What are your strengths and weaknesses?', answer: 'Give real strengths with brief examples. For weaknesses, pick something genuine with clear improvement steps. Never claim perfection.', difficulty: 'easy' },
  { topic: 'HR', question: 'Where do you see yourself in five years?', answer: 'Show ambition aligned with technical growth — deepening expertise, mentoring juniors, contributing to architecture — without implying you will leave immediately.', difficulty: 'easy' },
  { topic: 'HR', question: 'Are you willing to relocate?', answer: 'Answer honestly. If flexible, express openness to major Indian tech hubs. If you have a preference, state it respectfully while confirming willingness if required.', difficulty: 'easy' },
  { topic: 'DSA', question: 'What is the difference between stack and queue?', answer: 'A stack follows LIFO (Last In, First Out) — like undo operations. A queue follows FIFO (First In, First Out) — like a printer job queue.', difficulty: 'medium' },
  { topic: 'DSA', question: 'Explain time complexity of binary search.', answer: 'Binary search halves the search space each step, giving O(log n) time. It requires a sorted array and uses O(1) extra space for iterative implementation.', difficulty: 'easy' },
  { topic: 'DSA', question: 'When would you use a hash map?', answer: 'Use hash maps for O(1) average lookups — frequency counting, two-sum patterns, caching, and deduplication. Trade-off: extra space for speed.', difficulty: 'medium' },
  { topic: 'DSA', question: 'Explain BFS vs DFS.', answer: 'BFS explores level by level using a queue — shortest path in unweighted graphs. DFS goes deep first using recursion/stack — cycle detection, topological sort.', difficulty: 'medium' },
  { topic: 'Java', question: 'What is the difference between abstract class and interface?', answer: 'Abstract classes can have state and partial implementation; Java interfaces (modern) support default methods. Use interfaces for capability contracts, abstract classes for shared base behavior.', difficulty: 'medium' },
  { topic: 'Java', question: 'Explain equals() and hashCode() contract.', answer: 'If two objects are equal, they must have the same hash code. Override both together when using objects as HashMap keys or in HashSet.', difficulty: 'medium' },
  { topic: 'Python', question: 'List vs tuple in Python?', answer: 'Lists are mutable, tuples are immutable. Tuples are faster and hashable when used as dict keys. Lists suit dynamic collections.', difficulty: 'easy' },
  { topic: 'SQL', question: 'What is the difference between INNER JOIN and LEFT JOIN?', answer: 'INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all rows from the left table plus matches from the right; unmatched right columns are NULL.', difficulty: 'easy' },
  { topic: 'SQL', question: 'What is database normalization?', answer: 'Normalization reduces redundancy by organizing data into tables with clear dependencies — typically 1NF through 3NF for campus-level questions.', difficulty: 'medium' },
  { topic: 'DBMS', question: 'Explain the ACID properties of a database.', answer: 'Atomicity: all or nothing. Consistency: valid states only. Isolation: concurrent transactions do not interfere. Durability: committed data survives failures.', difficulty: 'medium' },
  { topic: 'React', question: 'What is virtual DOM?', answer: 'React keeps a lightweight copy of the UI tree. On state change, it diffs virtual DOM vs previous, then updates only changed real DOM nodes — improving performance.', difficulty: 'medium' },
  { topic: 'System Design', question: 'How would you design a URL shortener?', answer: 'Use a hash or base62 ID mapped to URLs in a database, cache hot links in Redis, handle redirects via HTTP 301/302, and plan for high read-to-write ratio.', difficulty: 'hard' },
  { topic: 'Behavioral', question: 'Tell me about a time you handled a tight deadline.', answer: 'Use STAR format: Situation, Task, Action, Result. Prioritize tasks, communicate early, deliver MVP, and mention measurable outcome.', difficulty: 'medium' },
  { topic: 'HR', question: 'Why should we hire you?', answer: 'Summarize unique skills, projects, and internship outcomes that match the job description. Support with evidence, not adjectives.', difficulty: 'easy' },
  { topic: 'DSA', question: 'What is dynamic programming?', answer: 'DP solves problems by breaking them into overlapping subproblems, storing results to avoid recomputation. Approaches: top-down memoization or bottom-up tabulation.', difficulty: 'hard' },
];

export const FALLBACK_INTERVIEW_QUESTIONS: InterviewQuestion[] = INTERVIEW_FALLBACK_ENTRIES.map(
  (entry, i) => ({
    id: `fallback-iq-${i}`,
    slug: `fallback-${entry.topic.toLowerCase()}-${i}`,
    question: entry.question,
    answer: entry.answer,
    topic: entry.topic,
    difficulty: entry.difficulty,
    viewCount: 0,
    isPublished: true,
    createdAt: NOW,
    updatedAt: NOW,
  })
);

/** Slugs used when API is down during static export */
export const FALLBACK_JOB_SLUGS = FEATURED_JOB_DEFS.map((j) => j.slug);
export const FALLBACK_INTERNSHIP_SLUGS = INTERNSHIP_DEFS.map((i) => i.slug);
export { FALLBACK_BLOG_SLUGS, FALLBACK_ROADMAP_SLUGS };
