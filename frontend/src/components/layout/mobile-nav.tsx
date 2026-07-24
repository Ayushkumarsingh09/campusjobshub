'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mainNav } from '@/config/site';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggleExpanded(href: string) {
    setExpanded((prev) => (prev === href ? null : href));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('lg:hidden', className)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="fixed inset-y-0 right-0 left-auto top-0 h-full w-full max-w-sm translate-x-0 translate-y-0 rounded-none border-l border-t-0 p-0 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right sm:max-w-sm"
      >
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle className="text-left text-base">Menu</DialogTitle>
        </DialogHeader>
        <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                {item.children ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleExpanded(item.href)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                      aria-expanded={expanded === item.href}
                    >
                      {item.title}
                      {expanded === item.href ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    {expanded === item.href && (
                      <ul className="ml-3 mt-1 space-y-0.5 border-l pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="space-y-2 px-3">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login" onClick={() => setOpen(false)}>
                Log in
              </Link>
            </Button>
            <Button variant="brand" className="w-full" asChild>
              <Link href="/register" onClick={() => setOpen(false)}>
                Sign up free
              </Link>
            </Button>
          </div>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
