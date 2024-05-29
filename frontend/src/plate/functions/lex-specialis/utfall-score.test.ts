import { describe, expect, it } from 'bun:test';
import { SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { NEGATIVE_INFINITY } from '@app/plate/functions/lex-specialis/scores';
import { MAX_UTFALL_SCORE, getUtfallScore } from '@app/plate/functions/lex-specialis/utfall-score';
import { UtfallEnum } from '@app/types/kodeverk';

describe('utfall score', () => {
  it('should give max score to text with same utfall (one) as case', () => {
    expect.assertions(1);

    const actual = getUtfallScore([UtfallEnum.MEDHOLD], createUtfallSetList([UtfallEnum.MEDHOLD]));

    expect(actual).toBe(MAX_UTFALL_SCORE);
  });

  it('should give zero score to text with different utfall than case ', () => {
    expect.assertions(1);

    const actual = getUtfallScore([UtfallEnum.MEDHOLD], createUtfallSetList([UtfallEnum.STADFESTELSE]));

    expect(actual).toBe(0);
  });

  it('should give excluding score to text with utfall when case has no utfall', () => {
    expect.assertions(1);

    const actual = getUtfallScore([], createUtfallSetList([UtfallEnum.STADFESTELSE]));

    expect(actual).toBe(NEGATIVE_INFINITY);
  });

  it('should give max score to text with no utfall when case has no utfall', () => {
    expect.assertions(1);

    const actual = getUtfallScore([], createUtfallSetList());

    expect(actual).toBe(MAX_UTFALL_SCORE);
  });

  it('should give excluding score to text with multiple utfall when case has one utfall', () => {
    expect.assertions(1);

    const actual = getUtfallScore(
      [UtfallEnum.MEDHOLD],
      createUtfallSetList([UtfallEnum.MEDHOLD, UtfallEnum.STADFESTELSE]),
    );

    expect(actual).toBe(NEGATIVE_INFINITY);
  });

  it('should give minium score to text with one utfall when case has multiple utfall', () => {
    expect.assertions(1);

    const actual = getUtfallScore(
      [UtfallEnum.MEDHOLD, UtfallEnum.STADFESTELSE, UtfallEnum.AVVIST, UtfallEnum.DELVIS_MEDHOLD, UtfallEnum.HENVIST],
      createUtfallSetList([UtfallEnum.MEDHOLD]),
    );

    expect(actual).toBe(1);
  });

  it('should give medium score to text with one utfall when case has two utfall', () => {
    expect.assertions(1);

    const actual = getUtfallScore(
      [UtfallEnum.MEDHOLD, UtfallEnum.STADFESTELSE],
      createUtfallSetList([UtfallEnum.MEDHOLD]),
    );

    expect(actual).toBe(2);
  });
});

const createUtfallSetList = (...utfallSetList: UtfallEnum[][]) => utfallSetList.map((set) => set.join(SET_DELIMITER));
