export const siteConfig = {
  name: 'CampusJobsHub',
  description:
    "India's best platform for campus jobs, internships, placement preparation, resume AI, and career roadmaps.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://campusjobshub.com',
  ogImage: '/og-default.png',
  links: {
    twitter: 'https://twitter.com/campusjobshub',
    linkedin: 'https://linkedin.com/company/campusjobshub',
    instagram: 'https://instagram.com/campusjobshub',
  },
  contact: {
    email: 'hello@campusjobshub.com',
    phone: '+91-XXXXXXXXXX',
    address: 'India',
  },
};

export const mainNav = [
  {
    title: 'Jobs',
    href: '/jobs',
    children: [
      { title: 'Browse All Jobs', href: '/jobs', description: 'Latest campus & fresher jobs' },
      { title: 'Fresher Jobs', href: '/jobs/fresher', description: '0-1 year experience' },
      { title: 'Remote Jobs', href: '/jobs/remote', description: 'Work from anywhere' },
      { title: 'Jobs in Mumbai', href: '/jobs/in-mumbai', description: 'Mumbai openings' },
      { title: 'Jobs in Bangalore', href: '/jobs/in-bangalore', description: 'Bangalore openings' },
      { title: 'Jobs in Delhi', href: '/jobs/in-delhi', description: 'Delhi NCR openings' },
    ],
  },
  {
    title: 'Internships',
    href: '/internships',
    children: [
      { title: 'All Internships', href: '/internships', description: 'Paid & unpaid internships' },
      { title: 'Summer Internships', href: '/internships/summer', description: 'Summer 2026 programs' },
      { title: 'PPO Internships', href: '/internships/ppo', description: 'Pre-placement offer roles' },
      { title: 'Internships in Pune', href: '/internships/in-pune', description: 'Pune internships' },
    ],
  },
  { title: 'Companies', href: '/companies' },
  {
    title: 'Prepare',
    href: '/prepare/interview-questions',
    children: [
      { title: 'Interview Questions', href: '/prepare/interview-questions', description: 'Company-wise Q&A' },
      { title: 'Career Roadmaps', href: '/prepare/roadmaps', description: 'Structured learning paths' },
      { title: 'Placement Blog', href: '/blog', description: 'Tips, guides & strategies' },
    ],
  },
  { title: 'Resume AI', href: '/resume' },
  { title: 'Blog', href: '/blog' },
];

export const footerNav = {
  platform: [
    { title: 'Jobs', href: '/jobs' },
    { title: 'Internships', href: '/internships' },
    { title: 'Companies', href: '/companies' },
    { title: 'Resume Builder', href: '/resume-builder' },
    { title: 'ATS Checker', href: '/ats-resume-checker' },
  ],
  resources: [
    { title: 'Blog', href: '/blog' },
    { title: 'Interview Questions', href: '/prepare/interview-questions' },
    { title: 'Career Roadmaps', href: '/prepare/roadmaps' },
    { title: 'Cover Letter Generator', href: '/cover-letter-generator' },
  ],
  company: [
    { title: 'About Us', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Advertise With Us', href: '/advertise' },
    { title: 'Editorial Policy', href: '/editorial-policy' },
  ],
  legal: [
    { title: 'Privacy Policy', href: '/privacy-policy' },
    { title: 'Terms of Service', href: '/terms' },
    { title: 'Cookie Policy', href: '/cookie-policy' },
    { title: 'Disclaimer', href: '/disclaimer' },
  ],
};

export const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Noida', 'Gurgaon',
];
