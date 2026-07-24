import type { CoverLetterStyle } from '@prisma/client';
import type { ResumeContent } from './resume-types';

export function generateCoverLetter(input: {
  style: CoverLetterStyle;
  resume: ResumeContent;
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  candidateName?: string;
}): string {
  const name = input.candidateName ?? input.resume.personalInfo.fullName ?? 'Candidate';
  const skills = input.resume.skills.slice(0, 5).join(', ');
  const edu = input.resume.education[0];
  const eduLine = edu ? `${edu.degree} in ${edu.field} from ${edu.school}` : 'my academic program';
  const exp = input.resume.experience[0];
  const expLine = exp
    ? `At ${exp.company}, I contributed as ${exp.title}, where ${exp.bullets[0] ?? 'I delivered measurable results on key projects'}.`
    : 'Through academic projects and internships, I have built practical experience aligned with this role.';

  const jdSnippet = input.jobDescription
    ? input.jobDescription.slice(0, 200).replace(/\s+/g, ' ').trim()
    : `the ${input.jobTitle} responsibilities`;

  const openings: Record<CoverLetterStyle, string> = {
    professional: `Dear Hiring Manager,\n\nI am writing to express my interest in the ${input.jobTitle} position at ${input.companyName}. With a background in ${eduLine}, I am eager to contribute to your team.`,
    enthusiastic: `Dear ${input.companyName} Team,\n\nI am excited to apply for the ${input.jobTitle} role! ${input.companyName}'s reputation for innovation aligns perfectly with my career goals as a campus graduate.`,
    concise: `Dear Hiring Manager,\n\nI am applying for ${input.jobTitle} at ${input.companyName}. My skills in ${skills || 'relevant technologies'} match your requirements.`,
    storytelling: `Dear Hiring Manager,\n\nWhen I first explored ${input.companyName}'s work in campus recruitment circles, I knew I wanted to build my career here. The ${input.jobTitle} role is the natural next step after ${eduLine}.`,
  };

  const body: Record<CoverLetterStyle, string> = {
    professional: `${expLine}\n\nMy technical strengths include ${skills || 'problem solving, collaboration, and quick learning'}. I have studied your requirements around ${jdSnippet} and believe my project work demonstrates readiness for campus-to-corporate transition.\n\nI would welcome the opportunity to discuss how I can add value to ${input.companyName}. Thank you for your consideration.`,
    enthusiastic: `What draws me to this role is the chance to apply ${skills || 'my technical toolkit'} on real-world challenges. ${expLine}\n\nI am motivated, coachable, and prepared to exceed expectations in ${input.jobTitle}. I would love to bring my energy to ${input.companyName}!`,
    concise: `${expLine}\n\nI am available for interviews at your convenience and can relocate if required.\n\nThank you.`,
    storytelling: `During my final year, I focused on ${skills || 'building strong fundamentals'} because I wanted to solve problems at scale — exactly what this role demands. ${expLine}\n\nJoining ${input.companyName} would let me grow while contributing from day one. I appreciate your time and consideration.`,
  };

  return `${openings[input.style]}\n\n${body[input.style]}\n\nSincerely,\n${name}\n${input.resume.personalInfo.email}\n${input.resume.personalInfo.phone}`;
}
