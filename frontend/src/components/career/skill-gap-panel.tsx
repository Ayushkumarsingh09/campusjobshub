'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { careerApi } from '@/lib/career-api';
import type { SkillGapResult } from '@/types/career';
import { useSession } from '@/components/providers/session-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

export function SkillGapPanel() {
  const { user } = useSession();
  const [roles, setRoles] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    careerApi.getSkillGapRoles().then((res) => {
      const list = res.data ?? [];
      setRoles(list);
      setTargetRole(user?.targetRole ?? list[0] ?? 'Software Engineer');
    });
  }, [user?.targetRole]);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await careerApi.analyzeSkillGap(targetRole);
      setResult(res.data ?? null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Skill Gap Analyzer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compare your current skills against your target role and get a learning plan.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Target role</Label>
            <select
              id="role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-muted-foreground">
            Current skills: {(user?.skills ?? []).join(', ') || 'None — add skills in Profile'}
          </p>
          <Button variant="brand" onClick={analyze} disabled={loading}>
            {loading ? 'Analyzing…' : 'Analyze skill gap'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Match score
                <Badge variant={result.matchPercent >= 70 ? 'default' : 'secondary'}>
                  {result.matchPercent}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Target role: <strong>{result.targetRole}</strong>
              </p>
              <h3 className="font-medium mb-2">Missing skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((s) => (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))}
                {!result.missingSkills.length && (
                  <p className="text-sm text-muted-foreground">No major gaps detected.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Learning plan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {result.learningPlan.map((week) => (
                <div key={week.week} className="rounded-lg border p-4">
                  <p className="font-medium">Week {week.week}: {week.focus}</p>
                  <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5">
                    {week.resources.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Suggested roadmaps</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {result.roadmapSlugs.map((slug) => (
                <Button key={slug} variant="outline" size="sm" asChild>
                  <Link href={`/prepare/roadmaps/${slug}`}>{slug.replace(/-/g, ' ')}</Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
