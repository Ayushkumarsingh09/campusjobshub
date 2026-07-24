import type { Prisma } from '@prisma/client';
import { buildBlogTemplate } from '../../src/lib/content/templates';
import {
  articleSectionsToContent,
  CAREER_GUIDE_ARTICLES,
  PLACEMENT_PREP_ARTICLES,
  type ArticleSeed,
} from './data/blog-articles';
import type { CompanySeedData } from './data/companies';
import { COMPANIES } from './data/companies';
import { blogImageUrl } from './data/stock-images';
import { AUTHOR, countWords, type SeedContext } from './utils';

const AUTHOR_PROFILE = {
  name: AUTHOR.name,
  role: AUTHOR.role,
};

function buildCompanyGuideContent(company: CompanySeedData): string {
  return `# ${company.name} Campus Hiring Guide 2026

## Company Overview

${company.description}

## Who Should Apply

${company.name} campus hiring attracts final-year engineering graduates across computer science, information technology, electronics, and related disciplines. ${company.eligibilityCriteria} Students from metro cities including ${company.city} and other Indian tech hubs should review location preferences early because team allocation may depend on business demand at offer stage.

## Eligibility Criteria in Detail

Indian campuses typically enforce minimum CGPA thresholds, backlog limits, and degree completion timelines that vary by college tier. ${company.eligibilityCriteria} Verify your placement cell notice for batch-specific relaxations before applying. Keep scanned marksheets, government ID, and updated resume copies ready for document verification drives.

## Campus Hiring Process Step by Step

${company.hiringProcess}

Most candidates benefit from creating a preparation calendar working backward from expected drive dates. Register on official career portals in addition to campus cell applications where required. Complete online assessments in distraction-free environments with stable internet for proctored tests.

## Salary, CTC, and Compensation Structure

${company.salaryInformation}

When comparing offers, separate fixed pay, variable components, stock or ESOP grants, joining bonuses, and relocation benefits. Calculate approximate in-hand salary using city-specific tax estimates rather than comparing CTC numbers alone across employers.

## Interview Experience and Question Patterns

${company.interviewExperience}

Practice explaining your projects in two-minute and five-minute formats. Review data structures patterns including arrays, strings, trees, and dynamic programming if targeting technical tracks. Prepare HR stories using STAR format for behavioral questions about teamwork, conflict, and leadership.

## Preparation Roadmap (8 Weeks)

Weeks 1–2: Complete aptitude fundamentals if applying through mass hiring tracks. Weeks 3–5: Solve 80–120 curated coding problems if technical interviews expected. Weeks 6–7: Company-specific mock interviews referencing ${company.name} interview experiences shared by seniors. Week 8: Revise notes, rest adequately, and organize documents for drive day.

## Off-Campus and Internship Pathways

If your college is not on ${company.name}'s official visit list, monitor careers portal openings, employee referral programs, and hackathon pipelines. Summer internships frequently convert to pre-placement offers when performance reviews are strong. Maintain LinkedIn and GitHub profiles aligned with your resume to support recruiter discovery.

## Final Recommendations

Apply early, track status in a spreadsheet, and follow up professionally after assessments. Use CampusJobsHub job listings and interview question banks for ongoing practice. Accept backup offers only after evaluating risk tolerance if dream company processes remain active per placement cell policy.`;
}

function buildCompanyGuidePost(company: CompanySeedData) {
  const slug = `${company.slug}-campus-hiring-guide-2026`;
  const content = buildCompanyGuideContent(company);
  const excerpt = `Complete ${company.name} campus recruitment guide for 2026: eligibility, salary bands, interview rounds, preparation timeline, and FAQs for Indian engineering students.`;

  return buildBlogTemplate({
    title: `${company.name} Campus Hiring Guide 2026 — Eligibility, Salary & Interview Process`,
    slug,
    contentType: 'company-guide',
    content,
    excerpt,
    categorySlug: 'company-guides',
    tags: [
      'campus-hiring',
      'on-campus',
      'fresher-jobs',
      ['google', 'microsoft', 'amazon', 'meta', 'apple', 'netflix', 'adobe', 'flipkart', 'razorpay', 'phonepe', 'freshworks', 'paytm', 'zoho'].includes(
        company.slug
      )
        ? 'product-companies'
        : 'service-companies',
    ],
    author: AUTHOR_PROFILE,
    faq: company.faq,
    internalLinks: [
      { title: `${company.name} Company Profile`, href: `/companies/${company.slug}` },
      { title: 'Campus Placement Guide 2026', href: '/blog/campus-placement-preparation-guide-2026' },
      { title: 'Resume ATS Guide', href: '/blog/ats-friendly-resume-format-india-2026' },
      { title: 'DSA Interview Roadmap', href: '/blog/technical-interview-dsa-roadmap' },
    ],
    keywords: [
      `${company.name} campus hiring`,
      `${company.name} salary fresher`,
      `${company.name} interview process`,
      'campus placement India 2026',
      company.city,
    ],
  });
}

