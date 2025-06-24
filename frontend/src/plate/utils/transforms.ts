import { removeEmptyCharInText } from '@app/functions/remove-empty-char-in-text';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { createPageBreak, createPlaceHolder, createSimpleParagraph } from '@app/plate/templates/helpers';
import type { PlaceholderElement } from '@app/plate/types';
import { isInTable, isPlaceholderActive } from '@app/plate/utils/queries';
import type { PlateEditor } from '@platejs/core/react';
import { RangeApi } from 'platejs';
import { Range } from 'slate';

export const insertPageBreak = (editor: PlateEditor): boolean => {
  if (isInTable(editor)) {
    return false;
  }

  editor.tf.insertNodes([createPageBreak(), createSimpleParagraph()], { select: true });

  return true;
};

export const insertPlaceholderFromSelection = (editor: PlateEditor, selection: Range | null) => {
  if (selection === null || RangeApi.isCollapsed(selection)) {
    return;
  }

  if (isPlaceholderActive(editor)) {
    return;
  }

  const textFromSelection = editor.api.string(selection);

  editor.tf.withoutNormalizing(() => {
    editor.tf.delete();
    editor.tf.insertNode(createPlaceHolder(textFromSelection), {
      at: Range.start(selection),
      select: true,
    });
  });
};

export const removePlaceholder = (editor: PlateEditor) => {
  const entry = editor.api.node<PlaceholderElement>({ match: { type: ELEMENT_PLACEHOLDER } });

  if (entry === undefined) {
    return;
  }

  const [node, path] = entry;
  const text = removeEmptyCharInText(editor.api.string(path));

  editor.tf.withoutNormalizing(() => {
    editor.tf.removeNodes({ at: path });
    editor.tf.insertText(text.trim().length === 0 ? node.placeholder : text);
  });
};
