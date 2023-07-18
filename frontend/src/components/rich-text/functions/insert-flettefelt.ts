import { Editor, Transforms } from 'slate';
import { DeletableVoidElementsEnum } from '../types/editor-enums';

// eslint-disable-next-line import/no-unused-modules
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
    { select: true },
  );
};
