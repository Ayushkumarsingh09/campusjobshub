import { calculateSeoScore } from '../../src/lib/seo-score';
import type { SeedContext } from './utils';

type SeoPageDef = {
  path: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  schemaMarkup?: Record<string, unknown>;
};

const BASE_URL = 'https://campusjobshub.com';

const STATIC_PAGES: SeoPageDef[] = [
  {
    path: '/',
    metaTitle: 'Campus Jobs & Internships India | CampusJobsHub',
    metaDescription:
      'Find fresher jobs, internships, placement prep, interview questions, and career roadmaps for Indian students. Updated daily across top cities.',
    ogTitle: 'CampusJobsHub — India Campus Jobs Platform',
    ogDescription: 'Jobs, internships, roadmaps, and interview prep for campus placements.',
    canonicalUrl: `${BASE_URL}/`,
    schemaMarkup: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CampusJobsHub',
      url: BASE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/jobs/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  },
  {
    path: '/jobs',
    metaTitle: 'Fresher Jobs in India — Campus Hiring 2026',
    metaDescription:
      'Browse active campus and fresher job openings from TCS, Infosys, startups, and product companies. Filter by city, skills, and salary.',
    canonicalUrl: `${BASE_URL}/jobs`,
  },
  {
    path: '/jobs/fresher',
    metaTitle: 'Fresher Jobs — 0 to 1 Year Experience | CampusJobsHub',
    metaDescription:
      'Entry-level software, data, and analyst jobs for fresh graduates. No experience required — apply before deadlines close.',
    canonicalUrl: `${BASE_URL}/jobs/fresher`,
  },
  {
    path: '/jobs/remote',
    metaTitle: 'Remote Fresher Jobs India | Work From Home',
    metaDescription:
      'Remote-friendly campus roles and graduate jobs. Filter remote openings from verified employers across India.',
    canonicalUrl: `${BASE_URL}/jobs/remote`,
  },
  {
    path: '/internships',
    metaTitle: 'Internships for Students — Paid & PPO 2026',
    metaDescription:
      'Summer internships, 6-month programs, and PPO tracks for engineering and MBA students. Stipend and location filters.',
    canonicalUrl: `${BASE_URL}/internships`,
  },
  {
    path: '/internships/summer',
    metaTitle: 'Summer Internships 2026 — Engineering & MBA',
    metaDescription:
      'Summer internship programs from product companies and MNCs. Apply early for Bangalore, Hyderabad, and remote roles.',
    canonicalUrl: `${BASE_URL}/internships/summer`,
  },
  {
    path: '/internships/ppo',
    metaTitle: 'PPO Internships — Pre-Placement Offer Roles',
    metaDescription:
      'Internships with pre-placement offer (PPO) potential. Convert your internship into a full-time campus offer.',
    canonicalUrl: `${BASE_URL}/internships/ppo`,
  },
  {
    path: '/companies',
    metaTitle: 'Companies Hiring Campus Freshers | CampusJobsHub',
    metaDescription:
      'Explore company profiles, culture, and active job listings from IT services, product, and startup employers in India.',
    canonicalUrl: `${BASE_URL}/companies`,
  },
  {
    path: '/prepare/interview-questions',
    metaTitle: 'Interview Questions — Campus Placement Q&A Bank',
    metaDescription:
      '300+ interview questions with detailed answers: Java, Python, DSA, React, System Design, HR, and behavioral rounds.',
    canonicalUrl: `${BASE_URL}/prepare/interview-questions`,
  },
  {
    path: '/prepare/roadmaps',
    metaTitle: 'Career Roadmaps — DSA to Full Stack | CampusJobsHub',
    metaDescription:
      'Step-by-step learning roadmaps for DSA, Java, Python, DevOps, AI/ML, and 15+ career tracks with salary expectations.',
    canonicalUrl: `${BASE_URL}/prepare/roadmaps`,
  },
  {
    path: '/blog',
    metaTitle: 'Placement Blog — Tips, Guides & Strategies',
    metaDescription:
      'Campus placement preparation articles: resume, aptitude, coding interviews, HR rounds, and offer negotiation for Indian students.',
    canonicalUrl: `${BASE_URL}/blog`,
  },
  {
    path: '/resume',
    metaTitle: 'AI Resume Builder & ATS Checker | CampusJobsHub',
    metaDescription:
      'Build ATS-friendly resumes and check keyword match scores. Templates designed for Indian campus and fresher hiring.',
    canonicalUrl: `${BASE_URL}/resume`,
  },
  {
    path: '/about',
    metaTitle: 'About CampusJobsHub — Campus Jobs Platform India',
    metaDescription:
      'CampusJobsHub helps Indian students find jobs, internships, and placement resources in one trusted platform.',
    canonicalUrl: `${BASE_URL}/about`,
  },
  {
    path: '/contact',
    metaTitle: 'Contact CampusJobsHub — Support & Partnerships',
    metaDescription: 'Reach our team for employer onboarding, content partnerships, and student support inquiries.',
    canonicalUrl: `${BASE_URL}/contact`,
  },
  {
    path: '/privacy-policy',
    metaTitle: 'Privacy Policy | CampusJobsHub',
    metaDescription: 'How CampusJobsHub collects, uses, and protects your personal data under applicable Indian privacy norms.',
    canonicalUrl: `${BASE_URL}/privacy-policy`,
    robotsIndex: true,
  },
  {
    path: '/terms',
    metaTitle: 'Terms of Service | CampusJobsHub',
    metaDescription: 'Terms governing use of CampusJobsHub job listings, accounts, and placement preparation content.',
    canonicalUrl: `${BASE_URL}/terms`,
  },
];

