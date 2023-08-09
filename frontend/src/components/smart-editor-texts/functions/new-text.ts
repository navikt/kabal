import { createSimpleParagraph } from '@app/plate/templates/helpers';
import {
  INewPlainTextParams,
  INewRichTextParams,
  ITextBaseMetadata,
  PlainTextTypes,
  RichTextTypes,
} from '@app/types/texts/texts';

const getMetadata = (): ITextBaseMetadata => ({
  hjemler: [],
  enheter: [],
  ytelser: [],
  utfall: [],
  sections: [],
  templates: [],
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
