export const EMPTY_CHAR_CODE = 8203;
export const EMPTY_CHAR = String.fromCharCode(EMPTY_CHAR_CODE);
const REMOVE_REGEX = new RegExp(EMPTY_CHAR, 'g');

export const removeEmptyCharInText = (text: string): string => text.replace(REMOVE_REGEX, '');
