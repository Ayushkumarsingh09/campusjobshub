/**
 * CMS Content Templates — CampusJobsHub
 * Reusable structures for all content types with SEO, FAQ, and schema fields.
 */

export interface ContentAuthor {
  name: string;
  id?: string;
  avatarUrl?: string;
  role?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface InternalLink {
  title: string;
  href: string;
  anchor?: string;
}

export interface SeoFields {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
}

export interface ContentTemplateBase {
  title: string;
  slug: string;
  excerpt: string;
  seo: SeoFields;
  faq: FaqItem[];
  internalLinks: InternalLink[];
  featuredImageUrl?: string;
  author: ContentAuthor;
  lastUpdated: Date;
  breadcrumbs: { name: string; href: string }[];
}

// ─── Job Post Template ───────────────────────────────────────────────────────

export interface JobPostTemplate extends ContentTemplateBase {
  type: 'job';
  companyName: string;
  locationCity: string;
  locationState: string;
  isRemote: boolean;
  experienceMin: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  skills: string[];
  description: string;
  employmentType: string;
  applicationDeadline?: Date;
  expiresAt: Date;
}

export function buildJobTemplate(input: {
  title: string;
  slug: string;
  companyName: string;
  companySlug: string;
  city: string;
  state: string;
  description: string;
  skills: string[];
  salaryMin?: number;
  salaryMax?: number;
  experienceMin?: number;
  author: ContentAuthor;
  faq?: FaqItem[];
}): JobPostTemplate {
  const keywords = [
    `${input.title} jobs`,
    `${input.companyName} careers`,
    `jobs in ${input.city}`,
    'campus hiring India',
    'fresher jobs',
    ...input.skills.slice(0, 3).map((s) => `${s} jobs`),
  ];
  const metaTitle = `${input.title} at ${input.companyName} — ${input.city} | CampusJobsHub`.slice(0, 70);
  const metaDescription = `Apply for ${input.title} at ${input.companyName} in ${input.city}. ${input.skills.slice(0, 4).join(', ')}. Campus & fresher openings updated daily.`.slice(0, 160);

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 2);

  return {
    type: 'job',
    title: input.title,
    slug: input.slug,
    excerpt: `Join ${input.companyName} as ${input.title} in ${input.city}. Ideal for campus graduates and early-career professionals.`,
    seo: { metaTitle, metaDescription, keywords, canonicalUrl: `/jobs/${input.slug}` },
    faq: input.faq ?? [
      { question: `What is the eligibility for ${input.title} at ${input.companyName}?`, answer: `Candidates with relevant degree and ${input.experienceMin ?? 0}+ years experience (or fresh graduates for campus roles) may apply. Skills in ${input.skills.slice(0, 3).join(', ')} are preferred.` },
      { question: `Is this role based in ${input.city}?`, answer: `Yes, this position is primarily based in ${input.city}, ${input.state}. Hybrid options may be discussed during the interview process.` },
      { question: 'How do I apply through CampusJobsHub?', answer: 'Create a free account, complete your profile, upload your resume, and click Apply on this listing. You can track your application status from your dashboard.' },
    ],
    internalLinks: [
      { title: `${input.companyName} Company Profile`, href: `/companies/${input.companySlug}` },
      { title: `More Jobs in ${input.city}`, href: `/jobs/in-${input.city.toLowerCase().replace(/\s+/g, '-')}` },
      { title: 'Campus Placement Guide', href: '/blog/campus-placement-preparation-guide-2026' },
      { title: 'Resume ATS Checker', href: '/resume/ats-checker' },
    ],
    author: input.author,
    lastUpdated: new Date(),
    breadcrumbs: [
      { name: 'Jobs', href: '/jobs' },
      { name: input.city, href: `/jobs/in-${input.city.toLowerCase().replace(/\s+/g, '-')}` },
      { name: input.title, href: `/jobs/${input.slug}` },
    ],
    companyName: input.companyName,
    locationCity: input.city,
    locationState: input.state,
    isRemote: false,
    experienceMin: input.experienceMin ?? 0,
    salaryMin: input.salaryMin,
    salaryMax: input.salaryMax,
    skills: input.skills,
    description: input.description,
    employmentType: 'full_time',
    expiresAt,
  };
}

// ─── Internship Template ───────────────────────────────────────────────────────

export interface InternshipPostTemplate extends ContentTemplateBase {
  type: 'internship';
  companyName: string;
  durationMonths: number;
  stipendMin?: number;
  stipendMax?: number;
  ppoAvailable: boolean;
  description: string;
  skills: string[];
  locationCity: string;
  expiresAt: Date;
}

