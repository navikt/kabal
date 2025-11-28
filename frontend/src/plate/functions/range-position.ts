import { CURRENT_SCALE } from '@app/components/smart-editor/hooks/use-scale';
import { BASE_FONT_SIZE_PX } from '@app/plate/components/get-scaled-em';
import type { RichTextEditor } from '@app/plate/types';
import type { BasePoint } from 'slate';

interface IRangePosition {
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
  const range = editor.api.toDOMRange({
    anchor: selectionStart,
    focus: {
      path: selectionStart.path,
      offset: selectionStart.offset,
    },
  });

  if (range === undefined) {
    console.warn('Could not calculate position. Range is undefined.', selectionStart);

    return null;
  }

  const rangePosition = range.getBoundingClientRect();
  const containerPosition = containerRef.getBoundingClientRect();

  return {
    top: (rangePosition.top - containerPosition.top) / CURRENT_SCALE / BASE_FONT_SIZE_PX,
    left: (rangePosition.left - containerPosition.left) / CURRENT_SCALE / BASE_FONT_SIZE_PX,
  };
};
