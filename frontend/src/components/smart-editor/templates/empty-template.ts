import { Descendant } from 'slate';
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

export const EMPTY_TEMPLATE: ISmartEditorTemplate = {
  templateId: 'empty',
  tittel: 'Generelt brev',
  content: [
    {
      id: 'test-smart-editor',
      label: '',
      type: 'rich-text',
      content: INITIAL_SLATE_VALUE,
    },
  ],
};
