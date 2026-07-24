import { ListingStatus, type PrismaClient } from '@prisma/client';
import { buildInternshipTemplate } from '../../src/lib/content/templates';
import { generateJobSlug } from '../../src/lib/content/slug-generator';
import { ALL_SKILLS, INDIAN_CITIES, INTERNSHIP_TITLES } from './data/constants';
import { companyCareersUrl } from './data/company-careers';
import { internshipImageUrl } from './data/stock-images';
import { addMonths, AUTHOR } from './utils';

export type ListingSeedContext = {
  prisma: PrismaClient;
  companyMap: Map<string, { id: string; name: string; slug: string }>;
  userId: string;
  slugRegistry: Set<string>;
};

const INTERNSHIP_COUNT = 50;
const FEATURED_COUNT = 8;

function pickSkills(index: number, count: number): string[] {
  const skills: string[] = [];
  for (let j = 0; j < count; j++) {
    const skill = ALL_SKILLS[(index * 5 + j * 13) % ALL_SKILLS.length];
    if (!skills.includes(skill)) skills.push(skill);
  }
  return skills;
}

function buildInternshipDescription(input: {
  title: string;
  companyName: string;
  city: string;
  state: string;
  skills: string[];
  durationMonths: number;
  stipendMin: number;
  stipendMax: number;
  ppoAvailable: boolean;
}): string {
  const stipendRange = `₹${input.stipendMin.toLocaleString('en-IN')}–₹${input.stipendMax.toLocaleString('en-IN')} per month`;
  const ppoNote = input.ppoAvailable
    ? 'High-performing interns may receive a pre-placement offer (PPO) for a full-time role based on project delivery, code quality, and manager feedback.'
    : 'While a PPO is not guaranteed for every intern, outstanding contributors are often considered for full-time conversion during campus hiring cycles.';

  return `${input.companyName} invites applications for the ${input.title} program at our ${input.city}, ${input.state} location. This ${input.durationMonths}-month paid internship is designed for pre-final and final-year students from engineering, computer science, and related disciplines who want hands-on exposure to real product development in the Indian tech ecosystem.

## Program Overview
Interns join an agile squad aligned to a live product or internal platform initiative. You will receive a dedicated mentor, weekly learning sessions, and access to the same tooling used by full-time engineers. The program balances structured learning with meaningful deliverables that ship to staging or production environments under senior supervision.

## What You Will Work On
- Build features and fixes using ${input.skills.join(', ')} in a collaborative Git-based workflow with code reviews.
- Participate in sprint ceremonies, write technical documentation, and present demo outcomes at the end of each month.
- Analyze requirements, break down tasks, and estimate effort alongside product and design partners.
- Contribute to test automation, bug triage, and performance profiling for modules relevant to your team.
- ${input.ppoAvailable ? 'Prepare for a potential PPO evaluation through mid-internship and final review checkpoints.' : 'Document learnings in an intern portfolio that can strengthen future campus and off-campus applications.'}

## Eligibility
- Currently pursuing B.E./B.Tech, BCA, MCA, or integrated M.Tech with graduation between 2026 and 2028.
- Strong academic record and prior project, hackathon, or open-source experience in ${input.skills.slice(0, 3).join(', ')}.
- Available to work full-time from ${input.city} for the entire ${input.durationMonths}-month duration.
- Comfortable communicating in English and working in cross-functional teams.

## Stipend & Perks
- Monthly stipend: ${stipendRange} (paid on the last working day of each month).
- Certificate of completion, LinkedIn-verifiable internship letter, and referral support for future openings.
- ${ppoNote}

## Selection Timeline
Applications are reviewed on a rolling basis. Shortlisted candidates complete an online coding assessment followed by a technical interview and HR discussion. Selected interns typically receive offer letters within ten business days of the final round.

Apply now through CampusJobsHub to submit your resume, track status updates, and access company-specific interview preparation guides for ${input.companyName}.`;
}

export async function seedInternships(ctx: ListingSeedContext): Promise<number> {
  const companies = Array.from(ctx.companyMap.values());
  if (companies.length === 0) {
    throw new Error('seedInternships: companyMap is empty');
  }

  const now = new Date();
  const expiresAt = addMonths(now, 2);

  for (let i = 0; i < INTERNSHIP_COUNT; i++) {
    const company = companies[i % companies.length];
    const location = INDIAN_CITIES[(i * 3) % INDIAN_CITIES.length];
    const title = INTERNSHIP_TITLES[i % INTERNSHIP_TITLES.length];

    const durationMonths = 2 + (i % 5);
    const stipendMin = 10_000 + (i % 9) * 5_000;
    const stipendMax = Math.min(50_000, stipendMin + 5_000 + (i % 4) * 5_000);
    const ppoAvailable = i % 3 === 0 || i % 7 === 0;

    const skills = pickSkills(i, 3 + (i % 3));
    const description = buildInternshipDescription({
      title,
      companyName: company.name,
      city: location.city,
      state: location.state,
      skills,
      durationMonths,
      stipendMin,
      stipendMax,
      ppoAvailable,
    });

    const slug = `internship-${String(i).padStart(3, '0')}-${generateJobSlug(title, company.name, location.city)}`;

    const careersUrl = companyCareersUrl(company.slug);
    const useExternalApply = Boolean(careersUrl);

    const template = buildInternshipTemplate({
      title,
      slug,
      companyName: company.name,
      companySlug: company.slug,
      city: location.city,
      description,
      skills,
      durationMonths,
      stipendMin,
      stipendMax,
      ppoAvailable,
      author: { name: AUTHOR.name, role: AUTHOR.role },
    });

    const startDate = addMonths(now, 1 + (i % 3));
    startDate.setDate(1);

    await ctx.prisma.internship.upsert({
      where: { slug },
      update: {
        title,
        description: template.description,
        companyId: company.id,
        locationCity: location.city,
        locationState: location.state,
        isRemote: i % 9 === 0,
        durationMonths,
        stipendMin,
        stipendMax,
        ppoAvailable,
        startDate,
        skills,
        status: ListingStatus.active,
        expiresAt,
        isFeatured: i < FEATURED_COUNT,
        metaTitle: template.seo.metaTitle,
        metaDescription: template.seo.metaDescription,
        canonicalUrl: template.seo.canonicalUrl,
        ogImageUrl: internshipImageUrl(i),
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
        isRemote: i % 9 === 0,
        durationMonths,
        stipendMin,
        stipendMax,
        isPaid: true,
        ppoAvailable,
        startDate,
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
        ogImageUrl: internshipImageUrl(i),
      },
    });
  }

  return INTERNSHIP_COUNT;
}
