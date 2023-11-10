import { removeEmptyCharInText } from '@app/functions/remove-empty-char-in-text';

const EMPTY_CHAR_CODE = 8203;
const EMPTY_CHAR = String.fromCharCode(EMPTY_CHAR_CODE); // \u200b

describe('remove empty char in string', () => {
  it('should remove a single empty char from string that contain it', () => {
    expect.assertions(1);

    const actual = removeEmptyCharInText(`test${EMPTY_CHAR}test`);
    expect(actual).toBe('testtest');
  });

  it('should remove multiple empty chars from string that contain it', () => {
    expect.assertions(1);

    const actual = removeEmptyCharInText(`${EMPTY_CHAR}test${EMPTY_CHAR}test${EMPTY_CHAR}`);
    expect(actual).toBe('testtest');
  });

  it('should not change strings that do not contain empty char', () => {
    expect.assertions(1);

    const actual = removeEmptyCharInText(`testtest`);
    expect(actual).toBe('testtest');
  });
});
