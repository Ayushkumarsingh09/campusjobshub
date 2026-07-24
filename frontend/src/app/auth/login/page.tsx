import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { AuthForm } from '@/components/forms/auth-form';

export const metadata = buildMetadata({
  title: `Log In — ${siteConfig.name}`,
  description: 'Sign in to your CampusJobsHub account to apply for jobs, save listings, and use resume tools.',
  path: '/auth/login',
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <AuthForm defaultTab="login" redirectTo="/dashboard" />
    </div>
  );
}
