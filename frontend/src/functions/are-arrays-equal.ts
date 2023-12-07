/** Checks if two arrays contain the same values. Does not care about order. */
export const areArraysEqual = <T>(array1: T[], array2: T[]) => {
  if (array1.length !== array2.length) {
    return false;
  }

  return array1.every((value) => array2.includes(value));
};
