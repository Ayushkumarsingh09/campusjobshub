'use client';

import { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { useSession } from '@/components/providers/session-provider';
import { careerApi } from '@/lib/career-api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SaveJobButtonProps {
  jobId?: string;
  internshipId?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function SaveJobButton({ jobId, internshipId, className, variant = 'outline' }: SaveJobButtonProps) {
  const { isAuthenticated } = useSession();
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    careerApi
      .checkSavedJob({ jobId, internshipId })
      .then((res) => {
        setSaved(res.data?.saved ?? false);
        setSavedId(res.data?.savedJobId ?? null);
      })
      .catch(() => {});
  }, [isAuthenticated, jobId, internshipId]);

  const toggle = async () => {
    if (!isAuthenticated) {
      window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    setLoading(true);
    try {
      if (saved && savedId) {
        await careerApi.unsaveJob(savedId);
        setSaved(false);
        setSavedId(null);
      } else {
        const res = await careerApi.saveJob({ jobId, internshipId });
        setSaved(true);
        setSavedId(res.data?.id ?? null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      className={cn('gap-2', className)}
      onClick={toggle}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : saved ? (
        <BookmarkCheck className="h-4 w-4" aria-hidden />
      ) : (
        <Bookmark className="h-4 w-4" aria-hidden />
      )}
      {saved ? 'Saved' : 'Save'}
    </Button>
  );
}
