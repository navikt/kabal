export interface Expression {
  expression: string;
  score: number;
}

export interface SplitQuery {
  expressions: Expression[];
  maxScore: number;
}

const QUERY_REGEX = /((:?"[^"]+")|(:?'[^']+')|\S+)/gi;
export const SPACE_REGEX = /\s+/;

export const WORD_SCORE = 1;
export const EXPRESSION_SCORE_FACTOR = 2;

export const splitQuery = (query: string): SplitQuery => {
  const expressions: Expression[] = [];
  let maxScore = 0;

  if (query.length === 0) {
    return { expressions, maxScore };
  }

  const trimmedQuery = query.trim();

  if (trimmedQuery.length === 0) {
    return { expressions, maxScore };
  }

  const match = trimmedQuery.toLowerCase().match(QUERY_REGEX);

  if (match === null) {
    return { expressions, maxScore };
  }

  for (const m of match) {
    if (m === '""' || m === "''") {
      continue;
    }

    if (isExpression(m)) {
      const expression = m.slice(1, -1); // Remove quotes.
      const score = expression.split(SPACE_REGEX).length * WORD_SCORE * EXPRESSION_SCORE_FACTOR; // Expressions score is double that of words.
      expressions.push({ expression, score });
      maxScore += score;
    } else {
      expressions.push({ expression: m, score: WORD_SCORE });
      maxScore += WORD_SCORE;
    }
  }

  return { expressions, maxScore };
};

const isExpression = (match: string): boolean => {
  if (match.length <= 2) {
    return false;
  }

  if (match.startsWith('"') && match.endsWith('"')) {
    return true;
  }

  return match.startsWith("'") && match.endsWith("'");
};
