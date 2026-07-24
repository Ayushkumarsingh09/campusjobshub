'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi, type AdminUser } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { DataTableAdmin } from '@/components/admin/data-table-admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ROLE_LABELS, type UserRole } from '@/config/roles';
import { useSession } from '@/components/providers/session-provider';
import { canManageUsers } from '@/config/permissions';

const ASSIGNABLE_ROLES: UserRole[] = ['student', 'employer', 'author', 'editor', 'admin', 'super_admin'];

export default function AdminUsersPage() {
  const { user: sessionUser } = useSession();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const canManage = sessionUser ? canManageUsers(sessionUser.role) : false;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.users.list({ page, limit: 20, search: search || undefined });
      setItems(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  async function updateUser(id: string, patch: { role?: UserRole; isActive?: boolean }) {
    try {
      await adminApi.users.update(id, patch);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Users" description="Manage user accounts and roles" />
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      <Input placeholder="Search users…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="sm:max-w-xs" />
      <DataTableAdmin
        columns={[
          { key: 'name', header: 'Name', cell: (r) => r.name, sortable: true, sortValue: (r) => r.name },
          { key: 'email', header: 'Email', cell: (r) => r.email },
          {
            key: 'role',
            header: 'Role',
            cell: (r) => canManage ? (
              <Select value={r.role} onValueChange={(v) => updateUser(r.id, { role: v as UserRole })}>
                <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_ROLES.filter((role) => sessionUser?.role === 'super_admin' || (role !== 'super_admin' && role !== 'admin')).map((role) => (
                    <SelectItem key={role} value={role}>{ROLE_LABELS[role]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : <Badge variant="outline">{ROLE_LABELS[r.role]}</Badge>,
          },
          {
            key: 'status',
            header: 'Status',
            cell: (r) => (
              <Button
                variant="ghost"
                size="sm"
                disabled={!canManage || r.id === sessionUser?.id}
                onClick={() => updateUser(r.id, { isActive: !r.isActive })}
                className={r.isActive ? 'text-emerald-400' : 'text-zinc-500'}
              >
                {r.isActive ? 'Active' : 'Inactive'}
              </Button>
            ),
          },
          { key: 'joined', header: 'Joined', cell: (r) => new Date(r.createdAt).toLocaleDateString() },
        ]}
        data={items}
        keyExtractor={(r) => r.id}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No users found"
      />
    </div>
  );
}
