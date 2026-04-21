import { describe, expect, it } from 'bun:test';
import { EMPTY_CHAR_CODE, removeEmptyCharInText } from '@/functions/remove-empty-char-in-text';

const EMPTY_CHAR = String.fromCharCode(EMPTY_CHAR_CODE);

describe('removeEmptyCharInText', () => {
  it('should remove a single zero-width space', () => {
    expect(removeEmptyCharInText(`test${EMPTY_CHAR}test`)).toBe('testtest');
  });

  it('should remove multiple zero-width spaces', () => {
    expect(removeEmptyCharInText(`${EMPTY_CHAR}test${EMPTY_CHAR}test${EMPTY_CHAR}`)).toBe('testtest');
  });

  it('should not modify text without zero-width spaces', () => {
    expect(removeEmptyCharInText('testtest')).toBe('testtest');
  });

  it('should handle empty string', () => {
    expect(removeEmptyCharInText('')).toBe('');
  });

  it('should handle string of only zero-width spaces', () => {
    expect(removeEmptyCharInText(`${EMPTY_CHAR}${EMPTY_CHAR}${EMPTY_CHAR}`)).toBe('');
  });
});
