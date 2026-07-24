'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, BellOff, Building2, Trash2 } from 'lucide-react';
import { CompanyLogo } from '@/components/shared/company-logo';
import { careerApi } from '@/lib/career-api';
import type { SavedCompany } from '@/types/career';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function SavedCompaniesList() {
  const [items, setItems] = useState<SavedCompany[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await careerApi.listSavedCompanies();
    setItems(res.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleAlerts = async (item: SavedCompany) => {
    await careerApi.updateSavedCompany(item.id, { alertEnabled: !item.alertEnabled });
    await load();
  };

  const remove = async (id: string) => {
    await careerApi.unsaveCompany(id);
    await load();
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Saved Companies</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Follow companies for hiring alerts and watchlist updates.
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
            <p className="mt-4 text-muted-foreground">No companies in your watchlist.</p>
            <Button variant="brand" className="mt-4" asChild>
              <Link href="/companies">Explore companies</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <CompanyLogo
                    name={item.company.name}
                    slug={item.company.slug}
                    logoUrl={item.company.logoUrl}
                    size={48}
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/companies/${item.company.slug}`}
                      className="font-semibold hover:text-primary"
                    >
                      {item.company.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.company.jobCount} jobs · {item.company.internshipCount} internships
                    </p>
                    {item.company.isVerified && (
                      <Badge variant="secondary" className="mt-2">Verified</Badge>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAlerts(item)}
                    className="gap-2"
                  >
                    {item.alertEnabled ? (
                      <Bell className="h-4 w-4" aria-hidden />
                    ) : (
                      <BellOff className="h-4 w-4" aria-hidden />
                    )}
                    {item.alertEnabled ? 'Alerts on' : 'Alerts off'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(item.id)}>
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
