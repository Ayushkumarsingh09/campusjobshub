'use client';

import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { BlogForm } from '@/components/admin/forms/blog-form';

export default function NewBlogPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="New Blog Post" />
      <BlogForm onSubmit={async (data) => {
        const res = await adminApi.blog.create(data);
        if (res.data) router.push(`/admin/blog/${res.data.id}/edit`);
      }} />
    </div>
  );
}
