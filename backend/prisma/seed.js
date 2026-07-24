"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await bcryptjs_1.default.hash('Password123', 12);
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
    const categories = await Promise.all([
        { slug: 'software-engineering', name: 'Software Engineering', type: 'job' },
        { slug: 'data-science', name: 'Data Science & AI', type: 'job' },
        { slug: 'placement-tips', name: 'Placement Tips', type: 'blog' },
        { slug: 'resume-cv', name: 'Resume & CV', type: 'blog' },
    ].map((c) => prisma.category.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
    })));
    const company = await prisma.company.upsert({
        where: { slug: 'tcs' },
        update: {},
        create: {
            slug: 'tcs',
            name: 'Tata Consultancy Services',
            description: 'TCS is a leading global IT services, consulting and business solutions organization. Campus hiring across India for engineering and science graduates.',
            industry: 'Information Technology',
            headquartersCity: 'Mumbai',
            headquartersState: 'Maharashtra',
            isVerified: true,
            verifiedAt: new Date(),
            ownerUserId: employer.id,
            website: 'https://www.tcs.com',
        },
    });
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 2);
    await prisma.job.upsert({
        where: { slug: 'software-engineer-tcs-mumbai-2026' },
        update: {},
        create: {
            slug: 'software-engineer-tcs-mumbai-2026',
            title: 'Software Engineer — Campus Hiring 2026',
            description: 'TCS is hiring fresh engineering graduates for the role of Software Engineer across Mumbai and Pune locations. Candidates should have strong fundamentals in programming, data structures, and problem solving. Training will be provided on Java, Spring Boot, and cloud technologies. Apply now for the TCS Ninja and Digital hiring tracks.',
            companyId: company.id,
            categoryId: categories[0].id,
            postedByUserId: employer.id,
            locationCity: 'Mumbai',
            locationState: 'Maharashtra',
            experienceMin: 0,
            experienceMax: 1,
            salaryMin: 360000,
            salaryMax: 700000,
            skills: ['Java', 'Python', 'DSA', 'SQL'],
            status: 'active',
            publishedAt: new Date(),
            expiresAt,
            metaTitle: 'Software Engineer at TCS Mumbai | CampusJobsHub',
            metaDescription: 'Apply for TCS campus hiring 2026. Fresher software engineer roles in Mumbai.',
        },
    });
    await prisma.internship.upsert({
        where: { slug: 'data-science-intern-infosys-bangalore-2026' },
        update: {},
        create: {
            slug: 'data-science-intern-infosys-bangalore-2026',
            title: 'Data Science Intern',
            description: '6-month paid internship in data science and machine learning. Work on real client projects involving NLP, computer vision, and predictive analytics. Ideal for pre-final and final year students with Python and statistics background.',
            companyId: company.id,
            categoryId: categories[1].id,
            postedByUserId: employer.id,
            locationCity: 'Bangalore',
            locationState: 'Karnataka',
            durationMonths: 6,
            stipendMin: 25000,
            stipendMax: 40000,
            isPaid: true,
            ppoAvailable: true,
            skills: ['Python', 'Machine Learning', 'Pandas', 'SQL'],
            status: 'active',
            publishedAt: new Date(),
            expiresAt,
        },
    });
    await prisma.blogPost.upsert({
        where: { slug: 'campus-placement-preparation-guide-2026' },
        update: {},
        create: {
            slug: 'campus-placement-preparation-guide-2026',
            title: 'Complete Campus Placement Preparation Guide 2026',
            excerpt: 'A step-by-step guide for Indian students preparing for campus placements — aptitude, DSA, HR rounds, and offer negotiation.',
            content: `Campus placement season is the most critical phase of your undergraduate journey. This comprehensive guide covers everything you need to know to maximize your chances of landing your dream offer.

## Phase 1: Aptitude Preparation (Months 1-2)
Focus on quantitative aptitude, logical reasoning, and verbal ability. Practice 20-30 questions daily from topics including time & work, percentages, blood relations, and reading comprehension.

## Phase 2: Technical Preparation (Months 2-4)
Master data structures and algorithms. Focus on arrays, strings, linked lists, trees, and dynamic programming. Practice on LeetCode and GeeksforGeeks daily.

## Phase 3: Resume & Profile (Month 3)
Build a one-page ATS-friendly resume. Highlight projects with measurable impact. Include relevant skills and certifications.

## Phase 4: Mock Interviews (Month 4-5)
Practice HR questions, STAR format answers, and technical mock interviews with peers or mentors.

## Phase 5: Application Strategy
Apply broadly but prioritize companies matching your skill set. Track applications and follow up professionally.

Good luck with your placement journey!`,
            authorId: admin.id,
            categoryId: categories[2].id,
            status: 'published',
            readingTimeMinutes: 8,
            publishedAt: new Date(),
            metaTitle: 'Campus Placement Guide 2026 | CampusJobsHub',
            metaDescription: 'Complete campus placement preparation guide for Indian students.',
        },
    });
    await prisma.careerRoadmap.upsert({
        where: { slug: 'dsa-placement-roadmap' },
        update: {},
        create: {
            slug: 'dsa-placement-roadmap',
            title: 'DSA for Campus Placements',
            description: 'Structured roadmap to master Data Structures & Algorithms for campus hiring.',
            difficulty: 'medium',
            estimatedHours: 200,
            isPublished: true,
            steps: {
                create: [
                    { slug: 'arrays-strings', title: 'Arrays & Strings', stepOrder: 1, estimatedHours: 20, description: 'Master array manipulation and string algorithms.' },
                    { slug: 'linked-lists', title: 'Linked Lists', stepOrder: 2, estimatedHours: 15, description: 'Singly and doubly linked list problems.' },
                    { slug: 'trees-graphs', title: 'Trees & Graphs', stepOrder: 3, estimatedHours: 40, description: 'BFS, DFS, binary trees, and graph algorithms.' },
                    { slug: 'dynamic-programming', title: 'Dynamic Programming', stepOrder: 4, estimatedHours: 50, description: 'Classic DP patterns for interviews.' },
                ],
            },
        },
    });
    await prisma.interviewQuestion.upsert({
        where: { slug: 'tcs-why-should-we-hire-you' },
        update: {},
        create: {
            slug: 'tcs-why-should-we-hire-you',
            question: 'Why should we hire you? (TCS HR Round)',
            answer: 'Structure your answer using three pillars: technical competence (mention specific projects/skills), cultural fit (teamwork, learning agility), and long-term commitment. Give a concrete example of when you solved a problem collaboratively. Keep it under 90 seconds.',
            companyId: company.id,
            role: 'HR',
            difficulty: 'easy',
            topic: 'Behavioral',
            isPublished: true,
        },
    });
    console.log('Seed completed:', { admin: admin.email, company: company.name });
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map