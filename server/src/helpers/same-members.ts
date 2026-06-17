/** Compares two Nav-ident lists by membership, ignoring order and duplicates. */
export const sameMembers = (a: string[], b: string[]): boolean => {
  const setA = new Set(a);
  const setB = new Set(b);

  if (setA.size !== setB.size) {
    return false;
  }

  for (const value of setA) {
    if (!setB.has(value)) {
      return false;
    }
  }

  return true;
};
