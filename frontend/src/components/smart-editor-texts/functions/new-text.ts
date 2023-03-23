import {
  INewPlainTextParams,
  INewRichTextParams,
  ITextBaseMetadata,
  PlainTextTypes,
  RichTextTypes,
} from '@app/types/texts/texts';
import { ContentTypeEnum, TextAlignEnum } from '../../rich-text/types/editor-enums';
import { VERSION } from '../../rich-text/version';

const NEW_TEXT: INewRichTextParams['content'] = [
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: '' }],
    indent: 0,
  },
];

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
  content: NEW_TEXT,
  version: VERSION,
  textType,
  ...getMetadata(),
});

export const getNewPlainText = (textType: PlainTextTypes): INewPlainTextParams => ({
  plainText: '',
  version: VERSION,
  textType,
  ...getMetadata(),
});
