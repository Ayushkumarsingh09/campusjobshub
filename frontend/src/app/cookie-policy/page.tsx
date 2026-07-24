import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { LegalProse } from '@/app/_components/legal-prose';
import { AdSlot } from '@/components/ads/ad-slot';

export const metadata = buildMetadata({
  title: `Cookie Policy — ${siteConfig.name}`,
  description: `Learn how ${siteConfig.name} uses cookies, including Google AdSense and analytics cookies, and how to manage your preferences.`,
  path: '/cookie-policy',
});

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Cookie Policy"
        description="Last updated: June 7, 2026"
        breadcrumbs={
          <Breadcrumbs items={[{ name: 'Cookie Policy', href: '/cookie-policy' }]} />
        }
      />

      <AdSlot slotId="cookie-top" format="banner" className="my-8" adEligible />

      <LegalProse className="mt-8">
        <p>
          This Cookie Policy explains how {siteConfig.name} (&ldquo;we,&rdquo; &ldquo;us&rdquo;) uses
          cookies and similar technologies when you visit {siteConfig.url}. It should be read
          alongside our <a href="/privacy-policy">Privacy Policy</a>.
        </p>

        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a website. They help
          websites remember your preferences, keep you logged in, understand how you use the site,
          and deliver relevant advertisements. We also use similar technologies such as local
          storage, session storage, and pixel tags.
        </p>

        <h2>2. Types of Cookies We Use</h2>

        <h3>2.1 Strictly Necessary Cookies</h3>
        <p>
          These cookies are essential for the website to function. They enable core features such as
          authentication, security, and cookie consent storage. You cannot opt out of these cookies
          without affecting site functionality.
        </p>

        <h3>2.2 Functional Cookies</h3>
        <p>
          These cookies remember your choices, such as theme preference (light/dark mode) and
          language settings, to provide a more personalized experience.
        </p>

        <h3>2.3 Analytics Cookies</h3>
        <p>
          We use Google Analytics (only with your consent) to understand how visitors interact with
          our website — which pages are popular, how long users stay, and where traffic comes from.
          This helps us improve content and user experience. Google Analytics may set cookies such as
          _ga and _gid. Data is anonymized where possible.
        </p>

        <h3>2.4 Advertising Cookies</h3>
        <p>
          We use Google AdSense to display advertisements. Google and its advertising partners use
          cookies to:
        </p>
        <ul>
          <li>Serve ads based on your visits to our site and other websites</li>
          <li>Measure ad effectiveness and prevent fraud</li>
          <li>Limit how often you see an ad</li>
        </ul>
        <p>
          Common third-party cookies include those from google.com, doubleclick.net, and
          googlesyndication.com. You can manage ad personalization through our cookie banner or
          Google&apos;s ad settings.
        </p>

        <h2>3. Cookie Consent</h2>
        <p>
          When you first visit our website, a cookie banner allows you to accept all cookies,
          reject non-essential cookies, or customize your preferences. Your choice is stored in
          local storage and respected on subsequent visits. You can change your preferences at any
          time by clearing site data or contacting us.
        </p>

        <h2>4. How to Control Cookies</h2>
        <p>You can control cookies through:</p>
        <ul>
          <li>
            <strong>Our consent banner:</strong> Manage analytics and advertising preferences on
            first visit
          </li>
          <li>
            <strong>Browser settings:</strong> Most browsers let you block or delete cookies. See
            help documentation for Chrome, Firefox, Safari, or Edge
          </li>
          <li>
            <strong>Google opt-out:</strong>{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>
          </li>
          <li>
            <strong>Industry opt-out:</strong>{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              Digital Advertising Alliance
            </a>
          </li>
        </ul>
        <p>
          Note: Blocking all cookies may prevent you from using certain features such as saved jobs
          and resume builder.
        </p>

        <h2>5. Cookie Retention</h2>
        <p>
          Session cookies expire when you close your browser. Persistent cookies remain for a set
          period — typically from 30 days to 2 years depending on purpose. Consent preferences are
          stored until you clear them or we update our policy.
        </p>

        <h2>6. Updates</h2>
        <p>
          We may update this Cookie Policy to reflect changes in technology, regulation, or our
          practices. Check this page periodically for the latest information.
        </p>

        <h2>7. Contact</h2>
        <p>
          Questions about cookies:{' '}
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
        </p>
      </LegalProse>
    </div>
  );
}
