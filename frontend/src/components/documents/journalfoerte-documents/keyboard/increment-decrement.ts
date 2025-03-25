export const increment = (prev: number, amount: number, max: number, overflow = max) => {
  if (prev === -1) {
    return 0;
  }

  if (prev + amount > max - 1) {
    return overflow;
  }

  return prev + amount;
};

export const decrement = (prev: number, amount: number, min = 0, overflow = min) => {
  if (prev - amount < min) {
    return overflow;
  }

  return prev - amount;
};

export const getLastIndex = <T>(list: T[] | undefined): number => {
  if (list === undefined) {
    return -1;
  }

  return list.length - 1;
};
