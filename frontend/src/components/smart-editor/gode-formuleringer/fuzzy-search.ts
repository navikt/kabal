import { SplitQuery } from '@app/components/smart-editor/gode-formuleringer/split-query';

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
