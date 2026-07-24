import Link from 'next/link';
import { Briefcase, Mail, Shield, Users, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig, footerNav } from '@/config/site';
import { Separator } from '@/components/ui/separator';
import { NewsletterForm } from '@/components/layout/newsletter-form';

interface FooterProps {
  className?: string;
}

const trustSignals = [
  { icon: Users, label: '2M+ students' },
  { icon: Building2, label: '5,000+ companies' },
  { icon: Shield, label: 'Verified listings' },
];

const footerSections = [
  { title: 'Platform', links: footerNav.platform },
  { title: 'Resources', links: footerNav.resources },
  { title: 'Company', links: footerNav.company },
  { title: 'Legal', links: footerNav.legal },
];

export function Footer({ className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn('border-t bg-muted/30', className)}>
      <div className="container-wide section-padding pb-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Briefcase className="h-4 w-4" />
              </span>
              {siteConfig.name}
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              {trustSignals.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Icon className="h-4 w-4 text-brand-600" aria-hidden />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-5">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold">{section.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-lg border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-600" aria-hidden />
                <h3 className="text-sm font-semibold">Weekly job digest</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Get curated campus jobs and internship alerts in your inbox.
              </p>
              <NewsletterForm />
              <p className="mt-2 text-xs text-muted-foreground">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" aria-hidden />
            Made for Indian students & freshers
          </p>
        </div>
      </div>
    </footer>
  );
}
