import { GLOBAL, GLOBAL_TYPE, LIST_DELIMITER, SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { lexSpecialis } from '@app/plate/functions/lex-specialis';
import { UtfallEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { IRichText, RichTextTypes } from '@app/types/texts/texts';
import { TemplateSections } from '../template-sections';

const getText = (
  id: string,
  templateId: TemplateIdEnum | GLOBAL_TYPE,
  sectionId: TemplateSections,
  ytelseHjemmelList: string[] = [],
  utfallSetList: UtfallEnum[][] = [],
): IRichText => {
  const title = `${templateId} / ${sectionId}`;

  return {
    title,
    id,
    created: '',
    modified: '',
    textType: RichTextTypes.MALTEKST,
    enheter: [],
    utfall: utfallSetList.map((set) => set.join(SET_DELIMITER)),
    hjemler: [],
    sections: [],
    templates: [],
    ytelser: [],
    content: [],
    templateSectionList: [`${templateId}${LIST_DELIMITER}${sectionId}`],
    ytelseHjemmelList,
  };
};

const GENERIC_TITLE: IRichText = getText('generic-title', TemplateIdEnum.KLAGEVEDTAK, TemplateSections.TITLE);
const GENERIC_TITLE_2: IRichText = getText('generic-title-2', TemplateIdEnum.KLAGEVEDTAK, TemplateSections.TITLE);
const SPECIFIC_TITLE: IRichText = getText('specific-title', TemplateIdEnum.KLAGEVEDTAK, TemplateSections.TITLE, ['y1']);
const MORE_SPECIFIC_TITLE: IRichText = getText(
  'more-specific-title',
  TemplateIdEnum.KLAGEVEDTAK,
  TemplateSections.TITLE,
  [`y1${LIST_DELIMITER}h1`],
);

describe('lex specialis', () => {
  it('prioritize specific text', () => {
    expect.assertions(1);

    const actual = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK,
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
      TemplateIdEnum.KLAGEVEDTAK,
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

    const actual = lexSpecialis(TemplateIdEnum.KLAGEVEDTAK, TemplateSections.TITLE, 'y1', ['h1'], [], []);
    expect(actual).toBeNull();
  });

  it('template is more worth than ytelse', () => {
    expect.assertions(1);

    const ytelse: IRichText = getText('ytelse', GLOBAL, TemplateSections.TITLE, ['y1']);
    const template: IRichText = getText('template', TemplateIdEnum.KLAGEVEDTAK, TemplateSections.TITLE);

    const actual = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK,
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

    const correctUtfall: IRichText = getText(
      'correct-utfall',
      TemplateIdEnum.KLAGEVEDTAK,
      TemplateSections.TITLE,
      [],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD]],
    );

    const tooSpecific: IRichText = getText(
      'too-specific',
      TemplateIdEnum.KLAGEVEDTAK,
      TemplateSections.TITLE,
      [],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD, UtfallEnum.STADFESTELSE]],
    );

    const actual = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK,
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

    const expected: IRichText = getText(
      'correct-utfall',
      TemplateIdEnum.KLAGEVEDTAK,
      TemplateSections.TITLE,
      [],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD]],
    );

    const notExpectedOne: IRichText = getText(
      'too-specific',
      TemplateIdEnum.KLAGEVEDTAK,
      TemplateSections.TITLE,
      [`y1${LIST_DELIMITER}h1`],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD, UtfallEnum.STADFESTELSE]],
    );

    const actual = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK,
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

    const expected: IRichText = getText('correct-template', TemplateIdEnum.KLAGEVEDTAK, TemplateSections.TITLE, [], []);

    const notExpectedOne: IRichText = getText(
      'not-specific-enough-template',
      GLOBAL,
      TemplateSections.TITLE,
      [`y1${LIST_DELIMITER}h1`],
      [[UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD]],
    );

    const actual = lexSpecialis(
      TemplateIdEnum.KLAGEVEDTAK,
      TemplateSections.TITLE,
      'y1',
      ['h1'],
      [UtfallEnum.MEDHOLD, UtfallEnum.DELVIS_MEDHOLD],
      [notExpectedOne, expected],
    );

    expect(actual).toBe(expected);
  });
});
