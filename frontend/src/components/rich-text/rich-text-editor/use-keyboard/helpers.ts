const CHARACTERS: string[] = 'abcdefghijklmnopqrstuvwxyzæøåABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ0123456789'.split('');

export const getTrailingSpaces = (str: string): number => {
  let number = 0;

  for (let i = str.length - 1; i >= 0; i--) {
    if (CHARACTERS.includes(str[i] ?? '')) {
      number++;
    } else {
      break;
    }
  }

  return number;
};

export const getTrailingCharacters = (str: string): number => {
  let number = 0;

  for (let i = str.length - 1; i >= 0; i--) {
    if (!CHARACTERS.includes(str[i] ?? '')) {
      number++;
    } else {
      break;
    }
  }

  return number;
};

export const getLeadingSpaces = (str: string): number => {
  let number = 0;

  for (let i = 0; i < str.length; i++) {
    if (CHARACTERS.includes(str[i] ?? '')) {
      number++;
    } else {
      break;
    }
  }

  return number;
};

export const getLeadingCharacters = (str: string): number => {
  let number = 0;

  for (let i = 0; i < str.length; i++) {
    if (!CHARACTERS.includes(str[i] ?? '')) {
      number++;
    } else {
      break;
    }
  }

  return number;
};
