'use client';

import { useEffect, useState } from 'react';
import { Loader2, TrendingUp } from 'lucide-react';
import { adminApi, type AnalyticsData } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { FormSection } from '@/components/admin/form-section';

function BarChart({ data, labelKey, valueKey, maxBars = 10 }: { data: Record<string, unknown>[]; labelKey: string; valueKey: string; maxBars?: number }) {
  const items = data.slice(0, maxBars);
  const max = Math.max(...items.map((d) => Number(d[valueKey]) || 0), 1);

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const label = String(item[labelKey]);
        const value = Number(item[valueKey]) || 0;
        const pct = (value / max) * 100;
        return (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="truncate text-zinc-400">{label}</span>
              <span className="font-medium text-zinc-200">{value.toLocaleString()}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.dashboard.analytics()
      .then((res) => setData(res.data ?? null))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Analytics" description="Traffic, growth, and engagement metrics" />

      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <FormSection title="Top Jobs by Views" description="Most viewed active job listings">
          {data?.topJobs?.length ? (
            <BarChart
              data={data.topJobs.map((j) => ({ title: j.title, views: j.viewCount }))}
              labelKey="title"
              valueKey="views"
            />
          ) : (
            <p className="text-sm text-zinc-500">No data available</p>
          )}
        </FormSection>

        <FormSection title="Top Companies" description="By total job listings">
          {data?.topCompanies?.length ? (
            <BarChart
              data={data.topCompanies.map((c) => ({ name: c.name, jobs: c.jobCount }))}
              labelKey="name"
              valueKey="jobs"
            />
          ) : (
            <p className="text-sm text-zinc-500">No data available</p>
          )}
        </FormSection>

        <FormSection title="User Growth (30 days)" description="New registrations per day">
          {data?.userGrowth?.length ? (
            <BarChart data={data.userGrowth.map((g) => ({ date: g.date.slice(5), count: g.count }))} labelKey="date" valueKey="count" maxBars={15} />
          ) : (
            <p className="text-sm text-zinc-500">No growth data</p>
          )}
        </FormSection>

        <FormSection title="Search Trends" description="Popular search terms (from view data)">
          {data?.searchPlaceholders?.length ? (
            <BarChart data={data.searchPlaceholders.map((s) => ({ term: s.term, views: s.viewCount }))} labelKey="term" valueKey="views" />
          ) : (
            <p className="text-sm text-zinc-500">No search data</p>
          )}
        </FormSection>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <TrendingUp className="h-4 w-4" />
        Data refreshes on page load from /admin/dashboard/analytics
      </div>
    </div>
  );
}
