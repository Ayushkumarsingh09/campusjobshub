import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { LegalProse } from '@/app/_components/legal-prose';
import { AdSlot } from '@/components/ads/ad-slot';

export const metadata = buildMetadata({
  title: `Editorial Policy — ${siteConfig.name}`,
  description: `Our editorial standards for blog posts, interview guides, career roadmaps, and placement content on ${siteConfig.name}.`,
  path: '/editorial-policy',
});

export default function EditorialPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Editorial Policy"
        description="How we create, review, and maintain trustworthy career content"
        breadcrumbs={
          <Breadcrumbs items={[{ name: 'Editorial Policy', href: '/editorial-policy' }]} />
        }
      />

      <AdSlot slotId="editorial-top" format="banner" className="my-8" adEligible />

      <LegalProse className="mt-8">
        <p>
          {siteConfig.name} publishes career guidance, placement preparation articles, interview
          question banks, and structured roadmaps to help Indian students succeed in campus hiring.
          This Editorial Policy outlines the standards we follow to ensure content is accurate,
          helpful, and transparent.
        </p>

        <h2>1. Mission</h2>
        <p>
          Our editorial mission is to provide practical, India-specific career advice that students
          can act on immediately — from resume formatting for TCS to coding interview preparation
          for product companies. We prioritize clarity, factual accuracy, and student outcomes over
          sensational headlines.
        </p>

        <h2>2. Content Creation Process</h2>
        <ul>
          <li>
            <strong>Research:</strong> Articles are researched using official company sources,
            verified student experiences, industry reports, and subject-matter expertise.
          </li>
          <li>
            <strong>Writing:</strong> Content is written or reviewed by editors with experience in
            campus placements, HR, or the relevant technical domain.
          </li>
          <li>
            <strong>Review:</strong> All published content undergoes editorial review for accuracy,
            tone, and compliance with our style guide before publication.
          </li>
          <li>
            <strong>Updates:</strong> Placement seasons, exam patterns, and company processes change.
            We review and update high-traffic articles at least annually or when material changes
            occur.
          </li>
        </ul>

        <h2>3. Accuracy and Corrections</h2>
        <p>
          We strive for factual accuracy but acknowledge that hiring processes vary by campus and
          year. If you find an error, contact us at {siteConfig.contact.email}. We will investigate
          and publish corrections prominently when warranted.
        </p>

        <h2>4. Sponsored and Affiliate Content</h2>
        <p>
          Sponsored articles, paid placements, and affiliate links are clearly labeled as
          &ldquo;Sponsored,&rdquo; &ldquo;Advertisement,&rdquo; or &ldquo;Affiliate.&rdquo;
          Sponsored content still undergoes editorial review and must not make false claims about
          employment outcomes. Advertising relationships do not influence our unbiased guides and
          interview question content.
        </p>

        <h2>5. User-Generated Content</h2>
        <p>
          Comments and testimonials are moderated before publication. We remove spam, hate speech,
          personal attacks, and misleading claims. User opinions do not represent {siteConfig.name}
          &apos;s official views.
        </p>

        <h2>6. AI-Assisted Content</h2>
        <p>
          We may use AI tools to assist with drafting, formatting, or summarization. All AI-assisted
          content is reviewed and edited by human editors before publication. Resume AI features
          generate suggestions for users; final resume content is the user&apos;s responsibility.
        </p>

        <h2>7. Independence</h2>
        <p>
          Editorial decisions are made independently of advertising sales. Advertisers cannot pay for
          favorable coverage in editorial articles. Job listing prominence may be purchased
          separately and is labeled as featured/sponsored where applicable.
        </p>

        <h2>8. Contact the Editorial Team</h2>
        <p>
          For editorial feedback, corrections, or partnership inquiries:{' '}
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
        </p>
      </LegalProse>
    </div>
  );
}
