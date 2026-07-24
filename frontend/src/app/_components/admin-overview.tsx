'use client';

import { Users, Briefcase, FileCheck, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/dashboard/data-table';

const pendingItems = [
  { id: '1', type: 'Job', title: 'Software Engineer Trainee', status: 'pending_review' },
  { id: '2', type: 'Company', title: 'New employer registration', status: 'pending_review' },
  { id: '3', type: 'Comment', title: 'Blog comment moderation', status: 'pending' },
];

export function AdminOverview() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value="—" icon={Users} trend={{ value: 8, label: 'this month' }} />
        <StatCard title="Active Listings" value="—" icon={Briefcase} />
        <StatCard title="Pending Review" value={3} icon={FileCheck} />
        <StatCard title="Flagged Content" value={0} icon={AlertTriangle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Moderation queue</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'type', header: 'Type', cell: (row) => row.type },
              { key: 'title', header: 'Item', cell: (row) => row.title },
              { key: 'status', header: 'Status', cell: (row) => row.status },
            ]}
            data={pendingItems}
            keyExtractor={(row) => row.id}
            emptyMessage="No items pending review"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform health</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Connect to <code className="rounded bg-muted px-1">/api/v1/admin/analytics</code> for live
          metrics. This dashboard shell is ready for backend integration.
        </CardContent>
      </Card>
    </div>
  );
}
