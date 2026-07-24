import Link from 'next/link';
import { MapPin, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CompanyLogo } from '@/components/shared/company-logo';

export interface CompanyCardProps {
  name: string;
  slug: string;
  logoUrl?: string | null;
  industry?: string | null;
  location?: string | null;
  openJobsCount?: number;
  openInternshipsCount?: number;
  isHiring?: boolean;
  className?: string;
}

export function CompanyCard({
  name,
  slug,
  logoUrl,
  industry,
  location,
  openJobsCount = 0,
  openInternshipsCount = 0,
  isHiring = false,
  className,
}: CompanyCardProps) {
  const totalOpenings = openJobsCount + openInternshipsCount;

  return (
    <Card
      className={cn(
        'group transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-ring',
        className
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <Link href={`/companies/${slug}`} className="flex items-start gap-4">
          <CompanyLogo name={name} slug={slug} logoUrl={logoUrl} size={48} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold transition-colors group-hover:text-primary sm:text-lg">
                {name}
              </h3>
              {isHiring && <Badge variant="success">Hiring</Badge>}
            </div>

            {industry && (
              <p className="mt-0.5 text-sm text-muted-foreground">{industry}</p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {location}
                </span>
              )}
              {totalOpenings > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {openJobsCount > 0 && `${openJobsCount} job${openJobsCount !== 1 ? 's' : ''}`}
                  {openJobsCount > 0 && openInternshipsCount > 0 && ' · '}
                  {openInternshipsCount > 0 &&
                    `${openInternshipsCount} internship${openInternshipsCount !== 1 ? 's' : ''}`}
                </span>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
