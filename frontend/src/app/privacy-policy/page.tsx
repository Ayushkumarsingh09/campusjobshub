import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { LegalProse } from '@/app/_components/legal-prose';
import { AdSlot } from '@/components/ads/ad-slot';

export const metadata = buildMetadata({
  title: `Privacy Policy — ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name}. Learn how we collect, use, and protect your personal data in compliance with Indian law and Google AdSense requirements.`,
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  const lastUpdated = 'June 7, 2026';

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Privacy Policy"
        description={`Last updated: ${lastUpdated}`}
        breadcrumbs={
          <Breadcrumbs items={[{ name: 'Privacy Policy', href: '/privacy-policy' }]} />
        }
      />

      <AdSlot slotId="privacy-top" format="banner" className="my-8" adEligible />

      <LegalProse className="mt-8">
        <p>
          This Privacy Policy describes how {siteConfig.name} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) collects, uses, discloses, and safeguards your information when you
          visit <a href={siteConfig.url}>{siteConfig.url}</a> and use our services. We are committed
          to protecting your privacy in accordance with the Information Technology Act, 2000, the
          Information Technology (Reasonable Security Practices and Procedures and Sensitive
          Personal Data or Information) Rules, 2011, and other applicable laws in India.
        </p>

        <h2>1. Information We Collect</h2>
        <h3>1.1 Information You Provide</h3>
        <p>When you register, apply for jobs, or contact us, we may collect:</p>
        <ul>
          <li>Name, email address, phone number, and password</li>
          <li>Educational details, skills, resume content, and profile information</li>
          <li>Job application data including cover letters and uploaded documents</li>
          <li>Communications you send to our support team</li>
          <li>Newsletter subscription preferences</li>
        </ul>

        <h3>1.2 Automatically Collected Information</h3>
        <p>When you access our website, we automatically collect certain information, including:</p>
        <ul>
          <li>IP address, browser type, device type, and operating system</li>
          <li>Pages visited, referral URLs, and time spent on pages</li>
          <li>Cookie identifiers and similar tracking technologies (see our Cookie Policy)</li>
          <li>Log data for security, analytics, and performance monitoring</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Provide, operate, and maintain our job board, resume tools, and content services</li>
          <li>Process job and internship applications and share relevant data with employers</li>
          <li>Personalize your experience and recommend relevant listings</li>
          <li>Send transactional emails, placement alerts, and newsletters (with consent)</li>
          <li>Improve our website, fix bugs, and conduct analytics</li>
          <li>Detect fraud, enforce our Terms of Service, and comply with legal obligations</li>
          <li>Display advertisements through Google AdSense and measure ad performance</li>
        </ul>

        <h2>3. Google AdSense and Third-Party Advertising</h2>
        <p>
          We use Google AdSense to serve advertisements on our website. Google and its partners may
          use cookies and web beacons to serve ads based on your prior visits to our site or other
          websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads
          to you based on your visit to our site and/or other sites on the Internet.
        </p>
        <p>
          You may opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" rel="noopener noreferrer" target="_blank">
            Google Ads Settings
          </a>{' '}
          or{' '}
          <a href="https://www.aboutads.info/choices/" rel="noopener noreferrer" target="_blank">
            www.aboutads.info
          </a>
          . Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s
          prior visits to your website or other websites.
        </p>
        <p>
          For more information on how Google uses data, visit{' '}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            rel="noopener noreferrer"
            target="_blank"
          >
            How Google uses information from sites or apps that use our services
          </a>
          .
        </p>

        <h2>4. Cookies and Tracking Technologies</h2>
        <p>
          We use essential, functional, analytics, and advertising cookies. You can manage your
          preferences through our cookie consent banner or your browser settings. See our{' '}
          <a href="/cookie-policy">Cookie Policy</a> for full details.
        </p>

        <h2>5. Sharing of Information</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>
            <strong>Employers:</strong> When you apply for a job or internship, your application
            materials are shared with the posting employer.
          </li>
          <li>
            <strong>Service providers:</strong> Hosting, email delivery, analytics (e.g., Google
            Analytics), cloud storage, and payment processors under contractual obligations.
          </li>
          <li>
            <strong>Legal requirements:</strong> When required by law, court order, or government
            authority in India.
          </li>
          <li>
            <strong>Business transfers:</strong> In connection with a merger, acquisition, or sale
            of assets, with notice to users where required.
          </li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>

        <h2>6. Data Retention</h2>
        <p>
          We retain personal data for as long as your account is active or as needed to provide
          services, comply with legal obligations, resolve disputes, and enforce agreements.
          Resume and application data may be retained according to employer requirements and
          applicable record-keeping laws.
        </p>

        <h2>7. Data Security</h2>
        <p>
          We implement reasonable security practices including encryption in transit (HTTPS), access
          controls, and regular security reviews. However, no method of transmission over the
          Internet is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>8. Your Rights</h2>
        <p>Under applicable Indian law, you may have the right to:</p>
        <ul>
          <li>Access and obtain a copy of your personal data</li>
          <li>Correct inaccurate or incomplete information</li>
          <li>Request deletion of your account and associated data</li>
          <li>Withdraw consent for marketing communications</li>
          <li>Lodge a grievance with our designated officer (see Section 11)</li>
        </ul>
        <p>
          To exercise these rights, contact us at{' '}
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
        </p>

        <h2>9. Children&apos;s Privacy</h2>
        <p>
          Our services are intended for users aged 18 and above, primarily college students and
          graduates. We do not knowingly collect personal information from children under 18. If
          you believe we have collected such information, please contact us immediately.
        </p>

        <h2>10. International Data Transfers</h2>
        <p>
          Your data may be processed on servers located outside India by our service providers. We
          ensure appropriate safeguards are in place consistent with applicable data protection
          requirements.
        </p>

        <h2>11. Grievance Officer</h2>
        <p>
          In accordance with the Information Technology Act, 2000, the contact details of our
          Grievance Officer are:
        </p>
        <ul>
          <li>Email: {siteConfig.contact.email}</li>
          <li>Address: {siteConfig.contact.address}</li>
        </ul>
        <p>We will acknowledge grievances within 24 hours and resolve them within 15 days.</p>

        <h2>12. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Material changes will be posted on
          this page with an updated &ldquo;Last updated&rdquo; date. Continued use of our services
          after changes constitutes acceptance of the revised policy.
        </p>

        <h2>13. Contact Us</h2>
        <p>
          For privacy-related questions, contact us at{' '}
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> or visit our{' '}
          <a href="/contact">Contact page</a>.
        </p>
      </LegalProse>

      <AdSlot slotId="privacy-bottom" format="rectangle" className="mt-10" adEligible />
    </div>
  );
}
