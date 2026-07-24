'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { BlogPost } from '@/types/api';
import type { FaqItem } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { BlogForm } from '@/components/admin/forms/blog-form';
import { Button } from '@/components/ui/button';

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<(BlogPost & { faq?: FaqItem[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.blog.get(id).then((res) => setItem(res.data ?? null)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !item) return <div className="text-destructive">{error ?? 'Not found'}</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="Edit Post" description={item.title}>
        {item.status === 'published' && (
          <Button variant="outline" size="sm" asChild><Link href={`/blog/${item.slug}`} target="_blank"><ExternalLink className="h-4 w-4" /> Preview</Link></Button>
        )}
      </AdminPageHeader>
      <BlogForm initial={item} onSubmit={async (data) => { await adminApi.blog.update(id, data); }} />
    </div>
  );
}
