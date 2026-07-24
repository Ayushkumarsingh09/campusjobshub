/** Royalty-free Unsplash URLs for seed data (mirrors frontend/src/lib/images/catalog.ts) */

function unsplash(photoId: string, w = 1200): string {
  return `https://images.unsplash.com/${photoId}?w=${w}&q=80&auto=format&fit=crop&fm=webp`;
}

const IMAGES = {
  companyTech: unsplash('photo-1497366216548-37526070297c'),
  companyEnterprise: unsplash('photo-1486406146926-c627a92fd1b2'),
  companyConsulting: unsplash('photo-1556761175-5973dc0f32e7'),
  companyFintech: unsplash('photo-1559136555-9303ba3848ae'),
  jobCareer: unsplash('photo-1521737711862-ea3e973557b1'),
  jobRemote: unsplash('photo-1588196749597-9cec075daf29'),
  jobFresher: unsplash('photo-1507003211169-0a1dd7228f2d'),
  internshipStudents: unsplash('photo-1523240795612-9a054b0db644'),
  internshipLearning: unsplash('photo-1522202176988-66273c2fd55f'),
  roadmapDsa: unsplash('photo-1516116216621-bc61fec52766'),
  roadmapWeb: unsplash('photo-1461749280684-dccba630e2f6'),
  roadmapData: unsplash('photo-1551288049-bebda4e38f71'),
  roadmapAi: unsplash('photo-1677442136019-21780ecad995'),
  roadmapDevops: unsplash('photo-1451187580459-43490279c0fa'),
  roadmapMobile: unsplash('photo-1512941937669-90a1b58e7e9c'),
  blogPlacement: unsplash('photo-1434030214721-281e9639f297'),
  blogInterview: unsplash('photo-1573496359142-b8d87734a5a2'),
  blogResume: unsplash('photo-1586281380349-632531db7ed4'),
  blogGeneral: unsplash('photo-1522071820081-009f0129c71c'),
} as const;

const COMPANY_THEME: Record<string, keyof typeof IMAGES> = {
  google: 'companyTech',
  microsoft: 'companyTech',
  amazon: 'companyTech',
  meta: 'companyTech',
  apple: 'companyTech',
  netflix: 'companyTech',
  adobe: 'companyTech',
  oracle: 'companyTech',
  ibm: 'companyEnterprise',
  tcs: 'companyTech',
  infosys: 'companyTech',
  wipro: 'companyTech',
  accenture: 'companyConsulting',
  cognizant: 'companyConsulting',
  capgemini: 'companyConsulting',
  deloitte: 'companyConsulting',
  hcl: 'companyTech',
  'tech-mahindra': 'companyTech',
  'lti-mindtree': 'companyTech',
  flipkart: 'companyFintech',
  razorpay: 'companyFintech',
  freshworks: 'companyFintech',
  paytm: 'companyFintech',
  phonepe: 'companyFintech',
  zoho: 'companyTech',
};

const ROADMAP_TOPIC: Record<string, keyof typeof IMAGES> = {
  DSA: 'roadmapDsa',
  'Web Development': 'roadmapWeb',
  'Full Stack': 'roadmapWeb',
  'Data Science': 'roadmapData',
  'Machine Learning': 'roadmapAi',
  AI: 'roadmapAi',
  DevOps: 'roadmapDevops',
  Cloud: 'roadmapDevops',
  Mobile: 'roadmapMobile',
  Android: 'roadmapMobile',
  iOS: 'roadmapMobile',
};

export function companyImageUrl(slug: string): string {
  const key = COMPANY_THEME[slug] ?? 'companyTech';
  return IMAGES[key];
}

export function jobImageUrl(isRemote: boolean, isFresher: boolean, index: number): string {
  if (isRemote) return IMAGES.jobRemote;
  if (isFresher) return IMAGES.jobFresher;
  const keys = ['jobCareer', 'jobFresher', 'jobRemote'] as const;
  return IMAGES[keys[index % keys.length]];
}

export function internshipImageUrl(index: number): string {
  return index % 2 === 0 ? IMAGES.internshipStudents : IMAGES.internshipLearning;
}

export function roadmapImageUrl(topic?: string | null, slug?: string): string {
  if (topic && ROADMAP_TOPIC[topic]) return IMAGES[ROADMAP_TOPIC[topic]];
  if (slug?.includes('dsa') || slug?.includes('algorithm')) return IMAGES.roadmapDsa;
  if (slug?.includes('data') || slug?.includes('ml') || slug?.includes('ai')) return IMAGES.roadmapAi;
  if (slug?.includes('devops') || slug?.includes('cloud')) return IMAGES.roadmapDevops;
  if (slug?.includes('mobile') || slug?.includes('android')) return IMAGES.roadmapMobile;
  if (slug?.includes('web') || slug?.includes('full-stack') || slug?.includes('frontend')) return IMAGES.roadmapWeb;
  return IMAGES.roadmapWeb;
}

export function blogImageUrl(slug: string, categorySlug?: string): string {
  if (slug.includes('campus-hiring-guide') || categorySlug === 'company-guides') {
    const companySlug = slug.replace('-campus-hiring-guide-2026', '');
    return companyImageUrl(companySlug);
  }
  if (slug.includes('interview') || slug.includes('dsa') || categorySlug === 'interview-prep') {
    return IMAGES.blogInterview;
  }
  if (slug.includes('resume') || slug.includes('ats') || slug.includes('cover-letter')) {
    return IMAGES.blogResume;
  }
  if (slug.includes('placement') || slug.includes('campus') || categorySlug === 'placement-prep') {
    return IMAGES.blogPlacement;
  }
  return IMAGES.blogGeneral;
}
