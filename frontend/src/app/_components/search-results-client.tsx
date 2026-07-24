'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchResults {
  jobs?: Array<{
    id: string;
    slug: string;
    title: string;
    locationCity?: string | null;
    company?: { name: string };
  }>;
  internships?: Array<{
    id: string;
    slug: string;
    title: string;
    locationCity?: string | null;
    company?: { name: string };
  }>;
  companies?: Array<{ id: string; slug: string; name: string }>;
  blog?: Array<{ id: string; slug: string; title: string; excerpt?: string | null }>;
}

export function SearchResultsClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q.trim()) {
      setResults(null);
      return;
    }

    async function fetchResults() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<SearchResults>('/search', { q, type: 'all', limit: 10 });
        setResults(res.data ?? {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults(null);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [q]);

  if (!q.trim()) {
    return (
      <EmptyState
        icon={Search}
        title="Enter a search query"
        description="Search for jobs, internships, companies, and blog articles."
        actionLabel="Browse jobs"
        actionHref="/jobs"
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState title="Search failed" description={error} actionLabel="Try again" actionHref={`/search?q=${encodeURIComponent(q)}`} />
    );
  }

  const total =
    (results?.jobs?.length ?? 0) +
    (results?.internships?.length ?? 0) +
    (results?.companies?.length ?? 0) +
    (results?.blog?.length ?? 0);

  if (total === 0) {
    return (
      <EmptyState
        title={`No results for "${q}"`}
        description="Try different keywords or browse our job and internship listings."
        actionLabel="Browse jobs"
        actionHref="/jobs"
      />
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground">
        {total} result{total !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;
      </p>

      {results?.jobs && results.jobs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Jobs</h2>
          <div className="mt-4 space-y-3">
            {results.jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-4">
                  <Link href={`/jobs/${job.slug}`} className="font-medium hover:text-primary">
                    {job.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.company?.name}
                    {job.locationCity && ` · ${job.locationCity}`}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {results?.internships && results.internships.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Internships</h2>
          <div className="mt-4 space-y-3">
            {results.internships.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <Link href={`/internships/${item.slug}`} className="font-medium hover:text-primary">
                    {item.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.company?.name}
                    {item.locationCity && ` · ${item.locationCity}`}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {results?.companies && results.companies.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Companies</h2>
          <div className="mt-4 space-y-3">
            {results.companies.map((company) => (
              <Card key={company.id}>
                <CardContent className="p-4">
                  <Link
                    href={`/companies/${company.slug}`}
                    className="font-medium hover:text-primary"
                  >
                    {company.name}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {results?.blog && results.blog.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Blog</h2>
          <div className="mt-4 space-y-3">
            {results.blog.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/blog/${post.slug}`} className="font-medium hover:text-primary">
                      {post.title}
                    </Link>
                    <Badge variant="secondary">Article</Badge>
                  </div>
                  {post.excerpt && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
