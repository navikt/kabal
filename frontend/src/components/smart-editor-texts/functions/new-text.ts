import { INewTextParams, TextTypes } from '../../../types/texts/texts';
import { ContentTypeEnum, TextAlignEnum } from '../../rich-text/types/editor-enums';
import { VERSION } from '../../rich-text/version';

export const NEW_TEXT: INewTextParams['content'] = [
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [{ text: '' }],
  },
];

export const getNewText = (textType: TextTypes): INewTextParams => ({
  textType,
  content: NEW_TEXT,
  plainText: '',
  hjemler: [],
  enheter: [],
  ytelser: [],
  utfall: [],
  sections: [],
  templates: [],
  title: '',
  version: VERSION,
});