export function buildInternshipTemplate(input: {
  title: string;
  slug: string;
  companyName: string;
  companySlug: string;
  city: string;
  description: string;
  skills: string[];
  durationMonths: number;
  stipendMin?: number;
  stipendMax?: number;
  ppoAvailable?: boolean;
  author: ContentAuthor;
}): InternshipPostTemplate {
  const metaTitle = `${input.title} Internship at ${input.companyName} | CampusJobsHub`.slice(0, 70);
  const metaDescription = `${input.durationMonths}-month internship at ${input.companyName} in ${input.city}. Stipend ${input.stipendMin ? `₹${input.stipendMin}/mo` : 'available'}. Apply now.`.slice(0, 160);
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 3);

  return {
    type: 'internship',
    title: input.title,
    slug: input.slug,
    excerpt: `${input.durationMonths}-month internship opportunity at ${input.companyName} for students and recent graduates.`,
    seo: {
      metaTitle,
      metaDescription,
      keywords: ['internship India', input.companyName, input.city, ...input.skills.slice(0, 3)],
      canonicalUrl: `/internships/${input.slug}`,
    },
    faq: [
      { question: 'Is this internship paid?', answer: input.stipendMin ? `Yes, stipend ranges from ₹${input.stipendMin} to ₹${input.stipendMax ?? input.stipendMin} per month.` : 'Stipend details are shared during the selection process.' },
      { question: 'Is PPO available?', answer: input.ppoAvailable ? 'Yes, pre-placement offer (PPO) may be extended based on performance.' : 'PPO is not guaranteed but exceptional interns may receive full-time offers.' },
      { question: 'Who can apply?', answer: 'Pre-final and final year students from engineering, science, and related disciplines are eligible.' },
    ],
    internalLinks: [
      { title: input.companyName, href: `/companies/${input.companySlug}` },
      { title: 'All Internships', href: '/internships' },
      { title: 'PPO Internships', href: '/internships/ppo' },
    ],
    author: input.author,
    lastUpdated: new Date(),
    breadcrumbs: [
      { name: 'Internships', href: '/internships' },
      { name: input.title, href: `/internships/${input.slug}` },
    ],
    companyName: input.companyName,
    durationMonths: input.durationMonths,
    stipendMin: input.stipendMin,
    stipendMax: input.stipendMax,
    ppoAvailable: input.ppoAvailable ?? false,
    description: input.description,
    skills: input.skills,
    locationCity: input.city,
    expiresAt,
  };
}

// ─── Company Profile Template ──────────────────────────────────────────────────

export interface CompanyProfileTemplate extends ContentTemplateBase {
  type: 'company';
  industry: string;
  website?: string;
  description: string;
  hiringProcess?: string;
  salaryInformation?: string;
  eligibilityCriteria?: string;
}

export function buildCompanyProfileTemplate(input: {
  name: string;
  slug: string;
  industry: string;
  description: string;
  hiringProcess: string;
  salaryInformation: string;
  eligibilityCriteria: string;
  interviewExperience: string;
  website?: string;
  city: string;
  author: ContentAuthor;
  faq: FaqItem[];
}): CompanyProfileTemplate {
  const fullDescription = `${input.description}\n\n## Hiring Process\n${input.hiringProcess}\n\n## Salary & Compensation\n${input.salaryInformation}\n\n## Eligibility\n${input.eligibilityCriteria}\n\n## Interview Experience\n${input.interviewExperience}`;
  return {
    type: 'company',
    title: `${input.name} — Campus Hiring & Careers`,
    slug: input.slug,
    excerpt: `Complete guide to ${input.name} campus recruitment, salaries, interview process, and eligibility for Indian students.`,
    seo: {
      metaTitle: `${input.name} Jobs & Internships India | CampusJobsHub`.slice(0, 70),
      metaDescription: `${input.name} campus hiring guide: eligibility, salary, interview rounds, and preparation tips for Indian students.`.slice(0, 160),
      keywords: [input.name, 'campus hiring', input.industry, 'interview process', 'salary India'],
      canonicalUrl: `/companies/${input.slug}`,
    },
    faq: input.faq,
    internalLinks: [
      { title: `Jobs at ${input.name}`, href: `/companies/${input.slug}` },
      { title: `${input.name} Interview Questions`, href: `/prepare/interview-questions?company=${input.slug}` },
      { title: 'Placement Preparation', href: '/blog' },
    ],
    author: input.author,
    lastUpdated: new Date(),
    breadcrumbs: [
      { name: 'Companies', href: '/companies' },
      { name: input.name, href: `/companies/${input.slug}` },
    ],
    industry: input.industry,
    website: input.website,
    description: fullDescription,
    hiringProcess: input.hiringProcess,
    salaryInformation: input.salaryInformation,
    eligibilityCriteria: input.eligibilityCriteria,
  };
}

