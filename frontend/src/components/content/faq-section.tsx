'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FaqItem } from '@/lib/content/types';

interface FaqSectionProps {
  faqs: FaqItem[];
  title?: string;
  className?: string;
}

export function FaqSection({ faqs, title = 'Frequently Asked Questions', className }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs.length) return null;

  return (
    <section className={cn('mt-12', className)} aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-6 divide-y rounded-lg border">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium hover:bg-muted/40"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')}
                  aria-hidden
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{faq.answer}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
