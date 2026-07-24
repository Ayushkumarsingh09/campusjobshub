'use client';

import { cn } from '@/lib/utils';
import type { ResumeContent, ResumeSectionId } from '@/types/career';

export interface ResumePreviewProps {
  content: ResumeContent;
  templateId: string;
  className?: string;
  id?: string;
}

const SECTION_TITLES: Record<Exclude<ResumeSectionId, 'personalInfo'>, string> = {
  summary: 'Summary',
  education: 'Education',
  experience: 'Experience',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  achievements: 'Achievements',
  languages: 'Languages',
};

function formatDateRange(start: string, end: string, current?: boolean): string {
  const startPart = start || '';
  const endPart = current ? 'Present' : end || '';
  if (!startPart && !endPart) return '';
  if (!startPart) return endPart;
  if (!endPart) return startPart;
  return `${startPart} – ${endPart}`;
}

function ContactLine({ content }: { content: ResumeContent }) {
  const { personalInfo: pi } = content;
  const links = [
    pi.email,
    pi.phone,
    pi.location,
    pi.linkedin,
    pi.github,
    pi.portfolio,
  ].filter(Boolean);

  return (
    <p className="contact-line mt-1 flex flex-wrap justify-center gap-x-2 gap-y-0.5 text-sm opacity-80">
      {links.map((item, i) => (
        <span key={`${item}-${i}`}>
          {i > 0 && <span className="mx-1 opacity-50">·</span>}
          {item}
        </span>
      ))}
    </p>
  );
}

function SectionHeading({
  title,
  templateId,
}: {
  title: string;
  templateId: string;
}) {
  const styles: Record<string, string> = {
    modern: 'border-b-2 border-brand-600 pb-1 text-sm font-bold uppercase tracking-wider text-brand-700',
    classic:
      'border-b border-gray-400 pb-0.5 text-center text-sm font-semibold uppercase tracking-[0.2em]',
    'ats-minimal': 'text-sm font-bold uppercase',
    tech: 'font-mono text-xs font-bold uppercase tracking-widest text-emerald-700',
    compact: 'text-xs font-bold uppercase tracking-wide text-gray-700',
  };

  return <h3 className={cn('section-heading mb-2', styles[templateId] ?? styles.modern)}>{title}</h3>;
}

