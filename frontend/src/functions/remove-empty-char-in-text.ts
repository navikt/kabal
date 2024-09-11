const EMPTY_CHAR_CODE = 8203;
const REMOVE_REGEX = new RegExp(String.fromCharCode(EMPTY_CHAR_CODE), 'g');

export const removeEmptyCharInText = (text: string): string => text.replace(REMOVE_REGEX, '');
