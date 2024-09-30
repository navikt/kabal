import { getLong } from '@app/plate/plugins/custom-abbreviations/get-long';
import type { FormattedText } from '@app/plate/types';
import { getEditorString, getLeafNode, getPointBefore } from '@udecode/plate-common';
import type { PlateEditor } from '@udecode/plate-core/react';
import { Range } from 'slate';

type Marks = Omit<FormattedText, 'text'>;

interface PreviousWord {
  long: string;
  short: string;
  range: Range;
  marks: Marks;
}

export const getShortAndLong = (editor: PlateEditor): PreviousWord | null => {
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

  const short = words.at(-1);

  if (short === undefined || short.length === 0) {
    return null;
  }

  const long = getLong(short, words.at(-2));

  if (long === null) {
    return null;
  }

  const anchor = getPointBefore(editor, selection, { unit: 'character', distance: short.length });

  if (anchor === undefined) {
    return null;
  }

  const range: Range = { anchor, focus: selection.focus };

  const [shortNode] = getLeafNode(editor, range);

  return { short, long, marks: getMarks(shortNode), range };
};

const getMarks = (node: FormattedText): Marks => {
  const marks: Marks = { ...node };
  marks.text = undefined;

  return marks;
};
