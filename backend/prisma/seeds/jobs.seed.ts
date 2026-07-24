import { ListingStatus, type PrismaClient } from '@prisma/client';
import { buildJobTemplate } from '../../src/lib/content/templates';
import { generateJobSlug } from '../../src/lib/content/slug-generator';
import { ALL_SKILLS, INDIAN_CITIES, JOB_TITLES } from './data/constants';
import { companyCareersUrl } from './data/company-careers';
import { jobImageUrl } from './data/stock-images';
import { addMonths, AUTHOR } from './utils';

export type ListingSeedContext = {
  prisma: PrismaClient;
  companyMap: Map<string, { id: string; name: string; slug: string }>;
  userId: string;
  slugRegistry: Set<string>;
};

const JOB_COUNT = 100;
const FEATURED_COUNT = 10;

function lpaToRupees(lpa: number): number {
  return lpa * 100_000;
}

function pickSkills(index: number, count: number): string[] {
  const skills: string[] = [];
  for (let j = 0; j < count; j++) {
    const skill = ALL_SKILLS[(index * 7 + j * 11) % ALL_SKILLS.length];
    if (!skills.includes(skill)) skills.push(skill);
  }
  return skills;
}

function buildJobDescription(input: {
  title: string;
  companyName: string;
  city: string;
  state: string;
  skills: string[];
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  isFresher: boolean;
}): string {
  const salaryRange = `₹${(input.salaryMin / 100_000).toFixed(1)}–${(input.salaryMax / 100_000).toFixed(1)} LPA`;
  const skillList = input.skills.join(', ');
  const eligibility = input.isFresher
    ? 'B.E./B.Tech, BCA, MCA, or equivalent degrees from 2024–2026 batches with consistent academic performance (typically 60% aggregate or CGPA 6.5+).'
    : `${input.experienceMin}–${input.experienceMax} years of relevant industry experience with demonstrable project ownership and production deployments.`;

  return `${input.companyName} is actively hiring for the role of ${input.title} at our ${input.city}, ${input.state} office as part of our campus and early-career hiring drive across India. This is a full-time opportunity for candidates who want to build scalable software, collaborate with cross-functional teams, and grow within a structured engineering culture.

## About the Role
As a ${input.title}, you will design, develop, test, and maintain applications that serve enterprise and consumer users at scale. You will work closely with product managers, senior engineers, and QA specialists to deliver reliable features on predictable release cycles. ${input.isFresher ? 'Fresh graduates receive structured onboarding, mentor pairing, and a learning path covering fundamentals before contributing to production codebases.' : 'Experienced hires are expected to mentor junior engineers, participate in architecture discussions, and drive technical decisions for their module.'}

## Key Responsibilities
- Write clean, maintainable code following team coding standards and participate in peer code reviews.
- Build and integrate RESTful APIs, services, and user-facing components using ${skillList}.
- Debug production issues, write unit and integration tests, and improve observability across deployments.
- Collaborate in Agile ceremonies including sprint planning, daily stand-ups, and retrospective sessions.
- Document technical designs, deployment runbooks, and knowledge-base articles for internal teams.
- ${input.isFresher ? 'Complete assigned training modules and internal certification tracks within the first six months.' : 'Lead small feature pods, estimate effort accurately, and unblock teammates during critical release windows.'}

## Required Skills & Qualifications
- Strong foundation in ${skillList} with hands-on project or internship experience.
- Solid understanding of data structures, algorithms, object-oriented design, and relational databases.
- ${eligibility}
- Excellent communication skills and ability to explain technical concepts to non-technical stakeholders.
- Willingness to work from ${input.city} with hybrid flexibility where team policy allows.

## Compensation & Benefits
- Competitive CTC: ${salaryRange} depending on interview performance and academic credentials.
- Health insurance for employee and dependents, performance bonuses, and learning reimbursements.
- Access to internal hackathons, tech talks, and certification sponsorship programs.
- Paid leave, festival holidays, and employee assistance programs as per company policy.

## Selection Process
The hiring pipeline typically includes an online aptitude and coding assessment, two technical interview rounds focusing on DSA and project discussion, and a final HR conversation covering role fit and compensation. Offers are rolled out within two weeks of the final round for selected candidates.

Apply through CampusJobsHub to track your application status and receive interview preparation resources tailored to ${input.companyName} hiring patterns.`;
}

