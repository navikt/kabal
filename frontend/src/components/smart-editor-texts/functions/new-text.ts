import { ELEMENT_PARAGRAPH } from '@udecode/plate';
import { TextAlign } from '@app/components/plate-editor/types';
import {
  INewPlainTextParams,
  INewRichTextParams,
  ITextBaseMetadata,
  PlainTextTypes,
  RichTextTypes,
} from '@app/types/texts/texts';
import { VERSION } from '../../rich-text/version';

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
  content: [
    {
      type: ELEMENT_PARAGRAPH,
      align: TextAlign.LEFT,
      children: [{ text: '' }],
      indent: 0,
    },
  ],
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
