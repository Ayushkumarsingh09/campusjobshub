import type { FaqItem } from './types';

export function parseFaq(raw: unknown): FaqItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is FaqItem => {
      return (
        typeof item === 'object' &&
        item !== null &&
        'question' in item &&
        'answer' in item &&
        typeof (item as FaqItem).question === 'string' &&
        typeof (item as FaqItem).answer === 'string'
      );
    })
    .map((item) => ({
      question: item.question,
      answer: item.answer,
    }));
}
