import { sortWithOrdinals } from '@app/functions/sort-with-ordinals/sort-with-ordinals';

const sortStrings = (texts: string[]) => texts.sort((a, b) => sortWithOrdinals(a, b));

describe('sortWithOrdinals', () => {
  it('should sort numbers before ordinals', () => {
    expect.assertions(1);

    const hjemmel = 'Ftrl § 1-1';
    const hjemmelLedd = 'Ftrl § 1-1 første ledd';
    const hjemmelDate = 'Ftrl § 1-1 1. januar 2020';

    const actual = sortStrings([hjemmelLedd, hjemmelDate, hjemmel]);
    expect(actual).toStrictEqual([hjemmel, hjemmelDate, hjemmelLedd]);
  });

  it('should sort mathematically if strings differ by number', () => {
    expect.assertions(1);

    const a = 'Ftrl 1';
    const b = 'Ftrl 2';
    const c = 'Ftrl 9';
    const d = 'Ftrl 10';

    expect(sortStrings([c, b, d, a])).toStrictEqual([a, b, c, d]);
  });

  it('should sort alphabetically if strings does not contain numbers', () => {
    expect.assertions(1);

    const a = 'a';
    const b = 'b';
    const c = 'c';

    expect(sortStrings([c, b, a])).toStrictEqual([a, b, c]);
  });

  it('should prioritize shortest string if one string starts with the other one', () => {
    expect.assertions(1);

    const a = 'a';
    const ab = 'ab';
    const abc = 'abc';

    expect(sortStrings([ab, abc, a])).toStrictEqual([a, ab, abc]);
  });

  it('should sort strings with ordinals', () => {
    expect.assertions(1);

    const første = 'første';
    const andre = 'andre';
    const tiende = 'tiende';
    const nittende = 'nittende';
    const tyvende = 'tyvende';

    const actual = sortStrings([tiende, nittende, første, tyvende, andre]);

    expect(actual).toStrictEqual([første, andre, tiende, nittende, tyvende]);
  });

  it('should sort strings with month ordinals', () => {
    expect.assertions(1);

    const jan = 'jan';
    const feb = 'feb';
    const jul = 'jul';
    const nov = 'nov';
    const des = 'des';

    const actual = sortStrings([des, jul, feb, jan, nov]);

    expect(actual).toStrictEqual([jan, feb, jul, nov, des]);
  });

  it('should sort numbers before text', () => {
    expect.assertions(1);

    const a = 'abc123';
    const b = 'abcdef';
    const c = 'abcd12';

    expect(sortStrings([c, b, a])).toStrictEqual([a, c, b]);
  });

  it('should ignore parentheses', () => {
    expect.assertions(1);

    const a = '1';
    const b = '(2)';
    const c = '3';

    expect(sortStrings([c, b, a])).toStrictEqual([a, b, c]);
  });
});
