export const count = <T>(array: T[] | undefined | null, predicate: (item: T) => boolean): number => {
  if (array === undefined || array === null) {
    return 0;
  }

  let count = 0;

  for (const item of array) {
    if (predicate(item)) {
      count++;
    }
  }

  return count;
};
