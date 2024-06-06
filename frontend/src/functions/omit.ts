export const omit = <T extends object, K extends keyof T>(obj: T, ...props: K[]): Omit<T, K> => {
  const newObj = { ...obj };

  for (const prop of props) {
    delete newObj[prop];
  }

  return newObj;
};
