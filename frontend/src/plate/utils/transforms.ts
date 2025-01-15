import { removeEmptyCharInText } from '@app/functions/remove-empty-char-in-text';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { createPageBreak, createPlaceHolder, createSimpleParagraph } from '@app/plate/templates/helpers';
import type { PlaceholderElement } from '@app/plate/types';
import { isInTable, isPlaceholderActive } from '@app/plate/utils/queries';
import { RangeApi, TextApi } from '@udecode/plate';
import type { PlateEditor } from '@udecode/plate-core/react';
import { Range } from 'slate';

export const insertPageBreak = (editor: PlateEditor): boolean => {
  if (isInTable(editor)) {
    return false;
  }

  editor.tf.insertNodes([createPageBreak(), createSimpleParagraph()], { select: true });

  return true;
};

export const insertPlaceholderFromSelection = (editor: PlateEditor) => {
  const { selection } = editor;

  if (selection === null || RangeApi.isCollapsed(selection)) {
    return;
  }

  if (isPlaceholderActive(editor)) {
    return;
  }

  const textFromSelection = editor.api.string(selection);

  editor.tf.withoutNormalizing(() => {
    editor.tf.delete();
    editor.tf.insertNodes([createPlaceHolder(textFromSelection), { text: '' }], {
      at: Range.start(selection),
      match: TextApi.isText,
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
