import { SplitQuery } from '@app/components/smart-editor/gode-formuleringer/split-query';

/**
 * Fuzzy search for a text.
 * @param query The query to search for.
 * @param text The text to search in.
 * @returns The score of the text. A number between 0 and 100. 0 means no match, 100 means perfect match.
 */
export const fuzzySearch = (query: SplitQuery, text: string): number => {
  const textLower = text.toLowerCase();

  const { expressions, maxScore } = query;

  if (maxScore === 0) {
    return 0;
  }

  let queryScore = 0;

  for (const { expression, score } of expressions) {
    if (textLower.includes(expression)) {
      queryScore += score;
    }
  }

  return (queryScore / maxScore) * 100;
};
