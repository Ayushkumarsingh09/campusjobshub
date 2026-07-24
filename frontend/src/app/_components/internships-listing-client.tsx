'use client';



import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Loader2 } from 'lucide-react';

import { api } from '@/lib/api';

import type { Internship } from '@/types/api';

import { InternshipCard } from '@/components/cards/internship-card';

import { FilterSidebar, type FilterValues } from '@/components/shared/filters';

import { Pagination } from '@/components/shared/pagination';

import { EmptyState } from '@/components/shared/empty-state';
import { FALLBACK_INTERNSHIPS } from '@/lib/static-fallback-data';



interface InternshipsListingClientProps {

  basePath?: string;

  initialFilters?: Partial<FilterValues>;

  fixedParams?: Record<string, string | number | boolean>;

  initialInternships?: Internship[];

}



const EMPTY_FIXED_PARAMS: Record<string, string | number | boolean> = {};



function formatLocation(item: Internship): string {

  if (item.isRemote) return 'Remote';

  const parts = [item.locationCity, item.locationState].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : 'India';

}



function formatDuration(months?: number | null): string {

  if (!months) return 'Flexible';

  return `${months} month${months !== 1 ? 's' : ''}`;

}



export function InternshipsListingClient({

  basePath = '/internships',

  initialFilters,

  fixedParams,

  initialInternships,

}: InternshipsListingClientProps) {

  const [internships, setInternships] = useState<Internship[]>(initialInternships ?? []);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(!initialInternships?.length);

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



  const filterCity = filters.cities.length === 1 ? filters.cities[0] : '';

  const filterRemote = filters.remote;

  const filterExperienceKey = filters.experience.join(',');

  const filterCitiesKey = filters.cities.join(',');



  const requestIdRef = useRef(0);



  const fetchInternships = useCallback(async () => {

    const requestId = ++requestIdRef.current;

    setLoading(true);

    setError(null);



    try {

      const params: Record<string, string | number | boolean | undefined> = {

        page,

        limit: 12,

        ...staticParams,

      };



      if (filterRemote) params.remote = true;

      if (filterCity) params.city = filterCity;



      const res = await api.get<Internship[]>('/internships', params);



      if (requestId !== requestIdRef.current) return;



      setInternships(res.data ?? []);

      setTotalPages(res.meta?.totalPages ?? 1);

    } catch (err) {

      if (requestId !== requestIdRef.current) return;



      if (initialInternships?.length && page === 1 && !filterRemote && !filterCity && !filterExperienceKey) {
        setInternships(initialInternships);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load internships');
        setInternships(
          page === 1 && !filterRemote && !filterCity && !filterExperienceKey
            ? FALLBACK_INTERNSHIPS
            : []
        );
      }

    } finally {

      if (requestId === requestIdRef.current) {

        setLoading(false);

      }

    }

  }, [page, staticParams, filterRemote, filterCity, filterExperienceKey, filterCitiesKey]);



  useEffect(() => {

    fetchInternships();

  }, [fetchInternships]);



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

            title="Could not load internships"

            description={error}

            actionLabel="Try again"

            onAction={fetchInternships}

          />

        ) : internships.length === 0 ? (

          <EmptyState

            title="No internships found"

            description="Try adjusting your filters or check back later."

            actionLabel="Clear filters"

            onAction={() => handleFilterChange({ cities: [], remote: false, experience: [] })}

          />

        ) : (

          <>

            <div className="grid gap-4 sm:grid-cols-2">

              {internships.map((item) => (

                <InternshipCard

                  key={item.id}

                  title={item.title}

                  slug={item.slug}

                  company={item.company?.name ?? 'Company'}

                  companySlug={item.company?.slug}

                  location={formatLocation(item)}

                  stipend={{ min: item.stipendMin, max: item.stipendMax }}

                  duration={formatDuration(item.durationMonths)}

                  ppo={item.ppoAvailable}

                  skills={item.skills}

                  postedAt={item.publishedAt ?? item.createdAt}

                  isRemote={item.isRemote}

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


