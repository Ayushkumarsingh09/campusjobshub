import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
}

export function buildMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
  type = 'website',
  publishedTime,
  author,
}: SeoProps): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: 'en_IN',
      type,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    ...(author ? { authors: [{ name: author }] } : {}),
  };
}

export function jobPostingJsonLd(job: {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string | null;
  expiresAt: string;
  locationCity?: string | null;
  locationState?: string | null;
  isRemote?: boolean;
  salaryMin?: number | null;
  salaryMax?: number | null;
  employmentType?: string;
  company: { name: string; slug: string; logoUrl?: string | null; website?: string | null };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: { '@type': 'PropertyValue', name: siteConfig.name, value: job.slug },
    datePosted: job.publishedAt ?? new Date().toISOString(),
    validThrough: job.expiresAt,
    employmentType: job.employmentType?.toUpperCase() ?? 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company.name,
      sameAs: job.company.website ?? `${siteConfig.url}/companies/${job.company.slug}`,
      logo: job.company.logoUrl,
    },
    jobLocation: job.isRemote
      ? { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'IN' } }
      : {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.locationCity,
            addressRegion: job.locationState,
            addressCountry: 'IN',
          },
        },
    ...(job.salaryMin || job.salaryMax
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'INR',
            value: {
              '@type': 'QuantitativeValue',
              minValue: job.salaryMin,
              maxValue: job.salaryMax,
              unitText: 'YEAR',
            },
          },
        }
      : {}),
    url: `${siteConfig.url}/jobs/${job.slug}`,
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt?: string | null;
  slug: string;
  publishedAt?: string | null;
  featuredImageUrl?: string | null;
  author: { name: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImageUrl,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: post.author.name },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/og-default.png` },
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/og-default.png`,
    description: siteConfig.description,
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.contact.email,
      contactType: 'customer support',
      areaServed: 'IN',
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
