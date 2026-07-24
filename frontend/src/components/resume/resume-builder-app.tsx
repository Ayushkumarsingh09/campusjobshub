'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Copy,
  Download,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSession } from '@/components/providers/session-provider';
import { careerApi } from '@/lib/career-api';
import { EMPTY_RESUME, newId, DEFAULT_SECTION_ORDER } from '@/lib/resume/defaults';
import { cn } from '@/lib/utils';
import { ResumePreview } from '@/components/resume/resume-preview';
import type {
  Resume,
  ResumeContent,
  ResumeSectionId,
  ResumeStatus,
  ResumeTemplate,
} from '@/types/career';

const SECTION_LABELS: Record<ResumeSectionId, string> = {
  personalInfo: 'Personal Info',
  summary: 'Summary',
  education: 'Education',
  experience: 'Experience',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  achievements: 'Achievements',
  languages: 'Languages',
};

const FALLBACK_TEMPLATES: ResumeTemplate[] = [
  { id: 'modern', name: 'Modern', description: 'Clean layout with accent header', atsFriendly: true },
  { id: 'classic', name: 'Classic', description: 'Traditional professional format', atsFriendly: true },
  { id: 'ats-minimal', name: 'ATS Minimal', description: 'Plain text for parsing', atsFriendly: true },
  { id: 'tech', name: 'Tech', description: 'Skills-forward engineering layout', atsFriendly: true },
  { id: 'compact', name: 'Compact', description: 'Dense one-page fresher layout', atsFriendly: true },
];

function mergeContent(content?: ResumeContent): ResumeContent {
  if (!content) return { ...EMPTY_RESUME, sectionOrder: [...DEFAULT_SECTION_ORDER] };
  return {
    ...EMPTY_RESUME,
    ...content,
    personalInfo: { ...EMPTY_RESUME.personalInfo, ...content.personalInfo },
    sectionOrder: content.sectionOrder?.length ? content.sectionOrder : [...DEFAULT_SECTION_ORDER],
  };
}

function prefillFromUser(content: ResumeContent, name?: string, email?: string, phone?: string | null): ResumeContent {
  return {
    ...content,
    personalInfo: {
      ...content.personalInfo,
      fullName: content.personalInfo.fullName || name || '',
      email: content.personalInfo.email || email || '',
      phone: content.personalInfo.phone || phone || '',
    },
  };
}

