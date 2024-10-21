import { removeEmptyCharInText } from '@app/functions/remove-empty-char-in-text';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { createPageBreak, createPlaceHolder, createSimpleParagraph } from '@app/plate/templates/helpers';
import type { PlaceholderElement } from '@app/plate/types';
import { isInTable, isPlaceholderActive } from '@app/plate/utils/queries';
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
import type { PlateEditor } from '@udecode/plate-core/react';
import { Range } from 'slate';

export const insertPageBreak = (editor: PlateEditor): boolean => {
  if (isInTable(editor)) {
    return false;
  }

  insertElements(editor, [createPageBreak(), createSimpleParagraph()], { select: true });

  return true;
};

export const insertPlaceholderFromSelection = (editor: PlateEditor) => {
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

export const removePlaceholder = (editor: PlateEditor) => {
  const entry = findNode<PlaceholderElement>(editor, { match: { type: ELEMENT_PLACEHOLDER } });

  if (entry === undefined) {
    return;
  }

  const [node, path] = entry;
  const text = removeEmptyCharInText(editor.string(path));

  withoutNormalizing(editor, () => {
    removeNodes(editor, { at: path });
    insertText(editor, text.trim().length === 0 ? node.placeholder : text);
  });
};
