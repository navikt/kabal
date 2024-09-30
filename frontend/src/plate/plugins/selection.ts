import { getNode, getSelectionText, isText } from '@udecode/plate-common';
import { createPlatePlugin } from '@udecode/plate-core/react';
import { Range } from 'slate';

export const SelectionPlugin = createPlatePlugin({
  key: 'selection',
  extendEditor: ({ editor }) => {
    const { select } = editor;

    editor.select = (target) => {
      if (!Range.isRange(target) || Range.isCollapsed(target)) {
        return select(target);
      }

      if (!containsMultipleWords(getSelectionText(editor))) {
        return select(target);
      }

      const node = getNode(editor, target.anchor.path);

      if (!isText(node)) {
        return select(target);
      }

      const isForward = Range.isForward(target);

      const anchorOffset = isForward
        ? getWordStart(node.text, target.anchor.offset)
        : getWordEnd(node.text, target.anchor.offset);

      return select({ ...target, anchor: { ...target.anchor, offset: anchorOffset } });
    };

    return editor;
  },
});

const START_REGEX = /\S+$/;
const END_REGEX = /^\S*/;
const CONTAINS_REGEX = /\s/;

const getWordStart = (text: string, offset: number): number => {
  const match = text.slice(0, offset).match(START_REGEX);

  return match ? offset - match[0].length : offset;
};

const getWordEnd = (text: string, offset: number): number => {
  const match = text.slice(offset).match(END_REGEX);

  return match ? offset + match[0].length : offset;
};

const containsMultipleWords = (text: string): boolean => CONTAINS_REGEX.test(text);
