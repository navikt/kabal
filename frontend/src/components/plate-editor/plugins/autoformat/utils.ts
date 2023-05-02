import {
  AutoformatBlockRule,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  getParentNode,
  isElement,
  isType,
  toggleList,
  unwrapList,
} from '@udecode/plate';
import { EditorValue, RichTextEditor } from '../../types';

export const preFormat: AutoformatBlockRule<EditorValue, RichTextEditor>['preFormat'] = (editor) => unwrapList(editor);

export const format = (editor: RichTextEditor, customFormatting: any) => {
  if (editor.selection) {
    const parentEntry = getParentNode(editor, editor.selection);

    if (!parentEntry) {
      return;
    }
    const [node] = parentEntry;

    if (isElement(node) && !isType(editor, node, ELEMENT_CODE_BLOCK) && !isType(editor, node, ELEMENT_CODE_LINE)) {
      customFormatting();
    }
  }
};

export const formatList = (editor: RichTextEditor, elementType: string) => {
  format(editor, () =>
    toggleList(editor, {
      type: elementType,
    })
  );
};

export const formatText = (editor: RichTextEditor, text: string) => {
  format(editor, () => editor.insertText(text));
};
