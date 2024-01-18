export const fuzzySearch = (query: string, text: string): number => {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  if (
    (queryLower.startsWith('"') && queryLower.endsWith('"')) ||
    (queryLower.startsWith("'") && queryLower.endsWith("'"))
  ) {
    const strippedQuery = queryLower.slice(1, -1);
    const index = textLower.indexOf(strippedQuery);

    return index === -1 ? 0 : textLower.length - index;
  }

  // If the query is an exact match, return a high score
  if (queryLower === textLower) {
    return query.length * 4;
  }

  const indexOfQuery = textLower.indexOf(queryLower);

  // If the query is found in the text, return a high score
  if (indexOfQuery !== -1) {
    const factor = indexOfQuery / text.length;
    const distancePenalty = factor * query.length;

    return query.length * 4 - distancePenalty;
  }

  let score = 0;
  let lastIndex = -1;

  for (const char of queryLower) {
    const index = textLower.indexOf(char, lastIndex + 1);

    if (index === -1) {
      // Character not found, continue to the next character
      continue;
    } else if (lastIndex !== -1 && index === lastIndex + 1) {
      // Consecutive character match
      score += 3;
    } else {
      // Non-consecutive character match
      // Increment score by a larger amount if the distance between characters is small
      score += 2 - (index - lastIndex - 1) / text.length;
    }

    lastIndex = index;
  }

  return score;
};