const CITY_PAGES: SeoPageDef[] = [
  'bangalore',
  'mumbai',
  'delhi',
  'hyderabad',
  'pune',
  'chennai',
  'gurugram',
  'noida',
  'kolkata',
  'ahmedabad',
].flatMap((city) => {
  const label = city.charAt(0).toUpperCase() + city.slice(1);
  return [
    {
      path: `/jobs/in-${city}`,
      metaTitle: `Jobs in ${label} — Fresher Openings 2026`,
      metaDescription: `Latest campus and fresher jobs in ${label}. IT, data, and analyst roles from verified employers updated daily.`,
      canonicalUrl: `${BASE_URL}/jobs/in-${city}`,
    },
    {
      path: `/internships/in-${city}`,
      metaTitle: `Internships in ${label} — Students 2026`,
      metaDescription: `Paid internships and PPO programs in ${label} for engineering and MBA students. Apply before deadlines.`,
      canonicalUrl: `${BASE_URL}/internships/in-${city}`,
    },
  ];
});

const TOPIC_HUB_PAGES: SeoPageDef[] = [
  'java',
  'python',
  'sql',
  'javascript',
  'react',
  'nodejs',
  'system-design',
  'hr',
  'behavioral',
  'dsa',
].map((topic) => ({
  path: `/prepare/interview-questions/topic/${topic}`,
  metaTitle: `${topic.toUpperCase()} Interview Questions — Campus Prep`,
  metaDescription: `Curated ${topic.replace('-', ' ')} interview questions with easy, medium, and hard answers for Indian campus placements.`,
  canonicalUrl: `${BASE_URL}/prepare/interview-questions/topic/${topic}`,
}));

const ROADMAP_HUB_PAGES: SeoPageDef[] = [
  'dsa-placement-roadmap',
  'java-developer-roadmap',
  'python-developer-roadmap',
  'frontend-developer-roadmap',
  'full-stack-developer-roadmap',
  'ai-ml-engineer-roadmap',
  'system-design-roadmap',
].map((slug) => ({
  path: `/prepare/roadmaps/${slug}`,
  metaTitle: `Career Roadmap — ${slug.replace(/-/g, ' ')} | CampusJobsHub`,
  metaDescription: `Structured learning path with steps, resources, and salary expectations for Indian students targeting ${slug.split('-')[0]} roles.`,
  canonicalUrl: `${BASE_URL}/prepare/roadmaps/${slug}`,
}));

const ALL_SEO_PAGES: SeoPageDef[] = [
  ...STATIC_PAGES,
  ...CITY_PAGES,
  ...TOPIC_HUB_PAGES,
  ...ROADMAP_HUB_PAGES,
];

export async function seedSeoPages(ctx: SeedContext): Promise<string[]> {
  const paths: string[] = [];

  for (const page of ALL_SEO_PAGES) {
    const seoScore = calculateSeoScore({
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      ogImage: page.ogImage,
      canonicalUrl: page.canonicalUrl,
    });

    await ctx.prisma.seoPage.upsert({
      where: { path: page.path },
      update: {
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        ogTitle: page.ogTitle ?? page.metaTitle,
        ogDescription: page.ogDescription ?? page.metaDescription,
        ogImage: page.ogImage ?? '/og-default.png',
        canonicalUrl: page.canonicalUrl ?? `${BASE_URL}${page.path}`,
        robotsIndex: page.robotsIndex ?? true,
        schemaMarkup: page.schemaMarkup ?? undefined,
        seoScore,
      },
      create: {
        path: page.path,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        ogTitle: page.ogTitle ?? page.metaTitle,
        ogDescription: page.ogDescription ?? page.metaDescription,
        ogImage: page.ogImage ?? '/og-default.png',
        canonicalUrl: page.canonicalUrl ?? `${BASE_URL}${page.path}`,
        robotsIndex: page.robotsIndex ?? true,
        schemaMarkup: page.schemaMarkup ?? undefined,
        seoScore,
      },
    });

    paths.push(page.path);
  }

  return paths;
}

export { ALL_SEO_PAGES };
