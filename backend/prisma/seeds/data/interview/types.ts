export type InterviewDifficulty = 'easy' | 'medium' | 'hard';

export type InterviewQuestionEntry = {
  question: string;
  answer: string;
  difficulty: InterviewDifficulty;
};

export type InterviewTopicBank = {
  topic: string;
  topicSlug: string;
  questions: InterviewQuestionEntry[];
};

export function slugForQuestion(topicSlug: string, index: number, difficulty: InterviewDifficulty): string {
  return `${topicSlug}-interview-q${index + 1}-${difficulty}`;
}
