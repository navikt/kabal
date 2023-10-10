import {
  findNode,
  insertElements,
  insertNodes,
  insertText,
  isCollapsed,
  isText,
  removeNodes,
  withoutNormalizing,
} from '@udecode/plate-common';
import { Range } from 'slate';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { createPageBreak, createPlaceHolder, createSimpleParagraph } from '@app/plate/templates/helpers';
import { PlaceholderElement, RichTextEditor } from '@app/plate/types';
import { isInTable, isPlaceholderActive } from '@app/plate/utils/queries';

export const insertPageBreak = (editor: RichTextEditor): boolean => {
  if (isInTable(editor)) {
    return false;
  }

  insertElements(editor, [createPageBreak(), createSimpleParagraph()], { select: true });

  return true;
};

export const insertPlaceholderFromSelection = (editor: RichTextEditor) => {
  const { selection } = editor;

  if (selection === null || isCollapsed(selection)) {
    return;
  }

  if (isPlaceholderActive(editor)) {
    return;
  }

  const textFromSelection = editor.string(selection);

  withoutNormalizing(editor, () => {
    editor.delete();
    insertNodes(editor, [createPlaceHolder(textFromSelection), { text: '' }], {
      at: Range.start(selection),
      match: isText,
    });
  });
};

export const removePlaceholder = (editor: RichTextEditor) => {
  const entry = findNode<PlaceholderElement>(editor, { match: { type: ELEMENT_PLACEHOLDER } });

  if (entry === undefined) {
    return;
  }

  const [node, path] = entry;
  const text = editor.string(path);

  const hadText = text.length !== 0;

  withoutNormalizing(editor, () => {
    removeNodes(editor, { at: path });

    if (hadText) {
      insertText(editor, text);
    } else {
      insertText(editor, node.placeholder);
    }
  });
};
