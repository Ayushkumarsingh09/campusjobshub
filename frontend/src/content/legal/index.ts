import { siteConfig } from '@/config/site';

export const LEGAL_LAST_UPDATED = 'June 7, 2026';

export const legalSiteRefs = {
  siteName: siteConfig.name,
  siteUrl: siteConfig.url,
  contactEmail: siteConfig.contact.email,
  contactAddress: siteConfig.contact.address,
  contactPhone: siteConfig.contact.phone,
};

export const adsenseRequiredPages = [
  { path: '/about', title: 'About Us' },
  { path: '/contact', title: 'Contact Us' },
  { path: '/privacy-policy', title: 'Privacy Policy' },
  { path: '/terms', title: 'Terms of Service' },
  { path: '/cookie-policy', title: 'Cookie Policy' },
  { path: '/disclaimer', title: 'Disclaimer' },
  { path: '/editorial-policy', title: 'Editorial Policy' },
  { path: '/advertise', title: 'Advertise With Us' },
] as const;

export const editorialStandards = [
  'All placement and career articles are reviewed by editors with campus recruitment experience.',
  'Company hiring guides cite publicly available recruitment patterns and student-reported experiences.',
  'Job and internship listings require employer verification before featured placement.',
  'Interview answers are fact-checked against standard references and updated each academic year.',
  'Sponsored or affiliate content is clearly labelled and never influences editorial rankings.',
  'We correct factual errors within 72 hours of verified reports via our contact form.',
];

export const aboutMissionParagraphs = [
  `${siteConfig.name} was founded to make campus placement accessible to every student in India, regardless of college tier, city, or background. We aggregate fresher jobs and internships from startups, IT services, product companies, and campus recruiters — and pair them with practical tools like AI resume builders, ATS checkers, interview question banks, and structured career roadmaps.`,
  `Our editorial team publishes placement guides, company-specific interview prep, and resume advice tailored to the Indian hiring landscape. We work with employers who want to reach talented graduates directly, and we verify company profiles to reduce spam and misleading listings.`,
  `Whether you are preparing for TCS, Infosys, Wipro, Amazon, or a fast-growing startup, ${siteConfig.name} is designed to be your single destination from first resume draft to offer letter.`,
];
