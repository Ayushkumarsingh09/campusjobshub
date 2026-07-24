import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { AuthForm } from '@/components/forms/auth-form';

export const metadata = buildMetadata({
  title: `Create Account — ${siteConfig.name}`,
  description: 'Register for free to apply for campus jobs, save listings, and access AI resume tools.',
  path: '/auth/register',
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <AuthForm defaultTab="register" redirectTo="/dashboard" />
    </div>
  );
}
