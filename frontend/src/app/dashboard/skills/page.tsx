import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { SkillGapPanel } from '@/components/career/skill-gap-panel';

export const metadata = buildMetadata({
  title: `Skill Gap Analyzer — ${siteConfig.name}`,
  path: '/dashboard/skills',
  noIndex: true,
  description: 'Analyze skill gaps and get a personalized learning plan.',
});

export default function SkillsPage() {
  return <SkillGapPanel />;
}
