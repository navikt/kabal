import { RangeApi, type TRange } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import { removeEmptyCharInText } from '@/functions/remove-empty-char-in-text';
import { getActiveMarks } from '@/plate/components/placeholder/helpers';
import { ELEMENT_PLACEHOLDER } from '@/plate/plugins/element-types';
import { createPageBreak, createPlaceHolder, createSimpleParagraph } from '@/plate/templates/helpers';
import type { PlaceholderElement } from '@/plate/types';
import { isInTable, isPlaceholderActive } from '@/plate/utils/queries';

export const insertPageBreak = (editor: PlateEditor): boolean => {
  if (isInTable(editor)) {
    return false;
  }

  editor.tf.insertNodes([createPageBreak(), createSimpleParagraph()], { select: true });

  return true;
};

export const insertPlaceholderFromSelection = (editor: PlateEditor, selection: TRange | null) => {
  if (selection === null || RangeApi.isCollapsed(selection)) {
    return;
  }

  if (isPlaceholderActive(editor)) {
    return;
  }

  const textFromSelection = editor.api.string(selection);
  const marks = getActiveMarks(editor);

  editor.tf.withoutNormalizing(() => {
    editor.tf.delete();
    editor.tf.insertNode(createPlaceHolder(textFromSelection, true, [{ text: '', ...marks }]), {
      at: RangeApi.start(selection),
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
