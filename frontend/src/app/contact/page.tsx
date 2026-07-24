import { Mail, MapPin, Phone } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { ContactForm } from '@/app/_components/contact-form';

export const metadata = buildMetadata({
  title: `Contact Us — ${siteConfig.name}`,
  description: `Get in touch with the ${siteConfig.name} team for support, partnerships, advertising, or general inquiries.`,
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageHeader
        title="Contact Us"
        description="Have a question, feedback, or partnership idea? We are here to help."
        breadcrumbs={
          <Breadcrumbs items={[{ name: 'Contact', href: '/contact' }]} />
        }
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4">
          <Card>
            <CardContent className="flex items-start gap-4 p-5">
              <Mail className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
              <div>
                <p className="font-medium">Email</p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-4 p-5">
              <Phone className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{siteConfig.contact.phone}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-4 p-5">
              <MapPin className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{siteConfig.contact.address}</p>
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            For job listing issues, employer verification, or advertising inquiries, please include
            relevant details in your message so we can route your request quickly.
          </p>
        </div>

        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
