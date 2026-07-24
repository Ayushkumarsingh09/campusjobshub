'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, History, Loader2, ScanSearch, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { careerApi } from '@/lib/career-api';
import { cn } from '@/lib/utils';
import type { AtsScanResult, Resume } from '@/types/career';

interface AtsHistoryItem {
  id: string;
  overallScore: number;
  keywordScore?: number | null;
  formattingScore?: number | null;
  matchDetails: AtsScanResult['matchDetails'];
  suggestions: string[];
  createdAt: string;
  resume?: { id: string; title: string } | null;
  job?: { id: string; title: string; slug: string } | null;
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn('text-3xl font-bold', scoreColor(score))}>{score}</p>
    </div>
  );
}

export function AtsCheckerApp() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeId, setResumeId] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AtsScanResult | null>(null);
  const [history, setHistory] = useState<AtsHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [resumesRes, historyRes] = await Promise.all([
        careerApi.listResumes(),
        careerApi.getAtsHistory(),
      ]);
      const list = resumesRes.data ?? [];
      setResumes(list);
      if (list.length > 0) {
        setResumeId(list.find((r) => r.isPrimary)?.id ?? list[0].id);
      }
      setHistory((historyRes.data as AtsHistoryItem[] | undefined) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleScan() {
    if (!jobDescription.trim()) return;
    setScanning(true);
    setError(null);
    try {
      const res = await careerApi.scanAts({
        resumeId: resumeId || undefined,
        jobDescription,
      });
      const scan = res.data!;
      setResult(scan);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setScanning(false);
    }
  }

  function loadHistoryItem(item: AtsHistoryItem) {
    setResult({
      overallScore: item.overallScore,
      keywordScore: item.keywordScore ?? 0,
      formattingScore: item.formattingScore ?? 0,
      matchDetails: item.matchDetails,
      suggestions: Array.isArray(item.suggestions) ? item.suggestions : [],
      improvementPlan: Array.isArray(item.suggestions) ? item.suggestions.slice(0, 5) : [],
      reportId: item.id,
      createdAt: item.createdAt,
    });
    if (item.resume?.id) setResumeId(item.resume.id);
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        Loading ATS checker…
      </div>
    );
  }

  const sectionEntries = result
    ? Object.entries(result.matchDetails.sectionAnalysis ?? {})
    : [];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select resume</CardTitle>
          </CardHeader>
          <CardContent>
            {resumes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No resumes found.{' '}
                <a href="/resume/builder" className="text-brand-600 underline">
                  Create one in the builder
                </a>{' '}
                first.
              </p>
            ) : (
              <Select value={resumeId} onValueChange={setResumeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job description</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="jd-text" className="sr-only">
              Job description
            </Label>
            <Textarea
              id="jd-text"
              rows={10}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description you are applying for…"
            />
          </CardContent>
        </Card>

        <Button
          variant="brand"
          onClick={handleScan}
          disabled={scanning || !jobDescription.trim() || resumes.length === 0}
        >
          {scanning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ScanSearch className="h-4 w-4" />
          )}
          Run ATS scan
        </Button>

        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-5 w-5" />
                Scan history
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="max-h-48 space-y-2 overflow-y-auto">
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => loadHistoryItem(item)}
                      className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
                    >
                      <span className="truncate">
                        {item.resume?.title ?? 'Resume'} ·{' '}
                        {new Date(item.createdAt).toLocaleDateString('en-IN')}
                      </span>
                      <Badge variant={item.overallScore >= 70 ? 'success' : 'warning'}>
                        {item.overallScore}
                      </Badge>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="lg:sticky lg:top-24 lg:self-start">
        <CardHeader>
          <CardTitle className="text-lg">ATS Report</CardTitle>
        </CardHeader>
        <CardContent>
          {!result ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center text-muted-foreground">
              <ScanSearch className="h-12 w-12 opacity-40" />
              <p className="mt-4 max-w-sm text-sm">
                Select a resume, paste a job description, and run a scan to see your ATS
                compatibility score.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg border bg-muted/20 p-6">
                <p className="text-center text-sm text-muted-foreground">Overall ATS Score</p>
                <p className={cn('text-center text-5xl font-bold', scoreColor(result.overallScore))}>
                  {result.overallScore}
                </p>
                <p className="text-center text-sm text-muted-foreground">out of 100</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <ScoreRing score={result.keywordScore} label="Keywords" />
                  <ScoreRing score={result.formattingScore} label="Formatting" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                <div className="rounded border p-2 text-center">
                  <p className="font-medium text-foreground">{result.matchDetails.wordCount}</p>
                  <p>Words</p>
                </div>
                <div className="rounded border p-2 text-center">
                  {result.matchDetails.hasContactInfo ? (
                    <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" />
                  ) : (
                    <XCircle className="mx-auto h-4 w-4 text-red-500" />
                  )}
                  <p>Contact</p>
                </div>
                <div className="rounded border p-2 text-center">
                  {result.matchDetails.hasEducation ? (
                    <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" />
                  ) : (
                    <XCircle className="mx-auto h-4 w-4 text-red-500" />
                  )}
                  <p>Education</p>
                </div>
                <div className="rounded border p-2 text-center">
                  {result.matchDetails.hasExperience ? (
                    <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" />
                  ) : (
                    <XCircle className="mx-auto h-4 w-4 text-red-500" />
                  )}
                  <p>Experience</p>
                </div>
              </div>

              {result.matchDetails.matchedKeywords.length > 0 && (
                <div>
                  <Label>Matched keywords</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.matchDetails.matchedKeywords.map((kw) => (
                      <Badge key={kw} variant="success">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.matchDetails.missingKeywords.length > 0 && (
                <div>
                  <Label>Missing keywords</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.matchDetails.missingKeywords.map((kw) => (
                      <Badge key={kw} variant="warning">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {sectionEntries.length > 0 && (
                <div>
                  <Label>Section analysis</Label>
                  <ul className="mt-2 space-y-2">
                    {sectionEntries.map(([key, analysis]) => (
                      <li
                        key={key}
                        className="flex items-start justify-between gap-3 rounded-md border px-3 py-2 text-sm"
                      >
                        <div>
                          <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-xs text-muted-foreground">{analysis.note}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {analysis.present ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className={cn('font-semibold', scoreColor(analysis.score))}>
                            {analysis.score}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.suggestions.length > 0 && (
                <div>
                  <Label>Suggestions</Label>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {result.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.improvementPlan.length > 0 && (
                <div>
                  <Label>Improvement plan</Label>
                  <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                    {result.improvementPlan.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
