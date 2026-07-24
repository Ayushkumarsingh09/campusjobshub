import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SessionProvider } from '@/components/providers/session-provider';
import { AppChrome } from '@/components/layout/app-chrome';
import { CookieBanner } from '@/components/consent/cookie-banner';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { JsonLd } from '@/components/seo/json-ld';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — Campus Jobs, Internships & Placement Prep`,
  description: siteConfig.description,
  path: '/',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
        <ThemeProvider>
          <SessionProvider>
            <AppChrome>{children}</AppChrome>
            <CookieBanner />
            <GoogleAnalytics />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
