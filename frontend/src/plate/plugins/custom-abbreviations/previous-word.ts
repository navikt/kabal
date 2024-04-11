import { PlateEditor, getEditorString, getLeafNode, getPointBefore } from '@udecode/plate-common';
import { Range } from 'slate';
import { getLong } from '@app/plate/plugins/custom-abbreviations/get-long';
import { RichText } from '@app/plate/types';

interface PreviousWord {
  long: RichText;
  short: RichText;
  range: Range;
}

export const getAbbreviation = (editor: PlateEditor, key: string): PreviousWord | null => {
  const { selection } = editor;

  if (selection === null || Range.isExpanded(selection)) {
    return null;
  }

  const lineStart = getPointBefore(editor, selection, { unit: 'line', distance: 1 });

  if (lineStart === undefined) {
    return null;
  }

  const lineToCaretRange: Range = { anchor: lineStart, focus: selection.focus };

  if (Range.isCollapsed(lineToCaretRange)) {
    return null;
  }

  const lineToCaretText = getEditorString(editor, lineToCaretRange);

  if (lineToCaretText.length === 0) {
    return null;
  }

  const words = lineToCaretText.split(' ');

  const lastWord = words.at(-1);

  if (lastWord === undefined || lastWord.length === 0) {
    return null;
  }

  const anchor = getPointBefore(editor, selection, { unit: 'character', distance: lastWord.length });

  if (anchor === undefined) {
    return null;
  }

  const range: Range = { anchor, focus: selection.focus };

  const [shortNode] = getLeafNode(editor, range);

  const secondToLastWord = words.at(-2);

  const long = getLong(lastWord, secondToLastWord);

  if (long === null) {
    return null;
  }

  return { short: shortNode, long: { ...shortNode, text: `${long}${key}` }, range };
};
