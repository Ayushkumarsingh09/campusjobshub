/** Official company career portal URLs — used for external Apply buttons */
export const COMPANY_CAREERS_URLS: Record<string, string> = {
  google: 'https://careers.google.com/jobs/results/',
  microsoft: 'https://careers.microsoft.com/us/en/search-results',
  amazon: 'https://www.amazon.jobs/en/search',
  meta: 'https://www.metacareers.com/jobs/',
  apple: 'https://jobs.apple.com/en-us/search',
  netflix: 'https://jobs.netflix.com/search',
  adobe: 'https://careers.adobe.com/us/en/search-results',
  oracle: 'https://careers.oracle.com/en/sites/jobsearch/jobs',
  ibm: 'https://www.ibm.com/careers/search',
  tcs: 'https://www.tcs.com/careers/india',
  infosys: 'https://www.infosys.com/careers/apply.html',
  wipro: 'https://careers.wipro.com/search/',
  accenture: 'https://www.accenture.com/in-en/careers/jobsearch',
  cognizant: 'https://careers.cognizant.com/global-en/jobs/',
  capgemini: 'https://www.capgemini.com/careers/join-us/',
  deloitte: 'https://apply.deloitte.com/careers/SearchJobs',
  hcl: 'https://www.hcltech.com/careers',
  zoho: 'https://www.zoho.com/careers/',
  'tech-mahindra': 'https://careers.techmahindra.com/',
  'lti-mindtree': 'https://www.ltimindtree.com/careers',
  flipkart: 'https://www.flipkartcareers.com/',
  razorpay: 'https://razorpay.com/jobs/',
  freshworks: 'https://www.freshworks.com/company/careers/',
  paytm: 'https://paytm.com/careers/',
  phonepe: 'https://www.phonepe.com/careers/',
};

export function companyCareersUrl(slug: string, website?: string): string {
  return COMPANY_CAREERS_URLS[slug] ?? (website ? `${website.replace(/\/$/, '')}/careers` : '');
}
