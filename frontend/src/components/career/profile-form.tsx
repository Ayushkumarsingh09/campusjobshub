'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/components/providers/session-provider';
import { careerApi } from '@/lib/career-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProfileForm() {
  const { user, refresh } = useSession();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    college: '',
    graduationYear: '',
    phone: '',
    bio: '',
    skills: '',
    interests: '',
    targetRole: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? '',
        college: user.college ?? '',
        graduationYear: user.graduationYear?.toString() ?? '',
        phone: user.phone ?? '',
        bio: user.bio ?? '',
        skills: (user.skills ?? []).join(', '),
        interests: (user.interests ?? []).join(', '),
        targetRole: user.targetRole ?? '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await careerApi.updateProfile({
        name: form.name,
        college: form.college || null,
        graduationYear: form.graduationYear ? parseInt(form.graduationYear, 10) : null,
        phone: form.phone || null,
        bio: form.bio || null,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
        targetRole: form.targetRole || null,
      });
      await refresh();
      setMessage('Profile updated successfully.');
    } catch {
      setMessage('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Career Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your profile powers job recommendations and skill gap analysis.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal & career details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="college">College</Label>
              <Input id="college" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Graduation year</Label>
              <Input id="year" type="number" value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetRole">Target role</Label>
            <Input id="targetRole" placeholder="e.g. Software Engineer" value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input id="skills" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Java, Python, React, SQL" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma-separated)</Label>
            <Input id="interests" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder="AI/ML, Web Dev, Product" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <Button variant="brand" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </Button>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
