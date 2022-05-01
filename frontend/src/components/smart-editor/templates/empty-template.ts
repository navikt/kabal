import { Descendant } from 'slate';
import { deepFreeze } from '../../../functions/deep-freeze';
import { ISmartEditorTemplate } from '../../../types/smart-editor';
import { ContentTypeEnum, TextAlignEnum } from '../editor-types';

const INITIAL_SLATE_VALUE: Descendant[] = [
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: '',
      },
    ],
  },
];

export const EMPTY_TEMPLATE = deepFreeze<ISmartEditorTemplate>({
  templateId: 'empty',
  tittel: 'Generelt brev',
  children: INITIAL_SLATE_VALUE,
});