function buildArticlePost(article: ArticleSeed) {
  const content = articleSectionsToContent(article.sections);
  return buildBlogTemplate({
    title: article.title,
    slug: article.slug,
    contentType: article.contentType,
    content,
    excerpt: article.excerpt,
    categorySlug: article.categorySlug,
    tags: article.tags,
    author: AUTHOR_PROFILE,
    faq: article.faq,
    internalLinks: article.internalLinks,
    keywords: article.keywords,
  });
}

async function upsertBlogPost(
  ctx: SeedContext,
  template: ReturnType<typeof buildBlogTemplate>
): Promise<void> {
  const categoryId = ctx.categoryIds.get(template.categorySlug);
  if (!categoryId) {
    throw new Error(`Missing category id for slug: ${template.categorySlug}`);
  }

  const faqJson = template.faq as Prisma.InputJsonValue;
  const linksJson = template.internalLinks as Prisma.InputJsonValue;
  const featuredImageUrl = blogImageUrl(template.slug, template.categorySlug);

  const post = await ctx.prisma.blogPost.upsert({
    where: { slug: template.slug },
    update: {
      title: template.title,
      excerpt: template.excerpt,
      content: template.content,
      categoryId,
      status: 'published',
      readingTimeMinutes: template.readingTimeMinutes,
      publishedAt: new Date(),
      faq: faqJson,
      internalLinks: linksJson,
      metaTitle: template.seo.metaTitle,
      metaDescription: template.seo.metaDescription,
      canonicalUrl: template.seo.canonicalUrl,
      featuredImageUrl,
      ogImageUrl: featuredImageUrl,
    },
    create: {
      slug: template.slug,
      title: template.title,
      excerpt: template.excerpt,
      content: template.content,
      authorId: ctx.authorId,
      categoryId,
      status: 'published',
      readingTimeMinutes: template.readingTimeMinutes,
      publishedAt: new Date(),
      faq: faqJson,
      internalLinks: linksJson,
      metaTitle: template.seo.metaTitle,
      metaDescription: template.seo.metaDescription,
      canonicalUrl: template.seo.canonicalUrl,
      featuredImageUrl,
      ogImageUrl: featuredImageUrl,
    },
  });

  for (const tagSlug of template.tags) {
    const tagId = ctx.tagIds.get(tagSlug);
    if (!tagId) continue;

    await ctx.prisma.blogPostTag.upsert({
      where: { blogPostId_tagId: { blogPostId: post.id, tagId } },
      update: {},
      create: { blogPostId: post.id, tagId },
    });
  }
}

export async function seedBlog(ctx: SeedContext): Promise<{ total: number; companyGuides: number }> {
  let companyGuides = 0;

  for (const company of COMPANIES) {
    const template = buildCompanyGuidePost(company);
    if (countWords(template.content) < 600) {
      throw new Error(`Company guide for ${company.slug} is below 600 words`);
    }
    await upsertBlogPost(ctx, template);
    companyGuides += 1;
  }

  for (const article of CAREER_GUIDE_ARTICLES) {
    await upsertBlogPost(ctx, buildArticlePost(article));
  }

  for (const article of PLACEMENT_PREP_ARTICLES) {
    await upsertBlogPost(ctx, buildArticlePost(article));
  }

  const total = companyGuides + CAREER_GUIDE_ARTICLES.length + PLACEMENT_PREP_ARTICLES.length;
  return { total, companyGuides };
}

export { buildCompanyGuideContent, buildCompanyGuidePost, buildArticlePost };
