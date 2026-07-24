'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  FileText,
  GraduationCap,
  Mail,
  Users,
} from 'lucide-react';
import { adminApi, type DashboardStats } from '@/lib/admin-api';
import { StatsGrid } from '@/components/admin/stats-grid';
import { DataTableAdmin } from '@/components/admin/data-table-admin';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/admin/form-section';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.dashboard
      .get()
      .then((res) => setStats(res.data ?? null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const statItems = stats
    ? [
        { title: 'Total Users', value: stats.users, icon: Users },
        { title: 'Active Jobs', value: stats.jobs.active, icon: Briefcase, description: `${stats.jobs.draft} drafts` },
        { title: 'Internships', value: stats.internships, icon: GraduationCap },
        { title: 'Companies', value: stats.companies, icon: Building2 },
        { title: 'Blog Posts', value: stats.blogPosts, icon: FileText },
        { title: 'Subscribers', value: stats.newsletterSubscribers, icon: Mail },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Dashboard</h1>
          <p className="text-sm text-zinc-400">Platform overview and recent activity</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/analytics">View Analytics</Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <StatsGrid stats={statItems} loading={loading} />

      <FormSection title="Recent Activity" description="Latest audit log entries">
        <DataTableAdmin
          columns={[
            {
              key: 'action',
              header: 'Action',
              cell: (row) => row.action,
              sortable: true,
              sortValue: (row) => row.action,
            },
            {
              key: 'entity',
              header: 'Entity',
              cell: (row) => `${row.entityType}${row.entityId ? ` · ${row.entityId.slice(0, 8)}` : ''}`,
            },
            {
              key: 'actor',
              header: 'Actor',
              cell: (row) => row.actor?.name ?? 'System',
            },
            {
              key: 'date',
              header: 'When',
              cell: (row) => new Date(row.createdAt).toLocaleString(),
              sortable: true,
              sortValue: (row) => row.createdAt,
            },
          ]}
          data={stats?.recentAuditLogs ?? []}
          keyExtractor={(row) => row.id}
          loading={loading}
          emptyMessage="No recent activity"
        />
      </FormSection>
    </div>
  );
}
