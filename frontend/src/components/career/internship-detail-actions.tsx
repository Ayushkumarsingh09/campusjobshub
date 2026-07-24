'use client';

import { ApplyJobButton } from '@/components/career/apply-job-button';
import { SaveJobButton } from '@/components/career/save-job-button';

interface InternshipDetailActionsProps {
  internshipId: string;
  slug: string;
  applicationMethod?: 'internal' | 'external';
  externalApplyUrl?: string | null;
  careersPageUrl?: string | null;
}

export function InternshipDetailActions({
  internshipId,
  slug,
  applicationMethod,
  externalApplyUrl,
  careersPageUrl,
}: InternshipDetailActionsProps) {
  return (
    <div className="space-y-3">
      <ApplyJobButton
        internshipId={internshipId}
        jobSlug={slug}
        applicationMethod={applicationMethod}
        externalApplyUrl={externalApplyUrl}
        careersPageUrl={careersPageUrl}
      />
      <SaveJobButton internshipId={internshipId} className="w-full" />
    </div>
  );
}
