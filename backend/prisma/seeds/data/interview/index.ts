import type { InterviewTopicBank } from './types';
import { JAVA_BANK } from './java';
import { PYTHON_BANK } from './python';
import { SQL_BANK } from './sql';
import { JAVASCRIPT_BANK } from './javascript';
import { REACT_BANK } from './react';
import { NODEJS_BANK } from './nodejs';
import { SYSTEM_DESIGN_BANK } from './system-design';
import { HR_BANK } from './hr';
import { BEHAVIORAL_BANK } from './behavioral';
import { DSA_BANK } from './dsa';

export const INTERVIEW_TOPIC_BANKS: InterviewTopicBank[] = [
  JAVA_BANK,
  PYTHON_BANK,
  SQL_BANK,
  JAVASCRIPT_BANK,
  REACT_BANK,
  NODEJS_BANK,
  SYSTEM_DESIGN_BANK,
  HR_BANK,
  BEHAVIORAL_BANK,
  DSA_BANK,
];

export type { InterviewDifficulty, InterviewQuestionEntry, InterviewTopicBank } from './types';
export { slugForQuestion } from './types';
