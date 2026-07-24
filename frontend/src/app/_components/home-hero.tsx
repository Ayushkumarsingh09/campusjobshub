'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-brand-50/80 to-background dark:from-brand-950/30">
      <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-brand-600" aria-hidden />
              India&apos;s campus career platform
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Land your dream{' '}
            <span className="text-brand-600">campus job</span> or internship
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Browse fresher jobs, paid internships, company profiles, AI resume tools,
            interview prep, and placement guides — all in one place.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button variant="brand" size="lg" asChild>
              <Link href="/jobs">
                <Briefcase className="h-5 w-5" aria-hidden />
                Browse Jobs
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/internships">
                <GraduationCap className="h-5 w-5" aria-hidden />
                Find Internships
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-10 grid grid-cols-3 gap-4 border-t pt-8 sm:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            {[
              { label: 'Active listings', value: '10,000+' },
              { label: 'Companies', value: '500+' },
              { label: 'Students helped', value: '2L+' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-brand-600 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/resume"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
          >
            Try AI Resume Builder
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
