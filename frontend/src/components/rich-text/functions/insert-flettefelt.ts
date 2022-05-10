import { Editor, Transforms } from 'slate';
import { DeletableVoidElementsEnum } from '../types/editor-enums';

export const insertFlettefelt = (editor: Editor) => {
  Transforms.insertNodes(
    editor,
    {
      type: DeletableVoidElementsEnum.FLETTEFELT,
      children: [{ text: '' }],
      content: null,
      field: null,
      threadIds: [],
    },
    { select: true }
  );
};
