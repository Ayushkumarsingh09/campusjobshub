import type { ImageCategory, StockImageMeta } from './types';

/** Optimized Unsplash CDN params — WebP, compressed, responsive */
function unsplash(photoId: string, w = 1200): string {
  return `https://images.unsplash.com/${photoId}?w=${w}&q=80&auto=format&fit=crop&fm=webp`;
}

/** Royalty-free stock images (Unsplash License) */
export const STOCK_IMAGES: Record<ImageCategory, StockImageMeta> = {
  'company-tech': {
    src: unsplash('photo-1497366216548-37526070297c'),
    alt: 'Modern technology office workspace with open floor plan',
    title: 'Modern tech office workspace',
    width: 1200,
    height: 675,
    category: 'company-tech',
    credit: 'Unsplash',
  },
  'company-enterprise': {
    src: unsplash('photo-1486406146926-c627a92fd1b2'),
    alt: 'Enterprise corporate skyscraper and business district',
    title: 'Enterprise technology headquarters',
    width: 1200,
    height: 675,
    category: 'company-enterprise',
    credit: 'Unsplash',
  },
  'company-consulting': {
    src: unsplash('photo-1556761175-5973dc0f32e7'),
    alt: 'Business professionals collaborating in a consulting meeting',
    title: 'Consulting and business strategy workspace',
    width: 1200,
    height: 675,
    category: 'company-consulting',
    credit: 'Unsplash',
  },
  'company-fintech': {
    src: unsplash('photo-1559136555-9303ba3848ae'),
    alt: 'Startup fintech team working in a modern office',
    title: 'Fintech startup workplace',
    width: 1200,
    height: 675,
    category: 'company-fintech',
    credit: 'Unsplash',
  },
  'job-career': {
    src: unsplash('photo-1521737711862-ea3e973557b1'),
    alt: 'Professional team meeting in a modern workplace',
    title: 'Professional career workplace',
    width: 1200,
    height: 675,
    category: 'job-career',
    credit: 'Unsplash',
  },
  'job-remote': {
    src: unsplash('photo-1588196749597-9cec075daf29'),
    alt: 'Person working remotely on a laptop from home',
    title: 'Remote work setup',
    width: 1200,
    height: 675,
    category: 'job-remote',
    credit: 'Unsplash',
  },
  'job-fresher': {
    src: unsplash('photo-1507003211169-0a1dd7228f2d'),
    alt: 'Young professional starting a new career journey',
    title: 'Fresher career opportunities',
    width: 1200,
    height: 675,
    category: 'job-fresher',
    credit: 'Unsplash',
  },
  'internship-students': {
    src: unsplash('photo-1523240795612-9a054b0db644'),
    alt: 'University students collaborating on a project',
    title: 'Students working on internship project',
    width: 1200,
    height: 675,
    category: 'internship-students',
    credit: 'Unsplash',
  },
  'internship-learning': {
    src: unsplash('photo-1522202176988-66273c2fd55f'),
    alt: 'Interns collaborating and learning together',
    title: 'Intern collaboration and mentorship',
    width: 1200,
    height: 675,
    category: 'internship-learning',
    credit: 'Unsplash',
  },
  'roadmap-dsa': {
    src: unsplash('photo-1516116216621-bc61fec52766'),
    alt: 'Developer writing code for algorithms and data structures',
    title: 'DSA and programming practice',
    width: 1200,
    height: 675,
    category: 'roadmap-dsa',
    credit: 'Unsplash',
  },
  'roadmap-web': {
    src: unsplash('photo-1461749280684-dccba630e2f6'),
    alt: 'Web development on laptop with code editor',
    title: 'Full-stack web development',
    width: 1200,
    height: 675,
    category: 'roadmap-web',
    credit: 'Unsplash',
  },
  'roadmap-data': {
    src: unsplash('photo-1551288049-bebda4e38f71'),
    alt: 'Data analytics dashboard and charts on screen',
    title: 'Data science and analytics learning',
    width: 1200,
    height: 675,
    category: 'roadmap-data',
    credit: 'Unsplash',
  },
  'roadmap-ai': {
    src: unsplash('photo-1677442136019-21780ecad995'),
    alt: 'Artificial intelligence and machine learning concept',
    title: 'AI and machine learning roadmap',
    width: 1200,
    height: 675,
    category: 'roadmap-ai',
    credit: 'Unsplash',
  },
  'roadmap-devops': {
    src: unsplash('photo-1451187580459-43490279c0fa'),
    alt: 'Cloud infrastructure and DevOps technology visualization',
    title: 'DevOps and cloud engineering',
    width: 1200,
    height: 675,
    category: 'roadmap-devops',
    credit: 'Unsplash',
  },
  'roadmap-mobile': {
    src: unsplash('photo-1512941937669-90a1b58e7e9c'),
    alt: 'Mobile app development on smartphone and laptop',
    title: 'Mobile application development',
    width: 1200,
    height: 675,
    category: 'roadmap-mobile',
    credit: 'Unsplash',
  },
  'blog-placement': {
    src: unsplash('photo-1434030214721-281e9639f297'),
    alt: 'Student preparing for campus placement interview',
    title: 'Campus placement preparation',
    width: 1200,
    height: 675,
    category: 'blog-placement',
    credit: 'Unsplash',
  },
  'blog-interview': {
    src: unsplash('photo-1573496359142-b8d87734a5a2'),
    alt: 'Professional job interview in office setting',
    title: 'Interview preparation guide',
    width: 1200,
    height: 675,
    category: 'blog-interview',
    credit: 'Unsplash',
  },
  'blog-resume': {
    src: unsplash('photo-1586281380349-632531db7ed4'),
    alt: 'Resume and job application documents on desk',
    title: 'Resume and application tips',
    width: 1200,
    height: 675,
    category: 'blog-resume',
    credit: 'Unsplash',
  },
  'blog-general': {
    src: unsplash('photo-1522071820081-009f0129c71c'),
    alt: 'Team collaborating on career development project',
    title: 'Career growth and professional development',
    width: 1200,
    height: 675,
    category: 'blog-general',
    credit: 'Unsplash',
  },
};

