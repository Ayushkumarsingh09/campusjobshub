'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import type { Company } from '@/types/api';
import { CompanyCard } from '@/components/cards/company-card';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/empty-state';
import { FALLBACK_COMPANIES } from '@/lib/static-fallback-data';

interface CompaniesListingClientProps {
  initialCompanies?: Company[];
}

export function CompaniesListingClient({ initialCompanies }: CompaniesListingClientProps) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies ?? []);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(!initialCompanies?.length);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Company[]>('/companies', { page, limit: 12 });
      setCompanies(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      if (initialCompanies?.length && page === 1) {
        setCompanies(initialCompanies);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load companies');
        setCompanies(page === 1 ? FALLBACK_COMPANIES.slice(0, 12) : []);
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Could not load companies"
        description={error}
        actionLabel="Try again"
        onAction={fetchCompanies}
      />
    );
  }

  if (companies.length === 0) {
    return (
      <EmptyState
        title="No companies found"
        description="Check back soon as new employers join the platform."
        actionLabel="Browse jobs"
        actionHref="/jobs"
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            name={company.name}
            slug={company.slug}
            logoUrl={company.logoUrl}
            industry={company.industry}
            location={[company.headquartersCity, company.headquartersState]
              .filter(Boolean)
              .join(', ') || null}
            openJobsCount={company.jobCount}
            openInternshipsCount={company.internshipCount}
            isHiring={company.jobCount + company.internshipCount > 0}
          />
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/companies"
        onPageChange={setPage}
        className="mt-8"
      />
    </>
  );
}
