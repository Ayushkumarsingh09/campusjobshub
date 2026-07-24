import { ROLE_CAREERS } from './recommendation-engine';

// Re-export role skills map for skill gap
const TARGET_ROLE_SKILLS: Record<string, string[]> = Object.fromEntries(
  Object.entries({
    'Software Engineer': ROLE_CAREERS['software engineer'].skills,
    'Frontend Developer': ROLE_CAREERS['frontend developer'].skills,
    'Data Scientist': ROLE_CAREERS['data scientist'].skills,
    'DevOps Engineer': ROLE_CAREERS['devops engineer'].skills,
    'Product Analyst': ROLE_CAREERS['product analyst'].skills,
    'Backend Developer': ['java', 'spring boot', 'sql', 'rest api', 'microservices', 'docker', 'git'],
    'Full Stack Developer': ['javascript', 'react', 'node.js', 'sql', 'mongodb', 'git', 'typescript'],
    'Mobile Developer': ['kotlin', 'swift', 'flutter', 'react native', 'firebase', 'git'],
    'QA Engineer': ['manual testing', 'selenium', 'api testing', 'sql', 'jira', 'test cases'],
    'Cloud Engineer': ['aws', 'azure', 'linux', 'networking', 'terraform', 'docker', 'kubernetes'],
  })
);

const ROLE_ROADMAP_MAP: Record<string, string[]> = {
  'Software Engineer': ['dsa-placement-roadmap', 'java-backend-roadmap', 'full-stack-developer-roadmap'],
  'Frontend Developer': ['frontend-developer-roadmap', 'javascript-mastery-roadmap'],
  'Data Scientist': ['data-science-career-roadmap', 'python-for-data-science-roadmap', 'ai-ml-engineer-roadmap'],
  'DevOps Engineer': ['devops-engineer-roadmap', 'cloud-engineer-aws-roadmap'],
  'Backend Developer': ['java-backend-roadmap', 'nodejs-backend-roadmap'],
  'Full Stack Developer': ['full-stack-developer-roadmap', 'react-developer-roadmap'],
};

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function hasSkill(current: string[], target: string): boolean {
  const t = normalize(target);
  return current.some((c) => {
    const n = normalize(c);
    return n.includes(t) || t.includes(n);
  });
}

export interface SkillGapResult {
  targetRole: string;
  currentSkills: string[];
  targetSkills: string[];
  missingSkills: string[];
  matchPercent: number;
  learningPlan: { week: number; focus: string; resources: string[] }[];
  roadmapSlugs: string[];
}

export function analyzeSkillGap(targetRole: string, currentSkills: string[]): SkillGapResult {
  const targetSkills =
    TARGET_ROLE_SKILLS[targetRole] ??
    TARGET_ROLE_SKILLS['Software Engineer'];

  const missingSkills = targetSkills.filter((s) => !hasSkill(currentSkills, s));
  const matched = targetSkills.length - missingSkills.length;
  const matchPercent = Math.round((matched / targetSkills.length) * 100);

  const learningPlan: SkillGapResult['learningPlan'] = [];
  const chunks = missingSkills.length
    ? missingSkills
    : ['Advanced system design', 'Open source contribution'];

  for (let i = 0; i < Math.min(chunks.length, 4); i++) {
    learningPlan.push({
      week: i + 1,
      focus: chunks[i]!,
      resources: [
        `CampusJobsHub interview questions for ${chunks[i]}`,
        `Practice on LeetCode/HackerRank tagged with ${chunks[i]}`,
        `Complete related roadmap step on CampusJobsHub`,
      ],
    });
  }

  return {
    targetRole,
    currentSkills,
    targetSkills,
    missingSkills,
    matchPercent,
    learningPlan,
    roadmapSlugs: ROLE_ROADMAP_MAP[targetRole] ?? ['dsa-placement-roadmap'],
  };
}

export const AVAILABLE_TARGET_ROLES = Object.keys(TARGET_ROLE_SKILLS);
