'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Tabs from '@radix-ui/react-tabs';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { login, register } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@/components/providers/session-provider';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[0-9]/, 'Include at least one number'),
  role: z.enum(['student', 'employer']),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthFormProps {
  defaultTab?: 'login' | 'register';
  redirectTo?: string;
  className?: string;
}

export function AuthForm({
  defaultTab = 'login',
  redirectTo = '/dashboard',
  className,
}: AuthFormProps) {
  const router = useRouter();
  const { refresh } = useSession();
  const [tab, setTab] = useState(defaultTab);
  const [error, setError] = useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', role: 'student' },
  });

  async function onLogin(data: LoginFormData) {
    setError(null);
    try {
      await login(data.email, data.password);
      await refresh();
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  }

  async function onRegister(data: RegisterFormData) {
    setError(null);
    try {
      await register(data);
      await refresh();
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  }

  return (
    <Card className={cn('mx-auto w-full max-w-md', className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs.Root value={tab} onValueChange={(v) => { setTab(v as 'login' | 'register'); setError(null); }}>
          <Tabs.List className="mb-6 grid w-full grid-cols-2 rounded-lg bg-muted p-1">
            <Tabs.Trigger
              value="login"
              className="rounded-md px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Log in
            </Tabs.Trigger>
            <Tabs.Trigger
              value="register"
              className="rounded-md px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Register
            </Tabs.Trigger>
          </Tabs.List>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <Tabs.Content value="login">
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                variant="brand"
                className="w-full"
                disabled={loginForm.formState.isSubmitting}
              >
                {loginForm.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Log in
              </Button>
            </form>
          </Tabs.Content>

          <Tabs.Content value="register">
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Full name</Label>
                <Input
                  id="register-name"
                  autoComplete="name"
                  {...registerForm.register('name')}
                />
                {registerForm.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  {...registerForm.register('email')}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  {...registerForm.register('password')}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>I am a</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['student', 'employer'] as const).map((role) => (
                    <label
                      key={role}
                      className={cn(
                        'flex cursor-pointer items-center justify-center rounded-md border px-3 py-2.5 text-sm font-medium transition-colors',
                        registerForm.watch('role') === role
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'hover:bg-muted'
                      )}
                    >
                      <input
                        type="radio"
                        value={role}
                        className="sr-only"
                        {...registerForm.register('role')}
                      />
                      {role === 'student' ? 'Student' : 'Employer'}
                    </label>
                  ))}
                </div>
              </div>
              <Button
                type="submit"
                variant="brand"
                className="w-full"
                disabled={registerForm.formState.isSubmitting}
              >
                {registerForm.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Create account
              </Button>
            </form>
          </Tabs.Content>
        </Tabs.Root>
      </CardContent>
    </Card>
  );
}
