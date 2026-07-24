import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { LegalProse } from '@/app/_components/legal-prose';
import { AdSlot } from '@/components/ads/ad-slot';

export const metadata = buildMetadata({
  title: `Disclaimer — ${siteConfig.name}`,
  description: `Important disclaimers regarding job listings, career advice, AI tools, and third-party content on ${siteConfig.name}.`,
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Disclaimer"
        description="Last updated: June 7, 2026"
        breadcrumbs={
          <Breadcrumbs items={[{ name: 'Disclaimer', href: '/disclaimer' }]} />
        }
      />

      <AdSlot slotId="disclaimer-top" format="banner" className="my-8" adEligible />

      <LegalProse className="mt-8">
        <p>
          The information provided on {siteConfig.name} ({siteConfig.url}) is for general
          informational purposes only. By using this website, you accept this disclaimer in full.
        </p>

        <h2>1. No Employment Guarantee</h2>
        <p>
          {siteConfig.name} is a job aggregation and career preparation platform. We do not guarantee
          job offers, interview calls, internships, or any specific employment outcome. Hiring
          decisions are made solely by employers. Past success stories shared on our site do not
          guarantee similar results for other users.
        </p>

        <h2>2. Job Listing Accuracy</h2>
        <p>
          While we review listings and verify employers where possible, we cannot guarantee the
          accuracy, completeness, or timeliness of every job or internship post. Salaries,
          locations, and requirements may change without notice. Users should verify details
          directly with employers before applying or accepting offers.
        </p>

        <h2>3. Career and Educational Content</h2>
        <p>
          Blog posts, interview questions, roadmaps, and guides are provided for educational
          purposes. They do not constitute professional career counselling, legal advice, or
          financial advice. Company interview processes change frequently; use our content as a
          starting point and confirm current requirements with official sources.
        </p>

        <h2>4. AI-Powered Tools</h2>
        <p>
          Resume builder, ATS checker, and cover letter generator features use automated systems
          that may produce inaccurate or incomplete suggestions. Users are responsible for reviewing
          and verifying all AI-generated content before submission to employers. We do not
          guarantee ATS scores will result in interview shortlisting.
        </p>

        <h2>5. Third-Party Links and Advertisements</h2>
        <p>
          Our website contains links to third-party websites and displays advertisements via Google
          AdSense and other partners. We do not endorse and are not responsible for the content,
          products, services, or privacy practices of third parties. Clicking external links is at
          your own risk.
        </p>

        <h2>6. Financial Information</h2>
        <p>
          Salary ranges and stipend figures displayed on listings are provided by employers or
          estimated for reference. Actual compensation may differ based on negotiation, location,
          and role. We are not responsible for discrepancies between displayed and offered
          compensation.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, {siteConfig.name}, its owners, employees, and
          affiliates shall not be liable for any direct, indirect, incidental, or consequential
          damages arising from your use of the website, reliance on content, job applications, or
          interactions with employers or advertisers.
        </p>

        <h2>8. Changes</h2>
        <p>
          We reserve the right to update this disclaimer at any time. Continued use of the website
          constitutes acceptance of the current disclaimer.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
        </p>
      </LegalProse>
    </div>
  );
}