// ─── Blog Article Template ─────────────────────────────────────────────────────

export interface BlogArticleTemplate extends ContentTemplateBase {
  type: 'blog';
  contentType: 'company-guide' | 'career-guide' | 'placement-prep' | 'interview-article' | 'roadmap-article';
  content: string;
  categorySlug: string;
  tags: string[];
  readingTimeMinutes: number;
}

export function buildBlogTemplate(input: {
  title: string;
  slug: string;
  contentType: BlogArticleTemplate['contentType'];
  content: string;
  excerpt: string;
  categorySlug: string;
  tags: string[];
  author: ContentAuthor;
  faq: FaqItem[];
  internalLinks: InternalLink[];
  keywords: string[];
}): BlogArticleTemplate {
  const wordCount = input.content.split(/\s+/).length;
  const metaTitle = `${input.title} | CampusJobsHub Blog`.slice(0, 70);
  const metaDescription = input.excerpt.slice(0, 160);

  return {
    type: 'blog',
    contentType: input.contentType,
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    categorySlug: input.categorySlug,
    tags: input.tags,
    readingTimeMinutes: Math.max(3, Math.ceil(wordCount / 200)),
    seo: {
      metaTitle,
      metaDescription,
      keywords: input.keywords,
      canonicalUrl: `/blog/${input.slug}`,
    },
    faq: input.faq,
    internalLinks: input.internalLinks,
    author: input.author,
    lastUpdated: new Date(),
    breadcrumbs: [
      { name: 'Blog', href: '/blog' },
      { name: input.title, href: `/blog/${input.slug}` },
    ],
  };
}

// ─── Roadmap Template ──────────────────────────────────────────────────────────

export interface RoadmapTemplate extends ContentTemplateBase {
  type: 'roadmap';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
  steps: { title: string; slug: string; description: string; resourceUrl?: string; estimatedHours: number }[];
  salaryExpectations: string;
  timeline: string;
}

export function buildRoadmapTemplate(input: {
  title: string;
  slug: string;
  topic: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
  steps: RoadmapTemplate['steps'];
  salaryExpectations: string;
  timeline: string;
  author: ContentAuthor;
  faq: FaqItem[];
}): RoadmapTemplate {
  return {
    type: 'roadmap',
    title: input.title,
    slug: input.slug,
    excerpt: input.description.slice(0, 200),
    seo: {
      metaTitle: `${input.title} — Career Roadmap | CampusJobsHub`.slice(0, 70),
      metaDescription: `Step-by-step ${input.topic} roadmap for Indian students. ${input.timeline} learning path with projects and resources.`.slice(0, 160),
      keywords: [input.topic, 'career roadmap', 'placement preparation', 'India'],
      canonicalUrl: `/prepare/roadmaps/${input.slug}`,
    },
    faq: input.faq,
    internalLinks: [
      { title: 'Interview Questions', href: '/prepare/interview-questions' },
      { title: 'Jobs', href: '/jobs' },
      { title: 'Resume Builder', href: '/resume/builder' },
    ],
    author: input.author,
    lastUpdated: new Date(),
    breadcrumbs: [
      { name: 'Roadmaps', href: '/prepare/roadmaps' },
      { name: input.title, href: `/prepare/roadmaps/${input.slug}` },
    ],
    topic: input.topic,
    difficulty: input.difficulty,
    estimatedHours: input.estimatedHours,
    steps: input.steps,
    salaryExpectations: input.salaryExpectations,
    timeline: input.timeline,
  };
}

// ─── Interview Question Template ─────────────────────────────────────────────

export interface InterviewQuestionTemplate {
  type: 'interview-question';
  question: string;
  slug: string;
  answer: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  companySlug?: string;
  role?: string;
  seo: Pick<SeoFields, 'metaTitle' | 'metaDescription' | 'keywords'>;
}

export function buildInterviewQuestionTemplate(input: {
  question: string;
  slug: string;
  answer: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  companySlug?: string;
  role?: string;
}): InterviewQuestionTemplate {
  return {
    type: 'interview-question',
    question: input.question,
    slug: input.slug,
    answer: input.answer,
    topic: input.topic,
    difficulty: input.difficulty,
    companySlug: input.companySlug,
    role: input.role,
    seo: {
      metaTitle: `${input.topic} Interview Question — ${input.difficulty} | CampusJobsHub`.slice(0, 70),
      metaDescription: input.answer.slice(0, 160),
      keywords: [input.topic, 'interview questions', input.difficulty, 'campus placement'],
    },
  };
}
