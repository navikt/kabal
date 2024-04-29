import { describe, expect, it } from '@jest/globals';
import { GLOBAL, GLOBAL_TYPE, LIST_DELIMITER, SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { lexSpecialis } from '@app/plate/functions/lex-specialis';
import { RichTextTypes } from '@app/types/common-text-types';
import { UtfallEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { IConsumerRichText } from '@app/types/texts/consumer';
import { Language } from '@app/types/texts/language';
import { TemplateSections } from '../template-sections';

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
const { KLAGEVEDTAK_V1 } = TemplateIdEnum;

const GENERIC_TITLE: IConsumerRichText = getText('generic-title', KLAGEVEDTAK_V1, TITLE);
const GENERIC_TITLE_2: IConsumerRichText = getText('generic-title-2', KLAGEVEDTAK_V1, TITLE);
const SPECIFIC_TITLE: IConsumerRichText = getText('specific-title', KLAGEVEDTAK_V1, TITLE, ['y1']);
const MORE_SPECIFIC_TITLE: IConsumerRichText = getText('more-specific-title', KLAGEVEDTAK_V1, TITLE, [
  `y1${LIST_DELIMITER}h1`,
]);

describe('lex specialis', () => {
  it('prioritize specific text', () => {
    expect.assertions(1);

    const actual = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V1,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [],
      [GENERIC_TITLE, SPECIFIC_TITLE, MORE_SPECIFIC_TITLE],
    );
    expect(actual).toBe(MORE_SPECIFIC_TITLE);
  });

  it('prioritize first of equals', () => {
    expect.assertions(1);

    const actual = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V1,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [],
      [GENERIC_TITLE, GENERIC_TITLE_2],
    );
    expect(actual).toBe(GENERIC_TITLE);
  });

  it('returns null if no text', () => {
    expect.assertions(1);

    const actual = lexSpecialis(TemplateIdEnum.KLAGEVEDTAK_V1, TemplateSections.TITLE, 'y1', ['h1'], [], []);
    expect(actual).toBeNull();
  });

  it('template is more worth than ytelse', () => {
    expect.assertions(1);

    const ytelse: IConsumerRichText = getText('ytelse', GLOBAL, TemplateSections.TITLE, ['y1']);
    const template: IConsumerRichText = getText('template', TemplateIdEnum.KLAGEVEDTAK_V1, TemplateSections.TITLE);
    const actual = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V1,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [],
      [ytelse, template],
    );
    expect(actual).toBe(template);
  });

  it('prefer text that has correct utfall', () => {
    expect.assertions(1);

    const correctUtfall: IConsumerRichText = getText(
      'correct-utfall',
      TemplateIdEnum.KLAGEVEDTAK_V1,
      TemplateSections.TITLE,
      [],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD]],
    );
    const tooSpecific: IConsumerRichText = getText(
      'too-specific',
      TemplateIdEnum.KLAGEVEDTAK_V1,
      TemplateSections.TITLE,
      [],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD, UtfallEnum.STADFESTELSE]],
    );
    const actual = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V1,
      TemplateSections.TITLE,
      'y1',
      [],
      [UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD],
      [correctUtfall, tooSpecific],
    );

    expect(actual).toBe(correctUtfall);
  });

  it('utfall, template and ytelse are weighted correctly', () => {
    expect.assertions(1);

    const expected: IConsumerRichText = getText(
      'correct-utfall',
      TemplateIdEnum.KLAGEVEDTAK_V1,
      TemplateSections.TITLE,
      [],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD]],
    );
    const notExpectedOne: IConsumerRichText = getText(
      'too-specific',
      TemplateIdEnum.KLAGEVEDTAK_V1,
      TemplateSections.TITLE,
      [`y1${LIST_DELIMITER}h1`],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD, UtfallEnum.STADFESTELSE]],
    );
    const actual = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V1,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD],
      [notExpectedOne, expected],
    );

    expect(actual).toBe(expected);
  });

  it('template is always most important', () => {
    expect.assertions(1);

    const expected: IConsumerRichText = getText(
      'correct-template',
      TemplateIdEnum.KLAGEVEDTAK_V1,
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
    const actual = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK_V1,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD],
      [notExpectedOne, expected],
    );

    expect(actual).toBe(expected);
  });
});
