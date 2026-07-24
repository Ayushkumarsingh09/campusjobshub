import { notFound } from 'next/navigation';

import Link from 'next/link';

import { Clock, Calendar } from 'lucide-react';

import { api } from '@/lib/api';
import { fetchOneWithFallback, fetchWithRetry } from '@/lib/fetch-content';
import { getFallbackBlogPost } from '@/lib/static-fallback-data';

import { buildMetadata, articleJsonLd, faqJsonLd } from '@/lib/seo';

import { timeAgo, formatDate } from '@/lib/utils';

import type { BlogPost } from '@/types/api';

import { Breadcrumbs } from '@/components/seo/breadcrumbs';

import { JsonLd } from '@/components/seo/json-ld';

import { Badge } from '@/components/ui/badge';

import { AdSlot } from '@/components/ads/ad-slot';

import { Separator } from '@/components/ui/separator';

import { FaqSection } from '@/components/content/faq-section';

import { InternalLinksBlock } from '@/components/content/internal-links-block';

import { RelatedContent } from '@/components/content/related-content';

import { AuthorCard } from '@/components/content/author-card';
import { ContentImage } from '@/components/shared/content-image';
import { getBlogImage, resolveImageMeta } from '@/lib/images';

import { parseFaq } from '@/lib/content/parse-faq';
import { renderContent } from '@/lib/markdown';

import { mergeInternalLinks, parseInternalLinks } from '@/lib/content/internal-links';



interface BlogPostPageProps {

  params: Promise<{ slug: string }>;

}



async function getPost(slug: string): Promise<BlogPost | null> {
  return fetchOneWithFallback<BlogPost>(`/blog/${slug}`, slug, getFallbackBlogPost);
}



export async function generateStaticParams() {
  const { FALLBACK_BLOG_SLUGS } = await import('@/lib/static-export-params');
  try {
    const posts = await fetchWithRetry<BlogPost[]>(() => api.get<BlogPost[]>('/blog', { page: 1, limit: 100 }));
    const fromApi = (posts ?? []).map((post) => ({ slug: post.slug }));
    return fromApi.length > 0 ? fromApi : FALLBACK_BLOG_SLUGS.map((slug) => ({ slug }));
  } catch {
    return FALLBACK_BLOG_SLUGS.map((slug) => ({ slug }));
  }
}



export async function generateMetadata({ params }: BlogPostPageProps) {

  const { slug } = await params;

  const post = await getPost(slug);

  if (!post) {

    return buildMetadata({

      title: 'Article Not Found',

      description: 'The requested blog post could not be found.',

      path: `/blog/${slug}`,

      noIndex: true,

    });

  }

  return buildMetadata({

    title: post.metaTitle ?? post.title,

    description: post.metaDescription ?? post.excerpt ?? post.title,

    path: `/blog/${post.slug}`,

    type: 'article',

    publishedTime: post.publishedAt ?? undefined,

    author: post.author?.name,

    image: post.featuredImageUrl ?? undefined,

  });

}



export default async function BlogPostPage({ params }: BlogPostPageProps) {

  const { slug } = await params;

  const post = await getPost(slug);



  if (!post) notFound();



  const faqs = parseFaq(post.faq);

  const internalLinks = mergeInternalLinks(parseInternalLinks(post.internalLinks), 6);



  return (

    <>

      <JsonLd

        data={articleJsonLd({

          title: post.title,

          excerpt: post.excerpt,

          slug: post.slug,

          publishedAt: post.publishedAt,

          featuredImageUrl: post.featuredImageUrl,

          author: { name: post.author?.name ?? 'Editorial Team' },

        })}

      />

      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}



      <article className="container mx-auto max-w-3xl px-4 py-8 sm:py-12">

        <Breadcrumbs

          items={[

            { name: 'Blog', href: '/blog' },

            ...(post.category

              ? [{ name: post.category.name, href: `/blog?category=${post.category.slug}` }]

              : []),

            { name: post.title, href: `/blog/${post.slug}` },

          ]}

        />



        {post.category && (

          <Badge variant="secondary" className="mt-6">

            {post.category.name}

          </Badge>

        )}



        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>



        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">

          <span className="inline-flex items-center gap-1">

            <Calendar className="h-4 w-4" aria-hidden />

            Published {formatDate(post.publishedAt ?? post.createdAt)}

          </span>

          <span>Updated {timeAgo(post.updatedAt)}</span>

          {post.readingTimeMinutes && (

            <span className="inline-flex items-center gap-1">

              <Clock className="h-4 w-4" aria-hidden />

              {post.readingTimeMinutes} min read

            </span>

          )}

        </div>



        <ContentImage
          src={
            resolveImageMeta(
              post.featuredImageUrl,
              getBlogImage(post.slug, post.category?.slug),
              post.title
            ).src
          }
          alt={post.title}
          title={post.title}
          className="mt-8"
          priority
          fallbackCategory="blog-general"
        />



        <div className="mt-8">

          <AuthorCard

            author={{

              name: post.author?.name ?? 'CampusJobsHub Editorial Team',

              avatarUrl: post.author?.avatarUrl,

              role: 'Placement & Career Content',

            }}

          />

        </div>



        <AdSlot slotId="blog-article-top" format="banner" className="my-8" adEligible />



        <div
          className="prose prose-slate dark:prose-invert mt-8 max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
        />



        <AdSlot slotId="blog-article-mid" format="in-feed" className="my-10" adEligible />



        <FaqSection faqs={faqs} />

        <InternalLinksBlock links={internalLinks} />



        <Separator className="my-10" />



        <p className="text-sm text-muted-foreground">

          Disclaimer: This article is for educational purposes. Hiring processes and company

          policies change — verify details with official sources. See our{' '}

          <Link href="/disclaimer" className="text-primary hover:underline">

            disclaimer

          </Link>

          .

        </p>

      </article>



      <div className="container mx-auto max-w-3xl px-4 pb-12">

        <RelatedContent type="blog" slug={post.slug} />

      </div>

    </>

  );

}

