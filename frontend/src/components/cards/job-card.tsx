import Link from 'next/link';
import { MapPin, Wifi, Clock, IndianRupee } from 'lucide-react';
import { cn, formatSalary, timeAgo } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface JobCardProps {
  title: string;
  slug: string;
  company: string;
  companySlug?: string;
  location: string;
  salary?: { min?: number | null; max?: number | null };
  skills?: string[];
  postedAt: string | Date;
  isRemote?: boolean;
  className?: string;
}

export function JobCard({
  title,
  slug,
  company,
  companySlug,
  location,
  salary,
  skills = [],
  postedAt,
  isRemote = false,
  className,
}: JobCardProps) {
  const salaryText = formatSalary(salary?.min, salary?.max);

  return (
    <Card
      className={cn(
        'group transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-ring',
        className
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/jobs/${slug}`}
              className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg"
            >
              {title}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {companySlug ? (
                <Link
                  href={`/companies/${companySlug}`}
                  className="hover:text-foreground hover:underline"
                >
                  {company}
                </Link>
              ) : (
                company
              )}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-1.5">
            {isRemote && (
              <Badge variant="success" className="gap-1">
                <Wifi className="h-3 w-3" aria-hidden />
                Remote
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {location}
          </span>
          <span className="inline-flex items-center gap-1">
            <IndianRupee className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {salaryText}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {timeAgo(postedAt)}
          </span>
        </div>

        {skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="font-normal">
                {skill}
              </Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant="outline" className="font-normal">
                +{skills.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
