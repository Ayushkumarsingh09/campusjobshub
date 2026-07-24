import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { InternalLink } from '@/lib/content/types';

interface InternalLinksBlockProps {
  links: InternalLink[];
  title?: string;
}

export function InternalLinksBlock({
  links,
  title = 'Related resources',
}: InternalLinksBlockProps) {
  if (!links.length) return null;

  return (
    <section className="mt-12 rounded-lg border bg-muted/20 p-6" aria-labelledby="internal-links-heading">
      <h2 id="internal-links-heading" className="text-lg font-semibold">
        {title}
      </h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ArrowRight className="h-4 w-4 opacity-60 group-hover:opacity-100" aria-hidden />
              {link.anchor ?? link.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
