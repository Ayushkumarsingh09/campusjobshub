'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Trash2 } from 'lucide-react';
import { careerApi } from '@/lib/career-api';
import type { SavedJob } from '@/types/career';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function SavedJobsList() {
  const [items, setItems] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const res = await careerApi.listSavedJobs();
    setItems(res.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    await careerApi.unsaveJob(id);
    await load();
  };

  const saveNotes = async (id: string) => {
    await careerApi.updateSavedJob(id, { notes: editingNotes[id] ?? '' });
    await load();
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Saved Jobs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bookmark jobs, add notes, and set reminders for follow-ups.
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bookmark className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
            <p className="mt-4 text-muted-foreground">No saved jobs yet.</p>
            <Button variant="brand" className="mt-4" asChild>
              <Link href="/jobs">Browse jobs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const isJob = Boolean(item.job);
            const listing = item.job ?? item.internship;
            const href = isJob ? `/jobs/${listing!.slug}` : `/internships/${listing!.slug}`;
            return (
              <Card key={item.id}>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <Link href={href} className="font-semibold hover:text-primary">
                        {listing?.title}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {listing?.company?.name}
                        {listing?.locationCity && ` · ${listing.locationCity}`}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {isJob ? 'Job' : 'Internship'}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => remove(item.id)}>
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Input
                      placeholder="Add notes..."
                      value={editingNotes[item.id] ?? item.notes ?? ''}
                      onChange={(e) =>
                        setEditingNotes((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                      className="text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={() => saveNotes(item.id)}>
                      Save note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
