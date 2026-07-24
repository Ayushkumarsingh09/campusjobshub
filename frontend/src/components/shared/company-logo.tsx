'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { companyLogoPath } from '@/lib/images/company-logos';

interface CompanyLogoProps {
  name: string;
  slug?: string;
  logoUrl?: string | null;
  size?: number;
  className?: string;
}

export function CompanyLogo({
  name,
  slug,
  logoUrl,
  size = 64,
  className,
}: CompanyLogoProps) {
  const localFallback = slug ? companyLogoPath(slug) : null;
  const initialSrc = localFallback || logoUrl?.trim() || '';
  const [src, setSrc] = useState(initialSrc);
  const [failed, setFailed] = useState(!initialSrc);

  if (failed || !src) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground',
          className
        )}
        style={{ width: size, height: size }}
        aria-label={`${name} logo`}
      >
        <Building2 style={{ width: size * 0.45, height: size * 0.45 }} aria-hidden />
      </div>
    );
  }

  return (
    <div
      className={cn('relative shrink-0 overflow-hidden rounded-lg border bg-white', className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={`${name} logo`}
        title={`${name}`}
        fill
        className="object-contain p-1.5"
        sizes={`${size}px`}
        loading="lazy"
        onError={() => {
          if (localFallback && src !== localFallback) {
            setSrc(localFallback);
          } else {
            setFailed(true);
          }
        }}
      />
    </div>
  );
}
