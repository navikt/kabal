/** Returns true if all characters of `query` appear in `target` in order. */
export const fuzzyMatch = (target: string, query: string): boolean =>
  internalFuzzyMatch(target.toLowerCase(), query.toLowerCase());

const internalFuzzyMatch = (target: string, query: string): boolean => {
  let targetIndex = 0;

  for (const char of query) {
    const index = target.indexOf(char, targetIndex);

    if (index === -1) {
      return false;
    }

    targetIndex = index + 1;
  }

  return true;
};
