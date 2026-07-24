'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { InterviewQuestion } from '@/types/api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { DataTableAdmin } from '@/components/admin/data-table-admin';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function AdminInterviewQuestionsPage() {
  const [items, setItems] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.interviewQuestions.list({
        page,
        limit: 20,
        topic: topic || undefined,
        difficulty: difficulty === 'all' ? undefined : difficulty,
      });
      setItems(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [page, topic, difficulty]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Interview Questions" description="Manage interview prep Q&A" actionLabel="New Question" actionHref="/admin/interview-questions/new" />
      {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Filter by topic…" value={topic} onChange={(e) => { setTopic(e.target.value); setPage(1); }} className="sm:max-w-xs" />
        <Select value={difficulty} onValueChange={(v) => { setDifficulty(v); setPage(1); }}>
          <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTableAdmin
        columns={[
          { key: 'question', header: 'Question', cell: (r) => <span className="line-clamp-2 max-w-md">{r.question}</span> },
          { key: 'topic', header: 'Topic', cell: (r) => r.topic ?? '—' },
          { key: 'difficulty', header: 'Difficulty', cell: (r) => <Badge variant="outline" className="capitalize">{r.difficulty}</Badge> },
          { key: 'views', header: 'Views', cell: (r) => r.viewCount },
          { key: 'actions', header: '', cell: (r) => (
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" asChild><Link href={`/admin/interview-questions/${r.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          )},
        ]}
        data={items}
        keyExtractor={(r) => r.id}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No questions found"
      />
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete question?" description="This will permanently delete the question." onConfirm={async () => { if (deleteId) { await adminApi.interviewQuestions.delete(deleteId); setDeleteId(null); load(); } }} />
    </div>
  );
}
