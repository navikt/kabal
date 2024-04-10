// If there is no previous word, we can assume that the current word is the start of a sentence.
// If the previous word ends with a sentence-ending punctuation mark, we can assume that the current word is the start of a sentence.
export const autoCapitalise = (text: string, previous: string | undefined) => {
  if (
    previous === undefined ||
    previous.endsWith('.') ||
    previous.endsWith('!') ||
    previous.endsWith('?') ||
    previous.endsWith(':') ||
    previous.endsWith(';')
  ) {
    return capitaliseWord(text);
  }

  return text;
};

export const capitaliseWord = (text: string) => text.charAt(0).toUpperCase() + text.substring(1);
