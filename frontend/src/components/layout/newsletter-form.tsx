'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      await api.post<{ subscribed: boolean; message?: string }>('/newsletter/subscribe', {
        email,
        source: 'footer',
      });
      setStatus('success');
      setMessage('Thanks! Check your inbox to confirm your subscription.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Could not subscribe. Try again.');
    }
  }

  return (
    <form className="mt-4 space-y-2" onSubmit={handleSubmit}>
      <Input
        type="email"
        name="email"
        placeholder="you@college.edu"
        required
        aria-label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading'}
      />
      <Button type="submit" variant="brand" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </Button>
      {message && (
        <p
          className={`text-xs ${status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}
          role={status === 'error' ? 'alert' : 'status'}
        >
          {message}
        </p>
      )}
    </form>
  );
}
