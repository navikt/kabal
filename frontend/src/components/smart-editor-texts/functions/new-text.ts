import { createSimpleParagraph } from '@app/plate/templates/helpers';
import {
  GOD_FORMULERING_TYPE,
  ITextBaseMetadata,
  PlainTextTypes,
  REGELVERK_TYPE,
  RichTextTypes,
} from '@app/types/common-text-types';
import { INewGodFormuleringParams, INewRegelverkParams } from '@app/types/texts/common';
import { Language, UNTRANSLATED } from '@app/types/texts/language';
import { INewPlainTextParams, INewRichTextParams } from '@app/types/texts/params';

const getMetadata = (): ITextBaseMetadata => ({
  templateSectionIdList: [],
  ytelseHjemmelIdList: [],
  utfallIdList: [],
  enhetIdList: [],
  title: '',
});

export const getNewRichText = (textType: RichTextTypes, lang: Language = Language.NB): INewRichTextParams => ({
  richText: {
    [Language.NB]: lang === Language.NB ? [createSimpleParagraph()] : null,
    [Language.NN]: lang === Language.NN ? [createSimpleParagraph()] : null,
  },
  textType,
  ...getMetadata(),
});

export const getNewPlainText = (textType: PlainTextTypes, lang: Language = Language.NB): INewPlainTextParams => ({
  plainText: {
    [Language.NB]: lang === Language.NB ? '' : null,
    [Language.NN]: lang === Language.NN ? '' : null,
  },
  textType,
  ...getMetadata(),
});

export const getNewRegelverk = (): INewRegelverkParams => ({
  richText: {
    [UNTRANSLATED]: [createSimpleParagraph()],
  },
  textType: REGELVERK_TYPE,
  ...getMetadata(),
});

export const getNewGodFormulering = (lang: Language = Language.NB): INewGodFormuleringParams => ({
  richText: {
    [Language.NB]: lang === Language.NB ? [createSimpleParagraph()] : null,
    [Language.NN]: lang === Language.NN ? [createSimpleParagraph()] : null,
  },
  textType: GOD_FORMULERING_TYPE,
  ...getMetadata(),
});
