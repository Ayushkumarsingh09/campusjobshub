'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import type { InterviewQuestion } from '@/types/api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { InterviewForm } from '@/components/admin/forms/interview-form';

export default function EditInterviewQuestionPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<InterviewQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.interviewQuestions.get(id).then((res) => setItem(res.data ?? null)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !item) return <div className="text-destructive">{error ?? 'Not found'}</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="Edit Question" description={item.question.slice(0, 80)} />
      <InterviewForm initial={item} onSubmit={async (data) => { await adminApi.interviewQuestions.update(id, data); }} />
    </div>
  );
}
