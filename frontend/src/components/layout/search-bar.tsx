'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  compact?: boolean;
}

export function SearchBar({
  className,
  placeholder = 'Search jobs, internships, companies…',
  defaultValue = '',
  compact = false,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleClear() {
    setQuery('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn('relative w-full', className)}
    >
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-9 pr-20',
          compact ? 'h-9 text-sm' : 'h-10'
        )}
        aria-label="Search"
      />
      <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          type="submit"
          size={compact ? 'sm' : 'default'}
          variant="brand"
          className={compact ? 'h-7 px-3 text-xs' : 'h-8'}
        >
          Search
        </Button>
      </div>
    </form>
  );
}
