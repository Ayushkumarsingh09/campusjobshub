import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { fetchListWithFallback } from '@/lib/fetch-content';
import { FALLBACK_BLOG_POSTS } from '@/lib/static-fallback-data';
import type { BlogPost } from '@/types/api';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { BlogCard } from '@/components/cards/blog-card';
import { AdSlot } from '@/components/ads/ad-slot';

export const metadata = buildMetadata({
  title: `Placement Blog — Tips, Guides & Strategies — ${siteConfig.name}`,
  description:
    'Expert articles on campus placements, resume writing, interview prep, aptitude tests, and career advice for Indian students.',
  path: '/blog',
});

async function getPosts(): Promise<BlogPost[]> {
  return fetchListWithFallback('/blog', { page: 1, limit: 12 }, FALLBACK_BLOG_POSTS);
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Placement Blog"
        description="Guides, strategies, and insights to help you succeed in campus hiring and early-career growth."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Blog', href: '/blog' }]} />}
      />

      <p className="mt-6 max-w-3xl text-muted-foreground">
        Our editorial team publishes in-depth articles on topics that matter to Indian students —
        from cracking TCS NQT to negotiating your first salary. All content follows our{' '}
        <a href="/editorial-policy" className="text-primary hover:underline">
          editorial policy
        </a>
        .
      </p>

      <AdSlot slotId="blog-list-top" format="banner" className="my-8" adEligible />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            title={post.title}
            slug={post.slug}
            excerpt={post.excerpt}
            author={post.author?.name ?? 'Editorial Team'}
            publishedAt={post.publishedAt ?? post.createdAt}
            category={post.category?.name}
            categorySlug={post.category?.slug}
            readingTime={post.readingTimeMinutes}
            imageUrl={post.featuredImageUrl}
          />
        ))}
      </div>
    </div>
  );
}