export async function seedJobs(ctx: ListingSeedContext): Promise<number> {
  const companies = Array.from(ctx.companyMap.values());
  if (companies.length === 0) {
    throw new Error('seedJobs: companyMap is empty');
  }

  const now = new Date();
  const expiresAt = addMonths(now, 2);

  for (let i = 0; i < JOB_COUNT; i++) {
    const company = companies[i % companies.length];
    const location = INDIAN_CITIES[i % INDIAN_CITIES.length];
    const title = JOB_TITLES[i % JOB_TITLES.length];
    const isFresher = i < 60;

    const experienceMin = isFresher ? 0 : 2 + (i % 4);
    const experienceMax = isFresher ? 1 : experienceMin + 1 + (i % 3);

    const minLpa = isFresher ? 3 + (i % 7) : 8 + (i % 10);
    const maxLpa = isFresher
      ? Math.min(15, minLpa + 2 + (i % 4))
      : Math.min(25, minLpa + 3 + (i % 5));
    const salaryMin = lpaToRupees(minLpa);
    const salaryMax = lpaToRupees(maxLpa);

    const skills = pickSkills(i, 4 + (i % 4));
    const description = buildJobDescription({
      title,
      companyName: company.name,
      city: location.city,
      state: location.state,
      skills,
      experienceMin,
      experienceMax,
      salaryMin,
      salaryMax,
      isFresher,
    });

    const slug = `job-${String(i).padStart(3, '0')}-${generateJobSlug(title, company.name, location.city)}`;

    const careersUrl = companyCareersUrl(company.slug);
    const useExternalApply = Boolean(careersUrl);

    const template = buildJobTemplate({
      title,
      slug,
      companyName: company.name,
      companySlug: company.slug,
      city: location.city,
      state: location.state,
      description,
      skills,
      salaryMin,
      salaryMax,
      experienceMin,
      author: { name: AUTHOR.name, role: AUTHOR.role },
    });

    await ctx.prisma.job.upsert({
      where: { slug },
      update: {
        title,
        description: template.description,
        companyId: company.id,
        locationCity: location.city,
        locationState: location.state,
        isRemote: i % 7 === 0,
        experienceMin,
        experienceMax,
        salaryMin,
        salaryMax,
        skills,
        status: ListingStatus.active,
        expiresAt,
        isFeatured: i < FEATURED_COUNT,
        metaTitle: template.seo.metaTitle,
        metaDescription: template.seo.metaDescription,
        canonicalUrl: template.seo.canonicalUrl,
        ogImageUrl: jobImageUrl(i % 7 === 0, isFresher, i),
        applicationMethod: useExternalApply ? 'external' : 'internal',
        externalApplyUrl: useExternalApply ? careersUrl : null,
      },
      create: {
        slug,
        title,
        description: template.description,
        companyId: company.id,
        postedByUserId: ctx.userId,
        locationCity: location.city,
        locationState: location.state,
        isRemote: i % 7 === 0,
        experienceMin,
        experienceMax,
        salaryMin,
        salaryMax,
        salaryDisclosed: true,
        skills,
        applicationMethod: useExternalApply ? 'external' : 'internal',
        externalApplyUrl: useExternalApply ? careersUrl : null,
        status: ListingStatus.active,
        publishedAt: now,
        expiresAt,
        isFeatured: i < FEATURED_COUNT,
        metaTitle: template.seo.metaTitle,
        metaDescription: template.seo.metaDescription,
        canonicalUrl: template.seo.canonicalUrl,
        ogImageUrl: jobImageUrl(i % 7 === 0, isFresher, i),
      },
    });
  }

  return JOB_COUNT;
}