const COMPANY_THEME: Record<string, ImageCategory> = {
  google: 'company-tech',
  microsoft: 'company-tech',
  amazon: 'company-tech',
  meta: 'company-tech',
  apple: 'company-tech',
  netflix: 'company-tech',
  adobe: 'company-tech',
  oracle: 'company-tech',
  ibm: 'company-enterprise',
  tcs: 'company-tech',
  infosys: 'company-tech',
  wipro: 'company-tech',
  accenture: 'company-consulting',
  cognizant: 'company-consulting',
  capgemini: 'company-consulting',
  deloitte: 'company-consulting',
  hcl: 'company-tech',
  'tech-mahindra': 'company-tech',
  'lti-mindtree': 'company-tech',
  flipkart: 'company-fintech',
  razorpay: 'company-fintech',
  freshworks: 'company-fintech',
  paytm: 'company-fintech',
  phonepe: 'company-fintech',
  zoho: 'company-tech',
};

const ROADMAP_TOPIC_THEME: Record<string, ImageCategory> = {
  DSA: 'roadmap-dsa',
  'Web Development': 'roadmap-web',
  'Full Stack': 'roadmap-web',
  'Data Science': 'roadmap-data',
  'Machine Learning': 'roadmap-ai',
  AI: 'roadmap-ai',
  DevOps: 'roadmap-devops',
  Cloud: 'roadmap-devops',
  Mobile: 'roadmap-mobile',
  Android: 'roadmap-mobile',
  iOS: 'roadmap-mobile',
};

export function getStockImage(category: ImageCategory): StockImageMeta {
  return STOCK_IMAGES[category] ?? STOCK_IMAGES['blog-general'];
}

export function getCompanyImage(slug: string): StockImageMeta {
  const category = COMPANY_THEME[slug] ?? 'company-tech';
  return {
    ...getStockImage(category),
    alt: `${slug.replace(/-/g, ' ')} workplace — ${getStockImage(category).alt}`,
    title: `${slug.replace(/-/g, ' ')} company workplace`,
  };
}

export function getJobImage(options: { isRemote?: boolean; isFresher?: boolean; index?: number }): StockImageMeta {
  if (options.isRemote) return getStockImage('job-remote');
  if (options.isFresher) return getStockImage('job-fresher');
  const variants = ['job-career', 'job-fresher', 'job-remote'] as const;
  const idx = (options.index ?? 0) % variants.length;
  return getStockImage(variants[idx]);
}

export function getInternshipImage(index = 0): StockImageMeta {
  return getStockImage(index % 2 === 0 ? 'internship-students' : 'internship-learning');
}

export function getRoadmapImage(topic?: string | null, slug?: string): StockImageMeta {
  if (topic && ROADMAP_TOPIC_THEME[topic]) {
    return getStockImage(ROADMAP_TOPIC_THEME[topic]);
  }
  if (slug?.includes('dsa') || slug?.includes('algorithm')) return getStockImage('roadmap-dsa');
  if (slug?.includes('data') || slug?.includes('ml') || slug?.includes('ai')) return getStockImage('roadmap-ai');
  if (slug?.includes('devops') || slug?.includes('cloud')) return getStockImage('roadmap-devops');
  if (slug?.includes('mobile') || slug?.includes('android') || slug?.includes('ios')) return getStockImage('roadmap-mobile');
  if (slug?.includes('web') || slug?.includes('full-stack') || slug?.includes('frontend') || slug?.includes('backend')) {
    return getStockImage('roadmap-web');
  }
  return getStockImage('roadmap-web');
}

export function getBlogImage(slug: string, categorySlug?: string): StockImageMeta {
  if (slug.includes('campus-hiring-guide') || categorySlug === 'company-guides') {
    const companySlug = slug.replace('-campus-hiring-guide-2026', '');
    return getCompanyImage(companySlug);
  }
  if (slug.includes('interview') || slug.includes('dsa') || categorySlug === 'interview-prep') {
    return getStockImage('blog-interview');
  }
  if (slug.includes('resume') || slug.includes('ats') || slug.includes('cover-letter')) {
    return getStockImage('blog-resume');
  }
  if (slug.includes('placement') || slug.includes('campus') || categorySlug === 'placement-prep') {
    return getStockImage('blog-placement');
  }
  return getStockImage('blog-general');
}
