import { describe, expect, it } from 'bun:test';
import { GLOBAL, type GLOBAL_TYPE, LIST_DELIMITER, SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { LexSpecialisStatus, lexSpecialis } from '@app/plate/functions/lex-specialis/lex-specialis';
import { TemplateSections } from '@app/plate/template-sections';
import { RichTextTypes } from '@app/types/common-text-types';
import { UtfallEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { IConsumerRichText } from '@app/types/texts/consumer';
import { Language } from '@app/types/texts/language';

const getText = (
  id: string,
  templateId: TemplateIdEnum | GLOBAL_TYPE,
  sectionId: TemplateSections,
  ytelseHjemmelList: string[] = [],
  utfallSetList: UtfallEnum[][] = [],
): IConsumerRichText => {
  const title = `${templateId} / ${sectionId}`;

  return {
    title,
    id,
    textType: RichTextTypes.MALTEKST,
    enhetIdList: [],
    utfallIdList: utfallSetList.map((set) => set.join(SET_DELIMITER)),
    richText: [],
    templateSectionIdList: [`${templateId}${LIST_DELIMITER}${sectionId}`],
    ytelseHjemmelIdList: ytelseHjemmelList,
    publishedDateTime: '2023-11-02T13:22:54',
    language: Language.NB,
  };
};

const { TITLE } = TemplateSections;
const { KLAGEVEDTAK_V2 } = TemplateIdEnum;

const GENERIC_TITLE: IConsumerRichText = getText('generic-title', KLAGEVEDTAK_V2, TITLE);
const SPECIFIC_TITLE: IConsumerRichText = getText('specific-title', KLAGEVEDTAK_V2, TITLE, ['y1']);
const MORE_SPECIFIC_TITLE: IConsumerRichText = getText('more-specific-title', KLAGEVEDTAK_V2, TITLE, [
  `y1${LIST_DELIMITER}h1`,
]);

describe('lex specialis', () => {
  it('prioritize specific text', () => {
    expect.assertions(2);

    const [actualStatus, actualResult] = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [],
      [GENERIC_TITLE, SPECIFIC_TITLE, MORE_SPECIFIC_TITLE],
    );
    expect(actualStatus).toBe(LexSpecialisStatus.FOUND);
    expect(actualResult).toBe(MORE_SPECIFIC_TITLE);
  });

  it('should return tie only if there are no unique scores', () => {
    expect.assertions(2);

    const [actualStatus, actualResult] = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [],
      [GENERIC_TITLE, GENERIC_TITLE, SPECIFIC_TITLE, SPECIFIC_TITLE],
    );

    expect(actualStatus).toBe(LexSpecialisStatus.TIE);
    expect(actualResult).toStrictEqual([
      { maltekstseksjon: SPECIFIC_TITLE, score: 22 },
      { maltekstseksjon: SPECIFIC_TITLE, score: 22 },
      { maltekstseksjon: GENERIC_TITLE, score: 20 },
      { maltekstseksjon: GENERIC_TITLE, score: 20 },
    ]);
  });

  it('should fallback to result with unique score if more specific results were ties', () => {
    expect.assertions(2);

    const [actualStatus, actualResult] = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [],
      [MORE_SPECIFIC_TITLE, SPECIFIC_TITLE, GENERIC_TITLE, MORE_SPECIFIC_TITLE, SPECIFIC_TITLE],
    );

    expect(actualStatus).toBe(LexSpecialisStatus.FOUND);
    expect(actualResult).toBe(GENERIC_TITLE);
  });

  it('should fallback to most specific result with unique score if more specific results were ties', () => {
    expect.assertions(2);

    const [actualStatus, actualResult] = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [],
      [MORE_SPECIFIC_TITLE, MORE_SPECIFIC_TITLE, GENERIC_TITLE, SPECIFIC_TITLE],
    );

    expect(actualStatus).toBe(LexSpecialisStatus.FOUND);
    expect(actualResult).toBe(SPECIFIC_TITLE);
  });

  it('no utfall does not match texts with utfall', () => {
    expect.assertions(2);

    const utfallText = getText(
      'no-utfall',
      KLAGEVEDTAK_V2,
      TemplateSections.AVGJOERELSE,
      ['y1'],
      [[UtfallEnum.MEDHOLD]],
    );

    const [actualStatus, actualResult] = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.AVGJOERELSE,
      'y1',
      [],
      [],
      [utfallText],
    );

    expect(actualStatus).toBe(LexSpecialisStatus.NONE);
    expect(actualResult).toBeUndefined();
  });

  it('returns null if no text', () => {
    expect.assertions(2);

    const [actualStatus, actualResult] = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [],
      [],
    );
    expect(actualStatus).toBe(LexSpecialisStatus.NONE);
    expect(actualResult).toBeUndefined();
  });

  it('template is more worth than ytelse', () => {
    expect.assertions(2);

    const ytelse: IConsumerRichText = getText('ytelse', GLOBAL, TemplateSections.TITLE, ['y1'], [[UtfallEnum.MEDHOLD]]);
    const template: IConsumerRichText = getText('template', TemplateIdEnum.KLAGEVEDTAK_V2, TemplateSections.TITLE);
    const [actualStatus, actualResult] = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [UtfallEnum.MEDHOLD],
      [ytelse, template],
    );
    expect(actualStatus).toBe(LexSpecialisStatus.FOUND);
    expect(actualResult).toBe(template);
  });

  it('prefer text that has correct utfall', () => {
    expect.assertions(2);

    const correctUtfall: IConsumerRichText = getText(
      'correct-utfall',
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      ['y1'],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD]],
    );
    const tooSpecific: IConsumerRichText = getText(
      'too-specific',
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      ['y1'],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD, UtfallEnum.STADFESTELSE]],
    );
    const [actualStatus, actualResult] = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      'y1',
      [],
      [UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD],
      [correctUtfall, tooSpecific],
    );

    expect(actualStatus).toBe(LexSpecialisStatus.FOUND);
    expect(actualResult).toBe(correctUtfall);
  });

  it('utfall, template and ytelse are weighted correctly', () => {
    expect.assertions(2);

    const expected: IConsumerRichText = getText(
      'correct-utfall',
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      [],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD]],
    );
    const notExpectedOne: IConsumerRichText = getText(
      'too-specific',
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      [`y1${LIST_DELIMITER}h1`],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD, UtfallEnum.STADFESTELSE]],
    );
    const [actualStatus, actualResult] = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD],
      [notExpectedOne, expected],
    );

    expect(actualStatus).toBe(LexSpecialisStatus.FOUND);
    expect(actualResult).toBe(expected);
  });

  it('template is always most important', () => {
    expect.assertions(2);

    const expected: IConsumerRichText = getText(
      'correct-template',
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      [],
      [],
    );
    const notExpectedOne: IConsumerRichText = getText(
      'not-specific-enough-template',
      GLOBAL,
      TemplateSections.TITLE,
      [`y1${LIST_DELIMITER}h1`],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD]],
    );
    const [actualStatus, actualResult] = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V2,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD],
      [notExpectedOne, expected],
    );

    expect(actualStatus).toBe(LexSpecialisStatus.FOUND);
    expect(actualResult).toBe(expected);
  });
});
