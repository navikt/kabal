import { ABBREVIATIONS } from '@app/plate/plugins/capitalise/abbreviations';
import { type Descendant, ElementApi, type Point, RangeApi, TextApi } from '@udecode/plate';
import type { PlateEditor } from '@udecode/plate-core/react';

const LOWERCASE_CHAR_AND_DASH_REGEX = /^[\p{Ll}-]+$/u;
export const isSingleWord = (text: string) => LOWERCASE_CHAR_AND_DASH_REGEX.test(text);

export const hasMultipleBlocks = (editor: PlateEditor, nodes: Descendant[]): boolean => {
  const blocks = nodes.filter((c) => editor.api.isBlock(c));

  return blocks.length > 1;
};

export const nodeContainsSingleWord = (editor: PlateEditor, node: Descendant): boolean => {
  if (TextApi.isText(node)) {
    return LOWERCASE_CHAR_AND_DASH_REGEX.test(node.text);
  }

  if (ElementApi.isElement(node)) {
    if (hasMultipleBlocks(editor, node.children)) {
      return false;
    }

    return node.children.every((c) => nodeContainsSingleWord(editor, c));
  }

  return true;
};

export const isAtStartOfBlock = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const closestBlock = editor.api.node({ at: editor.selection.anchor, block: true, mode: 'lowest' });

  if (closestBlock === undefined) {
    return false;
  }

  return editor.api.isStart(editor.selection.anchor, closestBlock[1]);
};

export const capitaliseFirstNodeWithText = (elements: Descendant[]): void => {
  let i = -1;

  for (const element of elements) {
    i++;

    if (TextApi.isText(element)) {
      if (element.text.length === 0) {
        continue;
      }

      if (element.text.length === 1) {
        element.text = element.text.charAt(0).toUpperCase();
        element.autoCapitalised = true;

        return;
      }

      const newText = { text: element.text.slice(1) };
      element.text = element.text.charAt(0).toUpperCase();
      element.autoCapitalised = true;

      elements.splice(i + 1, 0, newText);

      return;
    }

    if (ElementApi.isElement(element)) {
      capitaliseFirstNodeWithText(element.children);
    }
  }
};

export const isAfterSentence = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const start = RangeApi.start(editor.selection);
  const oneBeforeStart = editor.api.before(start, { distance: 1, unit: 'character' });

  if (oneBeforeStart === undefined) {
    return false;
  }

  const maybeSpace = editor.api.string({ anchor: oneBeforeStart, focus: start });

  if (maybeSpace.trim().length > 0) {
    return false;
  }

  const twoBeforeStart = editor.api.before(start, { distance: 2, unit: 'character' });

  if (twoBeforeStart === undefined) {
    return false;
  }

  const maybeSeparator = editor.api.string({
    anchor: twoBeforeStart,
    focus: oneBeforeStart,
  });

  return maybeSeparator === '.' || maybeSeparator === '!' || maybeSeparator === '?';
};

export const skipCapitalisation = (editor: PlateEditor): boolean =>
  !isAtStartOfBlock(editor) && !isAfterSentence(editor);

const ORDINAL_REGEX = /[0-9]+\./;
export const isOrdinalOrAbbreviation = (editor: PlateEditor): boolean => {
  const lastWord = getLastWord(editor);

  if (lastWord === null) {
    return false;
  }

  return ORDINAL_REGEX.test(lastWord) || isAbbreviation(lastWord);
};

const getLastWord = (editor: PlateEditor): string | null => {
  if (editor.selection === null) {
    return null;
  }

  const closestBlock = editor.api.node({ at: editor.selection.anchor, block: true });

  if (closestBlock === undefined) {
    return null;
  }

  const [, path] = closestBlock;
  const anchor: Point = { path, offset: 0 };

  const blockString = editor.api.string({ anchor, focus: editor.selection.focus });

  const trimmed = blockString.trim();
  const lastSpaceIndex = trimmed.lastIndexOf(' ');

  return lastSpaceIndex === -1 ? trimmed : trimmed.substring(lastSpaceIndex + 1);
};

export const ABBREVIATION_REGEX = /[A-Za-zÆØÅæøå]+\.(?:[A-Za-zÆØÅæøå]+\.?)+/;
const isAbbreviation = (word: string): boolean => {
  if (word.length < 2) {
    return false;
  }

  return ABBREVIATIONS.has(word) || ABBREVIATION_REGEX.test(word);
};
