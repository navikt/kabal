import { createSimpleParagraph } from '@app/plate/templates/helpers';
import {
  INewPlainTextParams,
  INewRichTextParams,
  ITextBaseMetadata,
  PlainTextTypes,
  RichTextTypes,
} from '@app/types/texts/texts';

const getMetadata = (): ITextBaseMetadata => ({
  templateSectionList: [],
  ytelseHjemmelList: [],
  utfall: [],
  enheter: [],
  title: '',
  // TODO: Remove after migration.
  hjemler: [],
  templates: [],
  sections: [],
  ytelser: [],
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
