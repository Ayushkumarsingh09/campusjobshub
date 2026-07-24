'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import type { Job } from '@/types/api';
import { JobCard } from '@/components/cards/job-card';
import { FilterSidebar, type FilterValues } from '@/components/shared/filters';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/empty-state';

interface JobsListingClientProps {
  basePath?: string;
  initialFilters?: Partial<FilterValues> & {
    experienceMin?: number;
    search?: string;
  };
  fixedParams?: Record<string, string | number | boolean>;
}

/** Stable empty object — never use `fixedParams = {}` as a default (new ref every render). */
const EMPTY_FIXED_PARAMS: Record<string, string | number | boolean> = {};

function formatLocation(job: Job): string {
  if (job.isRemote) return 'Remote';
  const parts = [job.locationCity, job.locationState].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'India';
}

function buildQueryParams(
  page: number,
  fixedParams: Record<string, string | number | boolean>,
  filters: FilterValues,
  experienceMin?: number,
  search?: string
): Record<string, string | number | boolean | undefined> {
  const params: Record<string, string | number | boolean | undefined> = {
    page,
    limit: 12,
    ...fixedParams,
  };

  if (filters.remote) params.remote = true;
  if (filters.cities.length === 1) params.city = filters.cities[0];
  if (filters.experience.includes('fresher')) params.experienceMin = 0;
  if (experienceMin !== undefined) params.experienceMin = experienceMin;
  if (search) params.search = search;

  return params;
}

export function JobsListingClient({
  basePath = '/jobs',
  initialFilters,
  fixedParams,
}: JobsListingClientProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>(() => ({
    cities: initialFilters?.cities ?? [],
    remote: initialFilters?.remote ?? false,
    experience: initialFilters?.experience ?? [],
  }));

  const resolvedFixedParams = fixedParams ?? EMPTY_FIXED_PARAMS;
  const fixedParamsKey = useMemo(
    () => JSON.stringify(resolvedFixedParams),
    [resolvedFixedParams]
  );
  const staticParams = useMemo(
    () => ({ ...resolvedFixedParams }),
    [fixedParamsKey]
  );

  const experienceMin = initialFilters?.experienceMin;
  const searchQuery = initialFilters?.search;

  const filterCity = filters.cities.length === 1 ? filters.cities[0] : '';
  const filterRemote = filters.remote;
  const filterFresher = filters.experience.includes('fresher');
  const filterExperienceKey = filters.experience.join(',');
  const filterCitiesKey = filters.cities.join(',');

  const requestIdRef = useRef(0);

  const fetchJobs = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    const activeFilters: FilterValues = {
      cities: filterCitiesKey ? filterCitiesKey.split(',') : [],
      remote: filterRemote,
      experience: filterExperienceKey ? filterExperienceKey.split(',') : [],
    };

    try {
      const params = buildQueryParams(page, staticParams, activeFilters, experienceMin, searchQuery);
      const res = await api.get<Job[]>('/jobs', params);

      if (requestId !== requestIdRef.current) return;

      setJobs(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      setError(err instanceof Error ? err.message : 'Failed to load jobs');
      setJobs([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    page,
    staticParams,
    filterRemote,
    filterCity,
    filterFresher,
    filterExperienceKey,
    filterCitiesKey,
    experienceMin,
    searchQuery,
  ]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = useCallback((next: FilterValues) => {
    setFilters(next);
    setPage(1);
  }, []);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <FilterSidebar values={filters} onChange={handleFilterChange} />

      <div className="min-w-0 flex-1">
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
          </div>
        ) : error ? (
          <EmptyState
            title="Could not load jobs"
            description={error}
            actionLabel="Try again"
            onAction={fetchJobs}
          />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No jobs found"
            description="Try adjusting your filters or check back later for new openings."
            actionLabel="Clear filters"
            onAction={() => handleFilterChange({ cities: [], remote: false, experience: [] })}
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.title}
                  slug={job.slug}
                  company={job.company?.name ?? 'Company'}
                  companySlug={job.company?.slug}
                  location={formatLocation(job)}
                  salary={{ min: job.salaryMin, max: job.salaryMax }}
                  skills={job.skills}
                  postedAt={job.publishedAt ?? job.createdAt}
                  isRemote={job.isRemote}
                />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath={basePath}
              onPageChange={setPage}
              className="mt-8"
            />
          </>
        )}
      </div>
    </div>
  );
}
