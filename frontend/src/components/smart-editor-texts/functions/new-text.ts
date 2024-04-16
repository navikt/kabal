import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { ITextBaseMetadata, PlainTextTypes, RichTextTypes } from '@app/types/common-text-types';
import { Language } from '@app/types/texts/common';
import { INewPlainTextParams, INewRichTextParams } from '@app/types/texts/params';

const getMetadata = (): ITextBaseMetadata => ({
  templateSectionIdList: [],
  ytelseHjemmelIdList: [],
  utfallIdList: [],
  enhetIdList: [],
  title: '',
});

export const getNewRichText = (textType: RichTextTypes): INewRichTextParams => ({
  richText: {
    [Language.NB]: [createSimpleParagraph()],
    [Language.NN]: [createSimpleParagraph()],
  },
  textType,
  ...getMetadata(),
});

export const getNewPlainText = (textType: PlainTextTypes): INewPlainTextParams => ({
  plainText: {
    [Language.NB]: '',
    [Language.NN]: '',
  },
  textType,
  ...getMetadata(),
});
