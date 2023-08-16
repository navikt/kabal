import { toDOMRange } from '@udecode/plate-common';
import { BasePoint } from 'slate';
import { RichTextEditor } from '@app/plate/types';

export interface IRangePosition {
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
}

export const calculateRangePosition = (
  editor: RichTextEditor,
  containerRef: HTMLDivElement,
  selectionStart: BasePoint,
): IRangePosition | null => {
  const range = toDOMRange(editor, {
    anchor: selectionStart,
    focus: {
      path: selectionStart.path,
      offset: selectionStart.offset + 1,
    },
  });

  if (range === undefined) {
    console.warn('Could not calculate position of floating toolbar. Range is undefined.', selectionStart);

    return null;
  }

  const rangePosition = range.getBoundingClientRect();
  const containerPosition = containerRef.getBoundingClientRect();

  return {
    top: rangePosition.top - containerPosition.top,
    left: rangePosition.left - containerPosition.left,
    right: rangePosition.right - containerPosition.right,
    bottom: rangePosition.bottom - containerPosition.bottom,
    height: rangePosition.height,
    width: rangePosition.width,
  };
};