function renderSection(
  sectionId: Exclude<ResumeSectionId, 'personalInfo'>,
  content: ResumeContent,
  templateId: string
) {
  switch (sectionId) {
    case 'summary':
      if (!content.summary.trim()) return null;
      return (
        <section key={sectionId} className="resume-section mb-4">
          <SectionHeading title={SECTION_TITLES.summary} templateId={templateId} />
          <p className="text-sm leading-relaxed">{content.summary}</p>
        </section>
      );

    case 'education':
      if (content.education.length === 0) return null;
      return (
        <section key={sectionId} className="resume-section mb-4">
          <SectionHeading title={SECTION_TITLES.education} templateId={templateId} />
          <div className="space-y-3">
            {content.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">{edu.school || 'Institution'}</p>
                  <p className="text-xs opacity-70">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </p>
                </div>
                <p className="text-sm">
                  {[edu.degree, edu.field].filter(Boolean).join(' in ') || 'Degree'}
                  {edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                </p>
                {edu.highlights.filter(Boolean).length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {edu.highlights.filter(Boolean).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      );

    case 'experience':
      if (content.experience.length === 0) return null;
      return (
        <section key={sectionId} className="resume-section mb-4">
          <SectionHeading title={SECTION_TITLES.experience} templateId={templateId} />
          <div className="space-y-3">
            {content.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">{exp.title || 'Role'}</p>
                  <p className="text-xs opacity-70">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </p>
                </div>
                <p className="text-sm">
                  {[exp.company, exp.location].filter(Boolean).join(' · ')}
                </p>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      );

    case 'skills':
      if (content.skills.length === 0) return null;
      return (
        <section key={sectionId} className="resume-section mb-4">
          <SectionHeading title={SECTION_TITLES.skills} templateId={templateId} />
          {templateId === 'tech' ? (
            <div className="flex flex-wrap gap-1.5">
              {content.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm">{content.skills.join(' · ')}</p>
          )}
        </section>
      );

    case 'projects':
      if (content.projects.length === 0) return null;
      return (
        <section key={sectionId} className="resume-section mb-4">
          <SectionHeading title={SECTION_TITLES.projects} templateId={templateId} />
          <div className="space-y-3">
            {content.projects.map((proj) => (
              <div key={proj.id}>
                <p className="font-semibold">
                  {proj.name || 'Project'}
                  {proj.url ? (
                    <span className="ml-2 text-xs font-normal opacity-70">{proj.url}</span>
                  ) : null}
                </p>
                {proj.description && <p className="text-sm">{proj.description}</p>}
                {proj.technologies.length > 0 && (
                  <p className="mt-0.5 text-xs opacity-70">{proj.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      );

    case 'certifications':
      if (content.certifications.length === 0) return null;
      return (
        <section key={sectionId} className="resume-section mb-4">
          <SectionHeading title={SECTION_TITLES.certifications} templateId={templateId} />
          <ul className="space-y-1 text-sm">
            {content.certifications.map((cert) => (
              <li key={cert.id}>
                <span className="font-medium">{cert.name}</span>
                {[cert.issuer, cert.date].filter(Boolean).length > 0 && (
                  <span className="opacity-70">
                    {' '}
                    — {[cert.issuer, cert.date].filter(Boolean).join(', ')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      );

    case 'achievements':
      if (content.achievements.length === 0) return null;
      return (
        <section key={sectionId} className="resume-section mb-4">
          <SectionHeading title={SECTION_TITLES.achievements} templateId={templateId} />
          <ul className="space-y-2 text-sm">
            {content.achievements.map((ach) => (
              <li key={ach.id}>
                <span className="font-medium">{ach.title}</span>
                {ach.description && (
                  <span className="opacity-80"> — {ach.description}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      );

    case 'languages':
      if (content.languages.length === 0) return null;
      return (
        <section key={sectionId} className="resume-section mb-4">
          <SectionHeading title={SECTION_TITLES.languages} templateId={templateId} />
          <p className="text-sm">
            {content.languages
              .map((lang) =>
                lang.proficiency ? `${lang.name} (${lang.proficiency})` : lang.name
              )
              .join(' · ')}
          </p>
        </section>
      );

    default:
      return null;
  }
}

const TEMPLATE_WRAPPER: Record<string, string> = {
  modern: 'font-sans text-gray-900',
  classic: 'font-serif text-gray-900',
  'ats-minimal': 'font-sans text-black',
  tech: 'font-sans text-gray-900',
  compact: 'font-sans text-gray-900 text-[13px] leading-snug',
};

const TEMPLATE_HEADER: Record<string, string> = {
  modern: 'border-b-4 border-brand-600 pb-4 text-center',
  classic: 'border-b border-gray-500 pb-3 text-center',
  'ats-minimal': 'border-b border-black pb-2 text-left',
  tech: 'border-b-2 border-emerald-600 pb-3',
  compact: 'border-b border-gray-400 pb-2 text-center',
};

const TEMPLATE_NAME: Record<string, string> = {
  modern: 'text-2xl font-bold tracking-tight text-brand-800',
  classic: 'text-2xl font-bold',
  'ats-minimal': 'text-xl font-bold',
  tech: 'font-mono text-2xl font-bold text-emerald-800',
  compact: 'text-lg font-bold',
};

export function ResumePreview({ content, templateId, className, id }: ResumePreviewProps) {
  const tid = TEMPLATE_WRAPPER[templateId] ? templateId : 'modern';
  const name = content.personalInfo.fullName || 'Your Name';
  const bodySections = content.sectionOrder.filter(
    (s): s is Exclude<ResumeSectionId, 'personalInfo'> => s !== 'personalInfo'
  );

  const orderedSections =
    tid === 'tech'
      ? [
          ...bodySections.filter((s) => s === 'skills'),
          ...bodySections.filter((s) => s !== 'skills'),
        ]
      : bodySections;

  const isEmpty =
    !content.personalInfo.fullName &&
    !content.summary &&
    content.education.length === 0 &&
    content.experience.length === 0 &&
    content.skills.length === 0;

  return (
    <div
      id={id}
      className={cn(
        'resume-preview mx-auto w-full max-w-[210mm] bg-white p-8 text-black shadow-sm print:shadow-none print:p-0',
        TEMPLATE_WRAPPER[tid],
        tid === 'compact' && 'p-6',
        tid === 'ats-minimal' && 'p-6 font-normal',
        className
      )}
    >
      <header className={cn('resume-header mb-5', TEMPLATE_HEADER[tid])}>
        <h1 className={TEMPLATE_NAME[tid]}>{name}</h1>
        <ContactLine content={content} />
      </header>

      {isEmpty ? (
        <p className="py-12 text-center text-sm text-gray-400">
          Start filling in your details to see a live preview
        </p>
      ) : (
        <div
          className={cn(
            tid === 'modern' && 'space-y-1',
            tid === 'classic' && 'space-y-4',
            tid === 'compact' && 'space-y-2'
          )}
        >
          {orderedSections.map((sectionId) => renderSection(sectionId, content, tid))}
        </div>
      )}

    </div>
  );
}
