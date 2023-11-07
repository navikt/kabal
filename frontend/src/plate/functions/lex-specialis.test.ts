import { GLOBAL, GLOBAL_TYPE, LIST_DELIMITER, SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { lexSpecialis } from '@app/plate/functions/lex-specialis';
import { RichTextTypes } from '@app/types/common-text-types';
import { UtfallEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { IPublishedRichText } from '@app/types/texts/responses';
import { TemplateSections } from '../template-sections';

const getText = (
  id: string,
  templateId: TemplateIdEnum | GLOBAL_TYPE,
  sectionId: TemplateSections,
  ytelseHjemmelList: string[] = [],
  utfallSetList: UtfallEnum[][] = [],
): IPublishedRichText => {
  const title = `${templateId} / ${sectionId}`;

  return {
    title,
    id,
    created: '',
    modified: '',
    textType: RichTextTypes.MALTEKST,
    enhetIdList: [],
    utfallIdList: utfallSetList.map((set) => set.join(SET_DELIMITER)),
    content: [],
    templateSectionIdList: [`${templateId}${LIST_DELIMITER}${sectionId}`],
    ytelseHjemmelIdList: ytelseHjemmelList,
    editors: [],
    published: false,
    publishedBy: '',
    publishedDateTime: '2023-11-02T13:22:54',
    versionId: '',
    draftMaltekstseksjonIdList: [],
    publishedMaltekstseksjonIdList: [],
  };
};

const GENERIC_TITLE: IPublishedRichText = getText(
  'generic-title',
  TemplateIdEnum.KLAGEVEDTAK_V1,
  TemplateSections.TITLE,
);
const GENERIC_TITLE_2: IPublishedRichText = getText(
  'generic-title-2',
  TemplateIdEnum.KLAGEVEDTAK_V1,
  TemplateSections.TITLE,
);
const SPECIFIC_TITLE: IPublishedRichText = getText(
  'specific-title',
  TemplateIdEnum.KLAGEVEDTAK_V1,
  TemplateSections.TITLE,
  ['y1'],
);
const MORE_SPECIFIC_TITLE: IPublishedRichText = getText(
  'more-specific-title',
  TemplateIdEnum.KLAGEVEDTAK_V1,
  TemplateSections.TITLE,
  [`y1${LIST_DELIMITER}h1`],
);

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

    const ytelse: IPublishedRichText = getText('ytelse', GLOBAL, TemplateSections.TITLE, ['y1']);
    const template: IPublishedRichText = getText('template', TemplateIdEnum.KLAGEVEDTAK_V1, TemplateSections.TITLE);
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

    const correctUtfall: IPublishedRichText = getText(
      'correct-utfall',
      TemplateIdEnum.KLAGEVEDTAK_V1,
      TemplateSections.TITLE,
      [],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD]],
    );
    const tooSpecific: IPublishedRichText = getText(
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

    const expected: IPublishedRichText = getText(
      'correct-utfall',
      TemplateIdEnum.KLAGEVEDTAK_V1,
      TemplateSections.TITLE,
      [],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD]],
    );
    const notExpectedOne: IPublishedRichText = getText(
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

    const expected: IPublishedRichText = getText(
      'correct-template',
      TemplateIdEnum.KLAGEVEDTAK_V1,
      TemplateSections.TITLE,
      [],
      [],
    );
    const notExpectedOne: IPublishedRichText = getText(
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