export function ResumeBuilderApp() {
  const { user } = useSession();
  const previewRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState('My Resume');
  const [templateId, setTemplateId] = useState('modern');
  const [status, setStatus] = useState<ResumeStatus>('draft');
  const [content, setContent] = useState<ResumeContent>(EMPTY_RESUME);
  const [templates, setTemplates] = useState<ResumeTemplate[]>(FALLBACK_TEMPLATES);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [skillsInput, setSkillsInput] = useState('');

  const loadResumes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resumesRes, templatesRes] = await Promise.all([
        careerApi.listResumes(),
        careerApi.getResumeTemplates(),
      ]);
      const list = resumesRes.data ?? [];
      const tpls = (templatesRes.data as ResumeTemplate[] | undefined) ?? FALLBACK_TEMPLATES;
      setTemplates(tpls.length ? tpls : FALLBACK_TEMPLATES);

      if (list.length === 0) {
        const created = await careerApi.createResume({
          title: 'My Resume',
          templateId: 'modern',
          content: prefillFromUser(EMPTY_RESUME, user?.name, user?.email, user?.phone),
        });
        const resume = created.data!;
        setResumes([resume]);
        setActiveId(resume.id);
        setTitle(resume.title);
        setTemplateId(resume.templateId);
        setStatus(resume.status);
        setContent(mergeContent(resume.content));
        setSkillsInput(resume.content.skills.join(', '));
      } else {
        setResumes(list);
        const primary = list.find((r) => r.isPrimary) ?? list[0];
        setActiveId(primary.id);
        setTitle(primary.title);
        setTemplateId(primary.templateId);
        setStatus(primary.status);
        const merged = mergeContent(primary.content);
        setContent(prefillFromUser(merged, user?.name, user?.email, user?.phone));
        setSkillsInput(merged.skills.join(', '));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }, [user?.name, user?.email, user?.phone]);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const selectResume = useCallback(
    (resume: Resume) => {
      setActiveId(resume.id);
      setTitle(resume.title);
      setTemplateId(resume.templateId);
      setStatus(resume.status);
      const merged = mergeContent(resume.content);
      setContent(prefillFromUser(merged, user?.name, user?.email, user?.phone));
      setSkillsInput(merged.skills.join(', '));
      setSaveMessage(null);
    },
    [user?.name, user?.email, user?.phone]
  );

  const updateContent = useCallback((patch: Partial<ResumeContent>) => {
    setContent((prev) => ({ ...prev, ...patch }));
    setSaveMessage(null);
  }, []);

  const saveResume = useCallback(
    async (nextStatus?: ResumeStatus) => {
      if (!activeId) return;
      setSaving(true);
      setError(null);
      try {
        const res = await careerApi.updateResume(activeId, {
          title,
          templateId,
          content,
          status: nextStatus ?? status,
        });
        const updated = res.data!;
        setResumes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setStatus(updated.status);
        setSaveMessage(nextStatus === 'published' ? 'Published' : 'Saved');
        setTimeout(() => setSaveMessage(null), 2500);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save');
      } finally {
        setSaving(false);
      }
    },
    [activeId, title, templateId, content, status]
  );

  useEffect(() => {
    if (!activeId || loading) return;
    const timer = setTimeout(() => {
      if (status === 'draft') {
        careerApi
          .updateResume(activeId, { title, templateId, content })
          .then((res) => {
            if (res.data) {
              setResumes((prev) => prev.map((r) => (r.id === res.data!.id ? res.data! : r)));
              setSaveMessage('Auto-saved');
              setTimeout(() => setSaveMessage(null), 1500);
            }
          })
          .catch(() => {});
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [content, title, templateId, activeId, loading, status]);

  async function handleNewResume() {
    setSaving(true);
    try {
      const res = await careerApi.createResume({
        title: `Resume ${resumes.length + 1}`,
        templateId,
        content: prefillFromUser(EMPTY_RESUME, user?.name, user?.email, user?.phone),
      });
      const resume = res.data!;
      setResumes((prev) => [resume, ...prev]);
      selectResume(resume);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resume');
    } finally {
      setSaving(false);
    }
  }

  async function handleDuplicate() {
    if (!activeId) return;
    setSaving(true);
    try {
      const res = await careerApi.duplicateResume(activeId);
      const copy = res.data!;
      setResumes((prev) => [copy, ...prev]);
      selectResume(copy);
      setSaveMessage('Duplicated');
      setTimeout(() => setSaveMessage(null), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!activeId || resumes.length <= 1) return;
    if (!window.confirm('Delete this resume version?')) return;
    setSaving(true);
    try {
      await careerApi.deleteResume(activeId);
      const remaining = resumes.filter((r) => r.id !== activeId);
      setResumes(remaining);
      selectResume(remaining[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setSaving(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleSectionDragStart(index: number) {
    setDragIndex(index);
  }

  function handleSectionDrop(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const order = [...content.sectionOrder];
    const [moved] = order.splice(dragIndex, 1);
    order.splice(dropIndex, 0, moved);
    updateContent({ sectionOrder: order });
    setDragIndex(null);
  }

  function syncSkillsFromInput(value: string) {
    setSkillsInput(value);
    const skills = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    updateContent({ skills });
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        Loading resume builder…
      </div>
    );
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `@media print {
            body * { visibility: hidden !important; }
            #resume-print-root, #resume-print-root * { visibility: visible !important; }
            #resume-print-root {
              position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0;
            }
            @page { size: A4; margin: 10mm; }
          }`,
        }}
      />

      <div className="space-y-6 print:hidden">
        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label>Resume</Label>
              <Select
                value={activeId ?? undefined}
                onValueChange={(id) => {
                  const r = resumes.find((x) => x.id === id);
                  if (r) selectResume(r);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.title} (v{r.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume-title">Title</Label>
              <Input
                id="resume-title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSaveMessage(null);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                      {t.atsFriendly ? ' · ATS' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Badge variant={status === 'published' ? 'success' : 'secondary'}>
                {status === 'published' ? 'Published' : 'Draft'}
              </Badge>
              {saveMessage && (
                <span className="text-xs text-muted-foreground">{saveMessage}</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleNewResume} disabled={saving}>
              <Plus className="h-4 w-4" />
              New resume
            </Button>
            <Button variant="outline" size="sm" onClick={handleDuplicate} disabled={saving}>
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveResume('draft')}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save draft
            </Button>
            <Button variant="brand" size="sm" onClick={() => saveResume('published')} disabled={saving}>
              <Upload className="h-4 w-4" />
              Publish
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            {resumes.length > 1 && (
              <Button variant="ghost" size="sm" onClick={handleDelete} disabled={saving}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Section order</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              Drag sections to reorder how they appear on your resume.
            </p>
            <ul className="flex flex-wrap gap-2">
              {content.sectionOrder.map((sectionId, index) => (
                <li
                  key={sectionId}
                  draggable
                  onDragStart={() => handleSectionDragStart(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleSectionDrop(index)}
                  onDragEnd={() => setDragIndex(null)}
                  className={cn(
                    'flex cursor-grab items-center gap-1 rounded-md border bg-background px-3 py-1.5 text-sm active:cursor-grabbing',
                    dragIndex === index && 'opacity-50 ring-2 ring-brand-600'
                  )}
                >
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                  {SECTION_LABELS[sectionId]}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 print:block">
        <div className="space-y-6 print:hidden">
          {content.sectionOrder.map((sectionId) => (
            <SectionEditor
              key={sectionId}
              sectionId={sectionId}
              content={content}
              skillsInput={skillsInput}
              onSkillsInputChange={syncSkillsFromInput}
              onChange={updateContent}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start print:static print:col-span-2">
          <Card className="print:border-0 print:shadow-none">
            <CardHeader className="print:hidden">
              <CardTitle className="text-lg">Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto rounded-b-lg bg-muted/20 p-4 print:bg-white print:p-0">
              <div ref={previewRef} id="resume-print-root">
                <ResumePreview content={content} templateId={templateId} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

interface SectionEditorProps {
  sectionId: ResumeSectionId;
  content: ResumeContent;
  skillsInput: string;
  onSkillsInputChange: (value: string) => void;
  onChange: (patch: Partial<ResumeContent>) => void;
}

function SectionEditor({
  sectionId,
  content,
  skillsInput,
  onSkillsInputChange,
  onChange,
}: SectionEditorProps) {
  switch (sectionId) {
    case 'personalInfo':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{SECTION_LABELS.personalInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pi-name">Full name</Label>
              <Input
                id="pi-name"
                value={content.personalInfo.fullName}
                onChange={(e) =>
                  onChange({
                    personalInfo: { ...content.personalInfo, fullName: e.target.value },
                  })
                }
                placeholder="Your full name"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pi-email">Email</Label>
                <Input
                  id="pi-email"
                  type="email"
                  value={content.personalInfo.email}
                  onChange={(e) =>
                    onChange({
                      personalInfo: { ...content.personalInfo, email: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pi-phone">Phone</Label>
                <Input
                  id="pi-phone"
                  value={content.personalInfo.phone}
                  onChange={(e) =>
                    onChange({
                      personalInfo: { ...content.personalInfo, phone: e.target.value },
                    })
                  }
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pi-location">Location</Label>
              <Input
                id="pi-location"
                value={content.personalInfo.location}
                onChange={(e) =>
                  onChange({
                    personalInfo: { ...content.personalInfo, location: e.target.value },
                  })
                }
                placeholder="City, State"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="pi-linkedin">LinkedIn</Label>
                <Input
                  id="pi-linkedin"
                  value={content.personalInfo.linkedin ?? ''}
                  onChange={(e) =>
                    onChange({
                      personalInfo: { ...content.personalInfo, linkedin: e.target.value },
                    })
                  }
                  placeholder="linkedin.com/in/you"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pi-github">GitHub</Label>
                <Input
                  id="pi-github"
                  value={content.personalInfo.github ?? ''}
                  onChange={(e) =>
                    onChange({
                      personalInfo: { ...content.personalInfo, github: e.target.value },
                    })
                  }
                  placeholder="github.com/you"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pi-portfolio">Portfolio</Label>
                <Input
                  id="pi-portfolio"
                  value={content.personalInfo.portfolio ?? ''}
                  onChange={(e) =>
                    onChange({
                      personalInfo: { ...content.personalInfo, portfolio: e.target.value },
                    })
                  }
                  placeholder="yoursite.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'summary':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{SECTION_LABELS.summary}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={4}
              value={content.summary}
              onChange={(e) => onChange({ summary: e.target.value })}
              placeholder="2–3 lines highlighting your degree, skills, and career goal"
            />
          </CardContent>
        </Card>
      );

    case 'skills':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{SECTION_LABELS.skills}</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="skills-input" className="sr-only">
              Skills
            </Label>
            <Input
              id="skills-input"
              value={skillsInput}
              onChange={(e) => onSkillsInputChange(e.target.value)}
              placeholder="Java, Python, React, SQL, Git"
            />
            <p className="mt-2 text-xs text-muted-foreground">Separate skills with commas</p>
          </CardContent>
        </Card>
      );

    case 'education':
      return (
        <ListSectionCard
          title={SECTION_LABELS.education}
          onAdd={() =>
            onChange({
              education: [
                ...content.education,
                {
                  id: newId(),
                  school: '',
                  degree: '',
                  field: '',
                  startDate: '',
                  endDate: '',
                  highlights: [''],
                },
              ],
            })
          }
        >
          {content.education.map((edu, idx) => (
            <div key={edu.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onChange({ education: content.education.filter((e) => e.id !== edu.id) })
                  }
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>School / University</Label>
                  <Input
                    value={edu.school}
                    onChange={(e) => {
                      const education = [...content.education];
                      education[idx] = { ...edu, school: e.target.value };
                      onChange({ education });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => {
                      const education = [...content.education];
                      education[idx] = { ...edu, degree: e.target.value };
                      onChange({ education });
                    }}
                    placeholder="B.Tech"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => {
                      const education = [...content.education];
                      education[idx] = { ...edu, field: e.target.value };
                      onChange({ education });
                    }}
                    placeholder="Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start</Label>
                  <Input
                    value={edu.startDate}
                    onChange={(e) => {
                      const education = [...content.education];
                      education[idx] = { ...edu, startDate: e.target.value };
                      onChange({ education });
                    }}
                    placeholder="Aug 2021"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End</Label>
                  <Input
                    value={edu.endDate}
                    onChange={(e) => {
                      const education = [...content.education];
                      education[idx] = { ...edu, endDate: e.target.value };
                      onChange({ education });
                    }}
                    placeholder="May 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GPA (optional)</Label>
                  <Input
                    value={edu.gpa ?? ''}
                    onChange={(e) => {
                      const education = [...content.education];
                      education[idx] = { ...edu, gpa: e.target.value };
                      onChange({ education });
                    }}
                  />
                </div>
              </div>
              <BulletListEditor
                label="Highlights"
                bullets={edu.highlights}
                onChange={(highlights) => {
                  const education = [...content.education];
                  education[idx] = { ...edu, highlights };
                  onChange({ education });
                }}
              />
            </div>
          ))}
        </ListSectionCard>
      );

    case 'experience':
      return (
        <ListSectionCard
          title={SECTION_LABELS.experience}
          onAdd={() =>
            onChange({
              experience: [
                ...content.experience,
                {
                  id: newId(),
                  company: '',
                  title: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  bullets: [''],
                },
              ],
            })
          }
        >
          {content.experience.map((exp, idx) => (
            <div key={exp.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => {
                      const experience = [...content.experience];
                      experience[idx] = { ...exp, current: e.target.checked };
                      onChange({ experience });
                    }}
                  />
                  Currently working here
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onChange({ experience: content.experience.filter((x) => x.id !== exp.id) })
                  }
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Job title</Label>
                  <Input
                    value={exp.title}
                    onChange={(e) => {
                      const experience = [...content.experience];
                      experience[idx] = { ...exp, title: e.target.value };
                      onChange({ experience });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => {
                      const experience = [...content.experience];
                      experience[idx] = { ...exp, company: e.target.value };
                      onChange({ experience });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) => {
                      const experience = [...content.experience];
                      experience[idx] = { ...exp, location: e.target.value };
                      onChange({ experience });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start</Label>
                  <Input
                    value={exp.startDate}
                    onChange={(e) => {
                      const experience = [...content.experience];
                      experience[idx] = { ...exp, startDate: e.target.value };
                      onChange({ experience });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End</Label>
                  <Input
                    value={exp.endDate}
                    disabled={exp.current}
                    onChange={(e) => {
                      const experience = [...content.experience];
                      experience[idx] = { ...exp, endDate: e.target.value };
                      onChange({ experience });
                    }}
                  />
                </div>
              </div>
              <BulletListEditor
                label="Achievements & responsibilities"
                bullets={exp.bullets}
                onChange={(bullets) => {
                  const experience = [...content.experience];
                  experience[idx] = { ...exp, bullets };
                  onChange({ experience });
                }}
              />
            </div>
          ))}
        </ListSectionCard>
      );

    case 'projects':
      return (
        <ListSectionCard
          title={SECTION_LABELS.projects}
          onAdd={() =>
            onChange({
              projects: [
                ...content.projects,
                { id: newId(), name: '', description: '', technologies: [], url: '' },
              ],
            })
          }
        >
          {content.projects.map((proj, idx) => (
            <div key={proj.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onChange({ projects: content.projects.filter((p) => p.id !== proj.id) })
                  }
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Project name</Label>
                <Input
                  value={proj.name}
                  onChange={(e) => {
                    const projects = [...content.projects];
                    projects[idx] = { ...proj, name: e.target.value };
                    onChange({ projects });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) => {
                    const projects = [...content.projects];
                    projects[idx] = { ...proj, description: e.target.value };
                    onChange({ projects });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Technologies (comma-separated)</Label>
                <Input
                  value={proj.technologies.join(', ')}
                  onChange={(e) => {
                    const projects = [...content.projects];
                    projects[idx] = {
                      ...proj,
                      technologies: e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                    };
                    onChange({ projects });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>URL (optional)</Label>
                <Input
                  value={proj.url ?? ''}
                  onChange={(e) => {
                    const projects = [...content.projects];
                    projects[idx] = { ...proj, url: e.target.value };
                    onChange({ projects });
                  }}
                />
              </div>
            </div>
          ))}
        </ListSectionCard>
      );

    case 'certifications':
      return (
        <ListSectionCard
          title={SECTION_LABELS.certifications}
          onAdd={() =>
            onChange({
              certifications: [
                ...content.certifications,
                { id: newId(), name: '', issuer: '', date: '' },
              ],
            })
          }
        >
          {content.certifications.map((cert, idx) => (
            <div key={cert.id} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-1">
                <Label>Name</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => {
                    const certifications = [...content.certifications];
                    certifications[idx] = { ...cert, name: e.target.value };
                    onChange({ certifications });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Issuer</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => {
                    const certifications = [...content.certifications];
                    certifications[idx] = { ...cert, issuer: e.target.value };
                    onChange({ certifications });
                  }}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Label>Date</Label>
                  <Input
                    value={cert.date}
                    onChange={(e) => {
                      const certifications = [...content.certifications];
                      certifications[idx] = { ...cert, date: e.target.value };
                      onChange({ certifications });
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-7 shrink-0"
                  onClick={() =>
                    onChange({
                      certifications: content.certifications.filter((c) => c.id !== cert.id),
                    })
                  }
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </ListSectionCard>
      );

    case 'achievements':
      return (
        <ListSectionCard
          title={SECTION_LABELS.achievements}
          onAdd={() =>
            onChange({
              achievements: [...content.achievements, { id: newId(), title: '', description: '' }],
            })
          }
        >
          {content.achievements.map((ach, idx) => (
            <div key={ach.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onChange({
                      achievements: content.achievements.filter((a) => a.id !== ach.id),
                    })
                  }
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={ach.title}
                  onChange={(e) => {
                    const achievements = [...content.achievements];
                    achievements[idx] = { ...ach, title: e.target.value };
                    onChange({ achievements });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={ach.description}
                  onChange={(e) => {
                    const achievements = [...content.achievements];
                    achievements[idx] = { ...ach, description: e.target.value };
                    onChange({ achievements });
                  }}
                />
              </div>
            </div>
          ))}
        </ListSectionCard>
      );

    case 'languages':
      return (
        <ListSectionCard
          title={SECTION_LABELS.languages}
          onAdd={() =>
            onChange({
              languages: [...content.languages, { id: newId(), name: '', proficiency: '' }],
            })
          }
        >
          {content.languages.map((lang, idx) => (
            <div key={lang.id} className="flex gap-3 rounded-lg border p-4">
              <div className="flex-1 space-y-2">
                <Label>Language</Label>
                <Input
                  value={lang.name}
                  onChange={(e) => {
                    const languages = [...content.languages];
                    languages[idx] = { ...lang, name: e.target.value };
                    onChange({ languages });
                  }}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Proficiency</Label>
                <Input
                  value={lang.proficiency}
                  onChange={(e) => {
                    const languages = [...content.languages];
                    languages[idx] = { ...lang, proficiency: e.target.value };
                    onChange({ languages });
                  }}
                  placeholder="Native, Fluent, Intermediate"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="mt-7 shrink-0"
                onClick={() =>
                  onChange({ languages: content.languages.filter((l) => l.id !== lang.id) })
                }
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </ListSectionCard>
      );

    default:
      return null;
  }
}

function ListSectionCard({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {React.Children.count(children) === 0 ? (
          <p className="text-sm text-muted-foreground">
            No entries yet. Click Add to create one.
          </p>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

function BulletListEditor({
  label,
  bullets,
  onChange,
}: {
  label: string;
  bullets: string[];
  onChange: (bullets: string[]) => void;
}) {
  const items = bullets.length ? bullets : [''];

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {items.map((bullet, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={bullet}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder="Describe an achievement or responsibility"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            disabled={items.length <= 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...items, ''])}>
        <Plus className="h-4 w-4" />
        Add bullet
      </Button>
    </div>
  );
}
