import { cn } from '@/lib/utils';

interface LegalProseProps {
  children: React.ReactNode;
  className?: string;
}

export function LegalProse({ children, className }: LegalProseProps) {
  return (
    <article
      className={cn(
        'prose prose-slate dark:prose-invert max-w-none',
        'prose-headings:scroll-mt-20 prose-h2:mt-10 prose-h2:border-b prose-h2:pb-2',
        'prose-p:leading-relaxed prose-li:leading-relaxed',
        className
      )}
    >
      {children}
    </article>
  );
}
