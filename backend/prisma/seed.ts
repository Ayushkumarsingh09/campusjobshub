import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { seedCategories } from './seeds/categories.seed';
import { seedCompanies } from './seeds/companies.seed';
import { seedBlog } from './seeds/blog.seed';
import { seedJobs } from './seeds/jobs.seed';
import { seedInternships } from './seeds/internships.seed';
import { seedRoadmaps } from './seeds/roadmaps.seed';
import { seedInterviewContent } from './seeds/interview.seed';
import { seedSeoPages } from './seeds/seo.seed';
import { COMPANIES } from './seeds/data/companies';
import { ROADMAP_DEFINITIONS } from './seeds/roadmaps.seed';
import type { SeedContext } from './seeds/utils';

const prisma = new PrismaClient();

async function seedUsers() {
  const passwordHash = await bcrypt.hash('Password123', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@campusjobshub.com' },
    update: {},
    create: {
      email: 'superadmin@campusjobshub.com',
      name: 'Super Admin',
      passwordHash,
      role: 'super_admin',
      emailVerifiedAt: new Date(),
      profileCompletion: 100,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@campusjobshub.com' },
    update: {},
    create: {
      email: 'admin@campusjobshub.com',
      name: 'CampusJobsHub Admin',
      passwordHash,
      role: 'admin',
      emailVerifiedAt: new Date(),
      profileCompletion: 100,
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@campusjobshub.com' },
    update: {},
    create: {
      email: 'editor@campusjobshub.com',
      name: 'Content Editor',
      passwordHash,
      role: 'editor',
      emailVerifiedAt: new Date(),
    },
  });

  const author = await prisma.user.upsert({
    where: { email: 'author@campusjobshub.com' },
    update: {},
    create: {
      email: 'author@campusjobshub.com',
      name: 'Priya Sharma',
      passwordHash,
      role: 'author',
      emailVerifiedAt: new Date(),
      bio: 'Campus placement mentor and career content writer.',
    },
  });

  const employer = await prisma.user.upsert({
    where: { email: 'employer@demo.com' },
    update: {},
    create: {
      email: 'employer@demo.com',
      name: 'Demo Recruiter',
      passwordHash,
      role: 'employer',
      emailVerifiedAt: new Date(),
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@demo.com' },
    update: {},
    create: {
      email: 'student@demo.com',
      name: 'Demo Student',
      passwordHash,
      role: 'student',
      emailVerifiedAt: new Date(),
      college: 'Demo Engineering College',
      graduationYear: 2026,
      skills: ['Java', 'Python', 'React', 'SQL', 'DSA'],
      interests: ['Software Engineering', 'Full Stack'],
      targetRole: 'Software Engineer',
      profileCompletion: 65,
    },
  });

  return { superAdmin, admin, editor, author, employer, student };
}

async function seedSiteSettings(superAdminId: string) {
  const defaults = [
    { key: 'logo', value: { url: '/og-default.png' } },
    { key: 'favicon', value: { url: '/favicon.ico' } },
    {
      key: 'social',
      value: {
        twitter: 'https://twitter.com/campusjobshub',
        linkedin: 'https://linkedin.com/company/campusjobshub',
        instagram: 'https://instagram.com/campusjobshub',
        youtube: '',
      },
    },
    {
      key: 'contact',
      value: {
        email: 'hello@campusjobshub.com',
        phone: '+91-9876543210',
        address: 'India',
      },
    },
    {
      key: 'footer',
      value: {
        tagline: "India's campus jobs, internships & placement preparation platform",
        copyright: '© 2026 CampusJobsHub. All rights reserved.',
      },
    },
    {
      key: 'adsense',
      value: {
        enabled: false,
        clientId: '',
        slots: { blog: true, interview: true, jobListing: false, jobDetail: false },
      },
    },
  ];

  for (const setting of defaults) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value, updatedBy: superAdminId },
    });
  }
}

async function main() {
  console.log('🌱 CampusJobsHub — Full Content Ecosystem Seed\n');

  const users = await seedUsers();
  console.log('✓ Users seeded');

  await seedSiteSettings(users.superAdmin.id);
  console.log('✓ Site settings seeded');

  const { categoryIds, tagIds } = await seedCategories({ prisma });
  console.log('✓ Categories & tags seeded');

  const ctx: SeedContext = {
    prisma,
    authorId: users.editor.id,
    employerId: users.employer.id,
    categoryIds,
    tagIds,
    companyIds: new Map(),
  };

  const companyIds = await seedCompanies(ctx);
  console.log(`✓ ${companyIds.size} companies seeded`);

  const companyMap = new Map<string, { id: string; name: string; slug: string }>();
  for (const c of COMPANIES) {
    const id = companyIds.get(c.slug);
    if (id) companyMap.set(c.slug, { id, name: c.name, slug: c.slug });
  }

  const { cleanupStaleListings } = await import('./seeds/cleanup-listings');
  await cleanupStaleListings(prisma);

  const slugRegistry = new Set<string>();
  const existingSlugs = await prisma.job.findMany({ select: { slug: true } });
  existingSlugs.forEach((j) => slugRegistry.add(j.slug));
  const existingInternSlugs = await prisma.internship.findMany({ select: { slug: true } });
  existingInternSlugs.forEach((i) => slugRegistry.add(i.slug));

  const jobCount = await seedJobs({
    prisma,
    companyMap,
    userId: users.employer.id,
    slugRegistry,
  });
  console.log(`✓ ${jobCount} jobs seeded`);

  const internshipCount = await seedInternships({
    prisma,
    companyMap,
    userId: users.employer.id,
    slugRegistry,
  });
  console.log(`✓ ${internshipCount} internships seeded`);

  const blogResult = await seedBlog(ctx);
  console.log(`✓ ${blogResult.total} blog articles seeded (${blogResult.companyGuides} company guides)`);

  const roadmapPaths = await seedRoadmaps(ctx);
  console.log(`✓ ${roadmapPaths.length} career roadmap paths seeded`);

  await seedInterviewContent(ctx);
  const interviewQuestionCount = await prisma.interviewQuestion.count();
  const interviewArticleCount = await prisma.blogPost.count({
    where: { category: { slug: 'interview-articles' } },
  });
  console.log(
    `✓ ${interviewQuestionCount} interview questions + ${interviewArticleCount} hub articles seeded`
  );

  const seoPaths = await seedSeoPages(ctx);
  console.log(`✓ ${seoPaths.length} SEO pages seeded`);

  console.log('\n✅ Content ecosystem seed complete!');
  console.log({
    companies: companyIds.size,
    jobs: jobCount,
    internships: internshipCount,
    blogPosts: blogResult.total,
    roadmaps: ROADMAP_DEFINITIONS.length,
    interviewQuestions: interviewQuestionCount,
    seoPages: seoPaths.length,
    logins: {
      superAdmin: 'superadmin@campusjobshub.com',
      admin: 'admin@campusjobshub.com',
      editor: 'editor@campusjobshub.com',
      student: 'student@demo.com',
      employer: 'employer@demo.com',
      password: 'Password123',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
