'use client';

import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { CompanyForm } from '@/components/admin/forms/company-form';

export default function NewCompanyPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="New Company" />
      <CompanyForm onSubmit={async (data) => {
        const res = await adminApi.companies.create(data as Parameters<typeof adminApi.companies.create>[0]);
        if (res.data) router.push(`/admin/companies/${res.data.id}/edit`);
      }} />
    </div>
  );
}
