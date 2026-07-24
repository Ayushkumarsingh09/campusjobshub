import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { fetchListWithFallback } from '@/lib/fetch-content';
import { FALLBACK_INTERVIEW_QUESTIONS } from '@/lib/static-fallback-data';
import type { InterviewQuestion } from '@/types/api';
import { PageHeader } from '@/components/shared/page-header';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AdSlot } from '@/components/ads/ad-slot';

export const metadata = buildMetadata({
  title: `Interview Questions for Campus Placements — ${siteConfig.name}`,
  description:
    'Company-wise and role-wise interview questions for freshers. HR, technical, and aptitude Q&A for Indian campus hiring.',
  path: '/prepare/interview-questions',
});

async function getQuestions(): Promise<InterviewQuestion[]> {
  return fetchListWithFallback(
    '/interview-questions',
    { page: 1, limit: 50 },
    FALLBACK_INTERVIEW_QUESTIONS
  );
}

export default async function InterviewQuestionsPage() {
  const displayQuestions = await getQuestions();

  const faqs = displayQuestions.slice(0, 10).map((q) => ({
    question: q.question,
    answer: q.answer,
  }));

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <PageHeader
          title="Interview Questions"
          description="Practice common HR, technical, and aptitude questions asked in Indian campus placements."
          breadcrumbs={
            <Breadcrumbs
              items={[
                { name: 'Prepare', href: '/prepare/interview-questions' },
                { name: 'Interview Questions', href: '/prepare/interview-questions' },
              ]}
            />
          }
        />

        <p className="mt-6 max-w-3xl text-muted-foreground">
          Prepare for interviews at TCS, Infosys, Wipro, Amazon, and startups with curated
          questions and model answers. Filter by company and difficulty on our full question bank.
        </p>

        <AdSlot slotId="interview-questions-top" format="banner" className="my-8" adEligible />

        <div className="mt-8 space-y-4">
          {displayQuestions.map((q) => (
            <Card key={q.id}>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  {q.topic && <Badge variant="outline">{q.topic}</Badge>}
                  <Badge
                    variant={
                      q.difficulty === 'easy'
                        ? 'success'
                        : q.difficulty === 'hard'
                          ? 'destructive'
                          : 'warning'
                    }
                  >
                    {q.difficulty}
                  </Badge>
                  {'company' in q && q.company && (
                    <Badge variant="secondary">{q.company.name}</Badge>
                  )}
                </div>
                <h2 className="mt-3 text-lg font-semibold">{q.question}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{q.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <AdSlot slotId="interview-questions-bottom" format="rectangle" className="mt-10" adEligible />
      </div>
    </>
  );
}
