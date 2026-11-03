import { NodeApi, RangeApi, TextApi } from 'platejs';
import { createPlatePlugin } from 'platejs/react';

export const SelectionPlugin = createPlatePlugin({ key: 'selection' }).overrideEditor(({ editor }) => {
  const { select } = editor.tf;

  editor.tf.select = (target) => {
    if (!RangeApi.isRange(target) || RangeApi.isCollapsed(target)) {
      return select(target);
    }

    if (!containsMultipleWords(editor.api.string())) {
      return select(target);
    }

    const node = NodeApi.get(editor, target.anchor.path);

    if (!TextApi.isText(node)) {
      return select(target);
    }

    const isForward = RangeApi.isForward(target);

    const anchorOffset = isForward
      ? getWordStart(node.text, target.anchor.offset)
      : getWordEnd(node.text, target.anchor.offset);

    return select({ ...target, anchor: { ...target.anchor, offset: anchorOffset } });
  };

  return editor;
});

// Words consist of letters (including combining marks) and digits, optionally joined by hyphens or apostrophes.
// Punctuation is a word boundary.
const WORD_REGEX = /[\p{L}\p{M}\p{N}]+(?:[-'’][\p{L}\p{M}\p{N}]+)*/gu;
const CONTAINS_WHITESPACE_REGEX = /\s/;

interface Word {
  start: number;
  end: number;
}

// Words must be matched in the full text, so that connectors on either side of the offset are recognised.
const getWords = (text: string): Word[] =>
  Array.from(text.matchAll(WORD_REGEX), ({ index, 0: word }) => ({ start: index, end: index + word.length }));

export const getWordStart = (text: string, offset: number): number =>
  getWords(text).find(({ start, end }) => start < offset && offset <= end)?.start ?? offset;

export const getWordEnd = (text: string, offset: number): number =>
  getWords(text).find(({ start, end }) => start <= offset && offset < end)?.end ?? offset;

const containsMultipleWords = (text: string): boolean => CONTAINS_WHITESPACE_REGEX.test(text);
