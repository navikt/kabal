export const optionsMatch = <T>(a: T | null, b: T | null, vk: (o: T) => string): boolean => {
  if (a === null) {
    return b === null;
  }

  if (b === null) {
    return false;
  }

  return vk(a) === vk(b);
};
