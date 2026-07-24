'use client';

import { ApplyJobButton } from '@/components/career/apply-job-button';
import { SaveJobButton } from '@/components/career/save-job-button';

interface JobDetailActionsProps {
  jobId: string;
  jobSlug: string;
  applicationMethod?: 'internal' | 'external';
  externalApplyUrl?: string | null;
  careersPageUrl?: string | null;
}

export function JobDetailActions({
  jobId,
  jobSlug,
  applicationMethod,
  externalApplyUrl,
  careersPageUrl,
}: JobDetailActionsProps) {
  return (
    <div className="space-y-3">
      <ApplyJobButton
        jobId={jobId}
        jobSlug={jobSlug}
        applicationMethod={applicationMethod}
        externalApplyUrl={externalApplyUrl}
        careersPageUrl={careersPageUrl}
      />
      <SaveJobButton jobId={jobId} className="w-full" />
    </div>
  );
}
