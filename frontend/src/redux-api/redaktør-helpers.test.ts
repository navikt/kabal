import { describe, expect, it } from 'bun:test';
import { GLOBAL, LIST_DELIMITER, WILDCARD } from '@app/components/smart-editor-texts/types';
import { getListWithGlobal, paramsWithGlobalQueries } from '@app/redux-api/redaktør-helpers';
import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';

describe('getListWithGlobal', () => {
  it('should add global items to list', () => {
    const list = [`some-template${LIST_DELIMITER}some-section`];

    const result = getListWithGlobal(list);
    const expected = [`${GLOBAL}${LIST_DELIMITER}some-section`, `some-template${LIST_DELIMITER}some-section`];

    expect(result).toEqual(expected);
  });

  it('should not do anything if list already contains all global items', () => {
    const list = [
      `${GLOBAL}${LIST_DELIMITER}some-other-section`,
      `${GLOBAL}${LIST_DELIMITER}some-section`,
      `some-other-template${LIST_DELIMITER}some-other-section`,
      `some-template${LIST_DELIMITER}some-section`,
    ];

    expect(getListWithGlobal(list)).toEqual(list);
  });

  it('should add GLOBAL to list if last part if wildcard', () => {
    const list = [`some-template${LIST_DELIMITER}${WILDCARD}`];

    const result = getListWithGlobal(list);

    const expected = [GLOBAL, `some-template${LIST_DELIMITER}${WILDCARD}`];

    expect(result).toEqual(expected);
  });

  it('should not add GLOBAL if GLOBAL is already in list', () => {
    const list = [`some-template${LIST_DELIMITER}${WILDCARD}`, GLOBAL];

    const result = getListWithGlobal(list);

    const expected = [GLOBAL, `some-template${LIST_DELIMITER}${WILDCARD}`];

    expect(result).toEqual(expected);
  });
});

describe('paramsWithGlobalQueries', () => {
  it('should add global sections and hjemler', () => {
    const untouched: Partial<IGetMaltekstseksjonParams> = {
      enhetIdList: ['some-enhet'],
      utfallIdList: 'utfall',
    };

    const params = {
      ...untouched,
      templateSectionIdList: [`some-template${LIST_DELIMITER}some-section`],
      ytelseHjemmelIdList: [`some-ytelse${LIST_DELIMITER}some-hjemmel`],
    };

    const result = paramsWithGlobalQueries(params);

    const expected = {
      ...untouched,
      templateSectionIdList: [`${GLOBAL}${LIST_DELIMITER}some-section`, `some-template${LIST_DELIMITER}some-section`],
      ytelseHjemmelIdList: [`${GLOBAL}${LIST_DELIMITER}some-hjemmel`, `some-ytelse${LIST_DELIMITER}some-hjemmel`],
    };

    expect(result).toEqual(expected);
  });
});
