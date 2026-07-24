'use client';

import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { InterviewForm } from '@/components/admin/forms/interview-form';

export default function NewInterviewQuestionPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="New Interview Question" />
      <InterviewForm onSubmit={async (data) => {
        const res = await adminApi.interviewQuestions.create(data as Parameters<typeof adminApi.interviewQuestions.create>[0]);
        if (res.data) router.push(`/admin/interview-questions/${res.data.id}/edit`);
      }} />
    </div>
  );
}
