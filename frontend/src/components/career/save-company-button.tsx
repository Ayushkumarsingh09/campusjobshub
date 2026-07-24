'use client';

import { useEffect, useState } from 'react';
import { Building2, Loader2 } from 'lucide-react';
import { useSession } from '@/components/providers/session-provider';
import { careerApi } from '@/lib/career-api';
import { Button } from '@/components/ui/button';

interface SaveCompanyButtonProps {
  companyId: string;
}

export function SaveCompanyButton({ companyId }: SaveCompanyButtonProps) {
  const { isAuthenticated } = useSession();
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    careerApi.checkSavedCompany(companyId).then((res) => {
      setSaved(res.data?.saved ?? false);
      setSavedId(res.data?.savedCompanyId ?? null);
    });
  }, [isAuthenticated, companyId]);

  const toggle = async () => {
    if (!isAuthenticated) {
      window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    setLoading(true);
    try {
      if (saved && savedId) {
        await careerApi.unsaveCompany(savedId);
        setSaved(false);
      } else {
        await careerApi.saveCompany({ companyId });
        setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={toggle} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Building2 className="h-4 w-4" aria-hidden />}
      {saved ? 'Following' : 'Follow company'}
    </Button>
  );
}
