import { createSimpleParagraph } from '@/plate/templates/helpers';
import {
  GOD_FORMULERING_TYPE,
  type ITextBaseMetadata,
  REGELVERK_TYPE,
  type RichTextTypes,
} from '@/types/common-text-types';
import type { INewGodFormuleringParams, INewRegelverkParams } from '@/types/texts/common';
import { Language, UNTRANSLATED } from '@/types/texts/language';
import type { INewRichTextParams } from '@/types/texts/params';

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
