import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { ProfileForm } from '@/components/career/profile-form';

export const metadata = buildMetadata({
  title: `Profile — ${siteConfig.name}`,
  path: '/dashboard/profile',
  noIndex: true,
  description: 'Manage your career profile, skills, and target role.',
});

export default function ProfilePage() {
  return <ProfileForm />;
}
