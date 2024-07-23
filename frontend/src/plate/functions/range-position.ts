import { toDOMRange } from '@udecode/plate-common';
import { BasePoint } from 'slate';
import { CURRENT_SCALE } from '@app/components/smart-editor/hooks/use-scale';
import { BASE_FONT_SIZE_PX } from '@app/plate/components/get-scaled-em';
import { RichTextEditor } from '@app/plate/types';

export interface IRangePosition {
  /** em */
  top: number;
  /** em */
  left: number;
}

export const calculateRangePosition = (
  editor: RichTextEditor,
  containerRef: HTMLElement,
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
    return null;
  }

  const rangePosition = range.getBoundingClientRect();
  const containerPosition = containerRef.getBoundingClientRect();

  return {
    top: (rangePosition.top - containerPosition.top) / CURRENT_SCALE / BASE_FONT_SIZE_PX,
    left: (rangePosition.left - containerPosition.left) / CURRENT_SCALE / BASE_FONT_SIZE_PX,
  };
};
