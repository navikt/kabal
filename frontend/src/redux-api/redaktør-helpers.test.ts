import { describe, expect, it } from 'bun:test';
import { GLOBAL, LIST_DELIMITER } from '@app/components/smart-editor-texts/types';
import { paramsWithGlobalSections } from '@app/redux-api/redaktør-helpers';
import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';

describe('paramsWithGlobalSections', () => {
  it('should add global sections to templateSectionIdList', () => {
    const untouched = {
      enhetIdList: ['enhet'],
      utfallIdList: 'utfall',
    };

    const params: IGetMaltekstseksjonParams = {
      ...untouched,
      templateSectionIdList: [`some-template${LIST_DELIMITER}some-section`],
    };

    const result = paramsWithGlobalSections(params);
    const expected = {
      ...untouched,
      templateSectionIdList: [`${GLOBAL}${LIST_DELIMITER}some-section`, `some-template${LIST_DELIMITER}some-section`],
    };

    expect(result).toEqual(expected);
  });

  it('should not do anything if templateSectionIdList already contains all global templates', () => {
    const params: IGetMaltekstseksjonParams = {
      enhetIdList: ['enhet'],
      utfallIdList: 'utfall',
      templateSectionIdList: [
        `${GLOBAL}${LIST_DELIMITER}some-other-section`,
        `${GLOBAL}${LIST_DELIMITER}some-section`,
        `some-other-template${LIST_DELIMITER}some-other-section`,
        `some-template${LIST_DELIMITER}some-section`,
      ],
    };

    expect(params).toEqual(paramsWithGlobalSections(params));
  });
});
