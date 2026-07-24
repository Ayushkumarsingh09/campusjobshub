import Link from 'next/link';
import { MapPin, Clock, Calendar, Award } from 'lucide-react';
import { cn, formatStipend, timeAgo } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface InternshipCardProps {
  title: string;
  slug: string;
  company: string;
  companySlug?: string;
  location: string;
  stipend?: { min?: number | null; max?: number | null };
  duration: string;
  ppo?: boolean;
  skills?: string[];
  postedAt: string | Date;
  isRemote?: boolean;
  className?: string;
}

export function InternshipCard({
  title,
  slug,
  company,
  companySlug,
  location,
  stipend,
  duration,
  ppo = false,
  skills = [],
  postedAt,
  isRemote = false,
  className,
}: InternshipCardProps) {
  const stipendText = formatStipend(stipend?.min, stipend?.max);

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
              href={`/internships/${slug}`}
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
            {ppo && (
              <Badge variant="warning" className="gap-1">
                <Award className="h-3 w-3" aria-hidden />
                PPO
              </Badge>
            )}
            {isRemote && <Badge variant="success">Remote</Badge>}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {location}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            {stipendText}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {timeAgo(postedAt)}
          </span>
        </div>

        {skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="font-normal">
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="outline" className="font-normal">
                +{skills.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
