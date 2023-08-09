import { TRange } from '@udecode/plate-common';
import { useEffect, useRef, useState } from 'react';
import { BasePoint } from 'slate';
import { IRangePosition, calculateRangePosition } from '../functions/range-position';
import { getSelectionStart } from '../functions/selection-start';
import { useMyPlateEditorRef } from '../types';

export const useRangePosition = (selection: TRange | null, container: HTMLDivElement | null): IRangePosition | null => {
  const editor = useMyPlateEditorRef();
  const [position, setPosition] = useState<IRangePosition | null>(null);
  const previousSelectionStart = useRef<BasePoint | null>(null);

  useEffect(() => {
    if (container === null || selection === null) {
      return;
    }

    const selectionStart = getSelectionStart(editor, selection);

    if (selectionStart === previousSelectionStart.current) {
      return;
    }

    previousSelectionStart.current = selectionStart;

    const handle = requestIdleCallback(() =>
      setPosition(selectionStart === null ? null : calculateRangePosition(editor, container, selectionStart)),
    );

    return () => cancelIdleCallback(handle);
  }, [container, editor, selection]);

  return position;
};
