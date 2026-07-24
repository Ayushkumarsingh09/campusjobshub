import { CompanySize } from '@prisma/client';
import { COMPANIES } from './data/companies';
import { companyCareersUrl } from './data/company-careers';
import { companyLogoPath } from './data/company-logos';
import { companyImageUrl } from './data/stock-images';
import type { SeedContext } from './utils';

const COMPANY_SIZE_BY_SLUG: Record<string, CompanySize> = {
  google: 'SIZE_5000_PLUS',
  microsoft: 'SIZE_5000_PLUS',
  amazon: 'SIZE_5000_PLUS',
  meta: 'SIZE_5000_PLUS',
  apple: 'SIZE_5000_PLUS',
  netflix: 'SIZE_5000_PLUS',
  adobe: 'SIZE_5000_PLUS',
  oracle: 'SIZE_5000_PLUS',
  ibm: 'SIZE_5000_PLUS',
  tcs: 'SIZE_5000_PLUS',
  infosys: 'SIZE_5000_PLUS',
  wipro: 'SIZE_5000_PLUS',
  accenture: 'SIZE_5000_PLUS',
  cognizant: 'SIZE_5000_PLUS',
  capgemini: 'SIZE_5000_PLUS',
  deloitte: 'SIZE_5000_PLUS',
  hcl: 'SIZE_5000_PLUS',
  zoho: 'SIZE_1001_5000',
  'tech-mahindra': 'SIZE_5000_PLUS',
  'lti-mindtree': 'SIZE_5000_PLUS',
  flipkart: 'SIZE_1001_5000',
  razorpay: 'SIZE_501_1000',
  freshworks: 'SIZE_1001_5000',
  paytm: 'SIZE_1001_5000',
  phonepe: 'SIZE_501_1000',
};

export async function seedCompanies(ctx: SeedContext): Promise<Map<string, string>> {
  const companyIds = new Map<string, string>();

  for (const company of COMPANIES) {
    const metaTitle = `${company.name} Campus Hiring India | CampusJobsHub`.slice(0, 70);
    const metaDescription =
      `${company.name} campus recruitment: eligibility, salary, interview process, and preparation tips for Indian students.`.slice(
        0,
        160
      );

    const record = await ctx.prisma.company.upsert({
      where: { slug: company.slug },
      update: {
        name: company.name,
        description: company.description,
        website: company.website,
        industry: company.industry,
        headquartersCity: company.city,
        headquartersState: company.state,
        hiringProcess: company.hiringProcess,
        salaryInformation: company.salaryInformation,
        eligibilityCriteria: company.eligibilityCriteria,
        interviewExperience: company.interviewExperience,
        companySize: COMPANY_SIZE_BY_SLUG[company.slug] ?? 'SIZE_1001_5000',
        isVerified: true,
        verifiedAt: new Date(),
        metaTitle,
        metaDescription,
        logoUrl: companyLogoPath(company.slug),
        ogImageUrl: companyImageUrl(company.slug),
        careersPageUrl: companyCareersUrl(company.slug, company.website),
      },
      create: {
        slug: company.slug,
        name: company.name,
        description: company.description,
        website: company.website,
        industry: company.industry,
        headquartersCity: company.city,
        headquartersState: company.state,
        hiringProcess: company.hiringProcess,
        salaryInformation: company.salaryInformation,
        eligibilityCriteria: company.eligibilityCriteria,
        interviewExperience: company.interviewExperience,
        companySize: COMPANY_SIZE_BY_SLUG[company.slug] ?? 'SIZE_1001_5000',
        isVerified: true,
        verifiedAt: new Date(),
        ownerUserId: ctx.employerId,
        metaTitle,
        metaDescription,
        logoUrl: companyLogoPath(company.slug),
        ogImageUrl: companyImageUrl(company.slug),
        careersPageUrl: companyCareersUrl(company.slug, company.website),
      },
    });

    companyIds.set(company.slug, record.id);

    await ctx.prisma.mediaAsset.upsert({
      where: { publicId: `company-logo-${company.slug}` },
      update: {
        url: companyLogoPath(company.slug),
        secureUrl: companyLogoPath(company.slug),
        format: 'svg',
        altText: `${company.name} logo`,
        category: 'company-logo',
      },
      create: {
        publicId: `company-logo-${company.slug}`,
        url: companyLogoPath(company.slug),
        secureUrl: companyLogoPath(company.slug),
        format: 'svg',
        width: 64,
        height: 64,
        altText: `${company.name} logo`,
        category: 'company-logo',
        uploadedById: ctx.authorId,
      },
    });
  }

  ctx.companyIds = companyIds;
  return companyIds;
}
