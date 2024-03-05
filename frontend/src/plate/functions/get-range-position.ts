import { TRange } from '@udecode/plate-common';
import { RichTextEditor } from '../types';
import { IRangePosition, calculateRangePosition } from './range-position';
import { getSelectionStart } from './selection-start';

export const getRangePosition = (
  editor: RichTextEditor,
  selection: TRange | null,
  containerRef: HTMLDivElement | null,
): IRangePosition | null => {
  if (containerRef === null || selection === null) {
    return null;
  }

  const selectionStart = getSelectionStart(editor, selection);

  return selectionStart === null ? null : calculateRangePosition(editor, containerRef, selectionStart);
};
