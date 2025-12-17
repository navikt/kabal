import { Keys } from '@app/keys';
import { getWordRange } from '@app/plate/plugins/cycle-case/get-word-range';
import { type Path, PathApi, type Point, PointApi, RangeApi, type TRange, type TText } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import { createPlatePlugin } from 'platejs/react';

export const CycleCasePlugin = createPlatePlugin({
  key: 'cycle-case',
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (event.shiftKey && event.key === Keys.F3) {
        event.preventDefault();
        cycleCase(editor);
      }
    },
  },
});

export enum Case {
  LOWER = 'lower',
  UPPER = 'upper',
  CAPITALISE = 'capitalise',
}

export const cycleCase = (editor: PlateEditor, forceCase?: Case) => {
  const { selection } = editor;

  if (selection == null) {
    return;
  }

  if (RangeApi.isCollapsed(selection)) {
    return changeCase(editor, getWordRange(editor, selection.focus), selection, forceCase);
  }

  return changeCase(editor, selection, selection, forceCase);
};

export const changeCase = (editor: PlateEditor, range: TRange, originalSelection: TRange, forceCase?: Case) => {
  const nodes = editor.api.nodes<TText>({ text: true, at: range });
  const casing = forceCase ?? getNewCase(editor.api.string(range));
  const start = RangeApi.start(range);
  const end = RangeApi.end(range);

  editor.tf.withoutNormalizing(() => {
    for (const [node, nodePath] of nodes) {
      const at = getAt(start, end, node, nodePath);
      const text = editor.api.string(at);

      editor.tf.insertText(getNewText(editor, at, text, start, casing), { at });
    }

    editor.tf.setSelection(originalSelection);
  });
};

export const getNewCase = (text: string): Case => {
  if (text === text.toUpperCase()) {
    return Case.LOWER;
  }

  if (text === text.toLowerCase()) {
    return Case.CAPITALISE;
  }

  return Case.UPPER;
};

const getAt = (start: Point, end: Point, node: TText, path: Path): TRange => {
  const isStart = PathApi.equals(path, start.path);
  const isEnd = PathApi.equals(path, end.path);

  // Node constitutes the whole range
  if (isStart && isEnd) {
    return { anchor: start, focus: end };
  }

  // Node is at the start of the range: select from start to end of node
  if (isStart) {
    return { anchor: start, focus: { path, offset: node.text.length } };
  }

  // Node is at the end of the range: select from start of node to end
  if (isEnd) {
    return { anchor: { path, offset: 0 }, focus: end };
  }

  // Node is fully contained in range: select whole node
  return { anchor: { path, offset: 0 }, focus: { path, offset: node.text.length } };
};

const getNewText = (editor: PlateEditor, at: TRange, text: string, start: Point, casing: Case): string => {
  switch (casing) {
    case Case.LOWER:
      return text.toLowerCase();
    case Case.UPPER:
      return text.toUpperCase();
    case Case.CAPITALISE:
      return capitaliseAfterSpace(editor, at, text, start);
  }
};

const capitaliseAfterSpace = (editor: PlateEditor, at: TRange, text: string, start: Point): string =>
  shouldCapitaliseFirstLetter(editor, at, start)
    ? text.toLowerCase().replace(CAPITALISE_FIRST_LETTER_REGEX, capitalise)
    : text.toLowerCase().replace(CAPITALISE_AFTER_SPACE_REGEX, capitalise);

const capitalise = (_match: string, prefix: string, char: string): string => prefix + char.toUpperCase();

export const shouldCapitaliseFirstLetter = (editor: PlateEditor, at: TRange, start: Point): boolean => {
  if (PointApi.equals(start, RangeApi.start(at))) {
    return true;
  }

  if (at.anchor.offset !== 0) {
    const prevChar = editor.api.string({
      anchor: { path: at.anchor.path, offset: at.anchor.offset - 1 },
      focus: at.anchor,
    });

    return prevChar === ' ';
  }

  const currentText = editor.api.node({ at, text: true });

  // Should never happen
  if (currentText === undefined) {
    return false;
  }

  const prevText = editor.api.previous<TText>({ at, text: true });

  // No previous text node
  if (prevText === undefined) {
    return true;
  }

  // Current text is first in its block
  if (!PathApi.isSibling(at.anchor.path, prevText[1])) {
    return true;
  }

  return prevText[0].text.endsWith(' ');
};

const CAPITALISE_FIRST_LETTER_REGEX = /(^|\s)(\w)/g;
const CAPITALISE_AFTER_SPACE_REGEX = /(\s)(\w)/g;
