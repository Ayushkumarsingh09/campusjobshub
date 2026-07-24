'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContentImageProps } from '@/lib/images/types';
import { getStockImage } from '@/lib/images/catalog';

const aspectClasses = {
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '21/9': 'aspect-[21/9]',
};

export function ContentImage({
  src,
  alt,
  title,
  width = 1200,
  height = 675,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
  aspectRatio = '16/9',
  caption,
  fallbackCategory = 'blog-general',
}: ContentImageProps) {
  const fallback = getStockImage(fallbackCategory);
  const primarySrc = src?.trim() || fallback.src;
  const [stage, setStage] = useState<'primary' | 'fallback' | 'failed'>(
    primarySrc === fallback.src ? 'fallback' : 'primary'
  );

  const displaySrc =
    stage === 'primary' ? primarySrc : stage === 'fallback' ? fallback.src : '';
  const displayAlt = alt || fallback.alt;
  const displayTitle = title || fallback.title;

  return (
    <figure className={cn('overflow-hidden', className)}>
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-lg bg-muted',
          aspectClasses[aspectRatio]
        )}
      >
        {stage === 'failed' || !displaySrc ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="h-10 w-10 opacity-40" aria-hidden />
            <span className="text-xs">Image unavailable</span>
          </div>
        ) : (
          <Image
            key={displaySrc}
            src={displaySrc}
            alt={displayAlt}
            title={displayTitle}
            fill
            className="object-cover"
            sizes={sizes}
            loading={priority ? undefined : 'lazy'}
            priority={priority}
            onError={() => {
              setStage((current) => {
                if (current === 'primary') return 'fallback';
                if (current === 'fallback') return 'failed';
                return 'failed';
              });
            }}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>
      )}
      {/* Intrinsic dimensions for SEO / CLS — hidden */}
      <span className="sr-only" aria-hidden>
        {width}x{height}
      </span>
    </figure>
  );
}
