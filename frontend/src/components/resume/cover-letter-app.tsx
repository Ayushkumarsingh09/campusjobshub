'use client';

import { useCallback, useEffect, useState } from 'react';
import { Copy, Download, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { careerApi } from '@/lib/career-api';
import { formatDate } from '@/lib/utils';
import type { CoverLetter, CoverLetterStyle, Resume } from '@/types/career';

const STYLE_OPTIONS: { value: CoverLetterStyle; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Formal and polished tone' },
  { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and motivated' },
  { value: 'concise', label: 'Concise', description: 'Short and direct' },
  { value: 'storytelling', label: 'Storytelling', description: 'Narrative-driven approach' },
];

export function CoverLetterApp() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeId, setResumeId] = useState<string>('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [style, setStyle] = useState<CoverLetterStyle>('professional');
  const [letter, setLetter] = useState('');
  const [activeLetterId, setActiveLetterId] = useState<string | null>(null);
  const [history, setHistory] = useState<CoverLetter[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [resumesRes, lettersRes] = await Promise.all([
        careerApi.listResumes(),
        careerApi.listCoverLetters(),
      ]);
      const list = resumesRes.data ?? [];
      setResumes(list);
      if (list.length > 0) {
        setResumeId(list.find((r) => r.isPrimary)?.id ?? list[0].id);
      }
      setHistory(lettersRes.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleGenerate() {
    if (!jobTitle.trim() || !companyName.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await careerApi.generateCoverLetter({
        resumeId: resumeId || undefined,
        jobTitle,
        companyName,
        jobDescription: jobDescription || undefined,
        style,
      });
      const { content, id } = res.data!;
      setLetter(content);
      setActiveLetterId(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    if (!letter) return;
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!letter) return;
    const blob = new Blob([letter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${companyName.replace(/\s+/g, '-').toLowerCase() || 'draft'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function selectHistoryItem(item: CoverLetter) {
    setLetter(item.content);
    setActiveLetterId(item.id);
    setJobTitle(item.jobTitle ?? '');
    setCompanyName(item.companyName ?? '');
    setStyle(item.style);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this cover letter?')) return;
    try {
      await careerApi.deleteCoverLetter(id);
      if (activeLetterId === id) {
        setLetter('');
        setActiveLetterId(null);
      }
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        Loading cover letter generator…
      </div>
    );
  }

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
            <CardTitle className="text-lg">Job details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumes.length > 0 && (
              <div className="space-y-2">
                <Label>Base resume</Label>
                <Select value={resumeId} onValueChange={setResumeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="cl-company">Company name</Label>
              <Input
                id="cl-company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. TCS, Infosys, Razorpay"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cl-role">Role / position</Label>
              <Input
                id="cl-role"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Graduate Trainee, SDE Intern"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cl-jd">Job description (optional)</Label>
              <Textarea
                id="cl-jd"
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key requirements to tailor the letter"
              />
            </div>

            <div className="space-y-2">
              <Label>Writing style</Label>
              <Select value={style} onValueChange={(v) => setStyle(v as CoverLetterStyle)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label} — {opt.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="brand"
              className="w-full sm:w-auto"
              onClick={handleGenerate}
              disabled={generating || !companyName.trim() || !jobTitle.trim()}
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate cover letter
            </Button>
          </CardContent>
        </Card>

        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">History</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="max-h-64 space-y-2 overflow-y-auto">
                {history.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-2 rounded-md border px-3 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => selectHistoryItem(item)}
                      className="min-w-0 flex-1 text-left text-sm hover:text-brand-600"
                    >
                      <p className="truncate font-medium">
                        {item.jobTitle ?? 'Role'} at {item.companyName ?? 'Company'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt)} · {item.style}
                      </p>
                    </button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="lg:sticky lg:top-24 lg:self-start">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-lg">Generated letter</CardTitle>
          {letter && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {letter ? (
            <div className="whitespace-pre-wrap rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed">
              {letter}
            </div>
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center text-muted-foreground">
              <Sparkles className="h-12 w-12 opacity-40" />
              <p className="mt-4 max-w-sm text-sm">
                Fill in the company and role details, then generate a tailored cover letter for
                your campus application.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
