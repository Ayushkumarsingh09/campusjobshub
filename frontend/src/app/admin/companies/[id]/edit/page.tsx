'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { Company } from '@/types/api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { CompanyForm } from '@/components/admin/forms/company-form';
import { Button } from '@/components/ui/button';

export default function EditCompanyPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.companies.get(id).then((res) => setItem(res.data ?? null)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !item) return <div className="text-destructive">{error ?? 'Not found'}</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="Edit Company" description={item.name}>
        <Button variant="outline" size="sm" asChild><Link href={`/companies/${item.slug}`} target="_blank"><ExternalLink className="h-4 w-4" /> Preview</Link></Button>
      </AdminPageHeader>
      <CompanyForm initial={item} onSubmit={async (data) => { await adminApi.companies.update(id, data); }} />
    </div>
  );
}
