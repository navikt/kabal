import { describe, expect, it } from '@jest/globals';
import { isValidOrgnr } from './orgnr';

describe('org.nr', () => {
  it('should validate 000000000', () => {
    expect.assertions(1);

    const actual = isValidOrgnr('000000000');
    expect(actual).toBe(true);
  });

  it('should validate 111111111', () => {
    expect.assertions(1);

    const actual = isValidOrgnr('111111111');
    expect(actual).toBe(true);
  });

  it('should validate 222222222', () => {
    expect.assertions(1);

    const actual = isValidOrgnr('222222222');
    expect(actual).toBe(true);
  });

  it('should validate 999999999', () => {
    expect.assertions(1);

    const actual = isValidOrgnr('999999999');
    expect(actual).toBe(true);
  });

  it('should validate 987987987', () => {
    expect.assertions(1);

    const actual = isValidOrgnr('987987987');
    expect(actual).toBe(true);
  });

  it('should not validate 123456789', () => {
    expect.assertions(1);

    const actual = isValidOrgnr('123456789');
    expect(actual).toBe(false);
  });
});
