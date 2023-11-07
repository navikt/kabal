import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { ITextBaseMetadata, PlainTextTypes, RichTextTypes } from '@app/types/common-text-types';
import { INewPlainTextParams, INewRichTextParams } from '@app/types/texts/params';

const getMetadata = (): ITextBaseMetadata => ({
  templateSectionIdList: [],
  ytelseHjemmelIdList: [],
  utfallIdList: [],
  enhetIdList: [],
  title: '',
});

export const getNewRichText = (textType: RichTextTypes): INewRichTextParams => ({
  content: [createSimpleParagraph()],
  textType,
  ...getMetadata(),
});

export const getNewPlainText = (textType: PlainTextTypes): INewPlainTextParams => ({
  plainText: '',
  textType,
  ...getMetadata(),
});
