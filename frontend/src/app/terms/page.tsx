import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { LegalProse } from '@/app/_components/legal-prose';
import { AdSlot } from '@/components/ads/ad-slot';

export const metadata = buildMetadata({
  title: `Terms of Service — ${siteConfig.name}`,
  description: `Terms and conditions governing your use of ${siteConfig.name}, including job listings, user accounts, and content policies.`,
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Terms of Service"
        description="Last updated: June 7, 2026"
        breadcrumbs={<Breadcrumbs items={[{ name: 'Terms of Service', href: '/terms' }]} />}
      />

      <AdSlot slotId="terms-top" format="banner" className="my-8" adEligible />

      <LegalProse className="mt-8">
        <p>
          Welcome to {siteConfig.name}. These Terms of Service (&ldquo;Terms&rdquo;) govern your
          access to and use of our website, mobile experiences, and related services
          (collectively, the &ldquo;Service&rdquo;). By accessing or using the Service, you agree
          to be bound by these Terms. If you do not agree, please do not use the Service.
        </p>

        <h2>1. Eligibility</h2>
        <p>
          You must be at least 18 years old and capable of forming a binding contract under Indian
          law to use the Service. Students registering for job applications represent that
          information provided is accurate and truthful. Employers represent that they are
          authorized to post jobs on behalf of their organization.
        </p>

        <h2>2. Account Registration</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and
          for all activities under your account. Notify us immediately of unauthorized use. We
          reserve the right to suspend or terminate accounts that violate these Terms or applicable
          law.
        </p>

        <h2>3. Job Listings and Applications</h2>
        <p>
          {siteConfig.name} acts as an intermediary platform connecting job seekers and employers. We
          do not guarantee employment, interview calls, or accuracy of every listing. Employers are
          solely responsible for their job posts, hiring decisions, and compliance with labour laws.
          When you apply, your application data is transmitted to the employer as described in our
          Privacy Policy.
        </p>

        <h2>4. Employer Obligations</h2>
        <p>Employers agree to:</p>
        <ul>
          <li>Post only genuine, current job and internship openings</li>
          <li>Not charge application fees or request payment from candidates</li>
          <li>Comply with applicable employment and anti-discrimination laws in India</li>
          <li>Provide accurate company information and respond to applications in good faith</li>
        </ul>

        <h2>5. User Content</h2>
        <p>
          You retain ownership of content you submit (resumes, comments, etc.) but grant us a
          non-exclusive, worldwide, royalty-free license to use, display, and distribute such
          content as necessary to operate the Service. You represent that you have the right to
          submit such content and that it does not infringe third-party rights or contain unlawful
          material.
        </p>

        <h2>6. Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Scrape, crawl, or harvest data from the Service without permission</li>
          <li>Post false, misleading, or fraudulent job listings or applications</li>
          <li>Harass other users or post spam, malware, or harmful code</li>
          <li>Circumvent security measures or access unauthorized areas</li>
          <li>Use the Service for any unlawful purpose under Indian law</li>
        </ul>

        <h2>7. Intellectual Property</h2>
        <p>
          The Service, including its design, logos, text, graphics, and software, is owned by{' '}
          {siteConfig.name} or its licensors and protected by copyright and trademark laws. You may
          not copy, modify, or distribute our content without written permission, except for
          personal, non-commercial use.
        </p>

        <h2>8. Third-Party Links and Services</h2>
        <p>
          The Service may contain links to third-party websites, including employer career pages and
          advertising partners. We are not responsible for the content or practices of third-party
          sites. Your use of third-party services is at your own risk.
        </p>

        <h2>9. Disclaimer of Warranties</h2>
        <p>
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
          WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
          UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, {siteConfig.name.toUpperCase()} AND
          ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR
          GOODWILL, ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE
          AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR INR 5,000, WHICHEVER IS
          GREATER.
        </p>

        <h2>11. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless {siteConfig.name} from claims, damages, and
          expenses arising from your use of the Service, your content, or your violation of these
          Terms.
        </p>

        <h2>12. Governing Law and Dispute Resolution</h2>
        <p>
          These Terms are governed by the laws of India. Any disputes shall be subject to the
          exclusive jurisdiction of courts in India. Parties agree to attempt good-faith
          negotiation before initiating formal proceedings.
        </p>

        <h2>13. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. Material changes will be notified via the website
          or email. Continued use after changes constitutes acceptance.
        </p>

        <h2>14. Contact</h2>
        <p>
          Questions about these Terms:{' '}
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
        </p>
      </LegalProse>
    </div>
  );
}
