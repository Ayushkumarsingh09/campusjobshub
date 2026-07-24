'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { careerApi } from '@/lib/career-api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmployerCompanyPage() {
  const [companies, setCompanies] = useState<Array<{ id: string; name: string; slug: string; _count: { jobs: number; internships: number } }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerApi.getEmployerCompanies().then((res) => {
      setCompanies((res.data as typeof companies) ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <Skeleton className="h-48" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Company Profiles</h1>
      {companies.map((c) => (
        <Card key={c.id}>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-muted-foreground">
                {c._count.jobs} jobs · {c._count.internships} internships
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/companies/${c.slug}`}>View public profile</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/companies/${c.id}/edit`}>Edit</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {!companies.length && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No company linked. Contact admin to claim your company profile.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
