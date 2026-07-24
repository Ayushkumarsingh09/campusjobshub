'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Loader2, Send } from 'lucide-react';
import { useSession } from '@/components/providers/session-provider';
import { careerApi } from '@/lib/career-api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Resume } from '@/types/career';

interface ApplyJobButtonProps {
  jobId?: string;
  internshipId?: string;
  applicationMethod?: 'internal' | 'external';
  externalApplyUrl?: string | null;
  careersPageUrl?: string | null;
  jobSlug: string;
}

function resolveExternalUrl(externalApplyUrl?: string | null, careersPageUrl?: string | null): string | null {
  const url = externalApplyUrl?.trim() || careersPageUrl?.trim();
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
}

export function ApplyJobButton({
  jobId,
  internshipId,
  applicationMethod = 'internal',
  externalApplyUrl,
  careersPageUrl,
  jobSlug,
}: ApplyJobButtonProps) {
  const { isAuthenticated } = useSession();
  const [open, setOpen] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeId, setResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const externalUrl = resolveExternalUrl(externalApplyUrl, careersPageUrl);
  if ((applicationMethod === 'external' || externalUrl) && externalUrl) {
    return (
      <Button variant="brand" className="w-full gap-2" asChild>
        <a href={externalUrl} target="_blank" rel="noopener noreferrer">
          Apply on company site
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </Button>
    );
  }

  const openDialog = async () => {
    if (!isAuthenticated) {
      window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(`/jobs/${jobSlug}`)}`;
      return;
    }
    const res = await careerApi.listResumes();
    const list = res.data ?? [];
    setResumes(list);
    const primary = list.find((r) => r.isPrimary) ?? list[0];
    setResumeId(primary?.id ?? '');
    setOpen(true);
  };

  const submit = async () => {
    if (!resumeId) return;
    setLoading(true);
    try {
      await careerApi.createApplication({
        jobId,
        internshipId,
        resumeId,
        coverLetter: coverLetter || undefined,
        notes: notes || undefined,
      });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="brand" className="w-full gap-2" onClick={openDialog}>
        <Send className="h-4 w-4" aria-hidden />
        Apply now
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit application</DialogTitle>
            <DialogDescription>
              Your resume and cover letter will be shared with the employer.
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="py-6 text-center space-y-4">
              <p className="text-muted-foreground">Application submitted successfully.</p>
              <Button variant="brand" asChild>
                <Link href="/dashboard/applications">View in tracker</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resume-select">Resume</Label>
                <select
                  id="resume-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
                {!resumes.length && (
                  <p className="text-xs text-muted-foreground">
                    <Link href="/resume/builder" className="text-primary hover:underline">
                      Create a resume
                    </Link>{' '}
                    before applying.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Cover letter (optional)</Label>
                <Textarea id="cover" rows={4} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Private notes</Label>
                <Textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Only visible to you in the tracker" />
              </div>
              <Button variant="brand" className="w-full" onClick={submit} disabled={loading || !resumeId}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : 'Submit application'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
