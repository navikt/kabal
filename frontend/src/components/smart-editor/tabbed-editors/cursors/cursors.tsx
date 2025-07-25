import { getColors } from '@app/components/smart-editor/tabbed-editors/cursors/cursor-colors';
import { type CursorData, type CursorProps, type CursorState, useCursorOverlayPositions } from '@platejs/cursor';
import type { RelativeRange } from '@slate-yjs/core';
import { createZustandStore, type UnknownObject } from 'platejs';
import { useEffect, useMemo, useRef } from 'react';
import { styled } from 'styled-components';

export interface UserCursor extends CursorData, UnknownObject {
  navn: string;
  navIdent: string;
  tabId: string;
}

interface YjsCursor {
  selection: RelativeRange;
  data: UserCursor;
}

export const isYjsCursor = (value: unknown): value is YjsCursor =>
  typeof value === 'object' && value !== null && 'selection' in value && 'data' in value;

const Cursor = ({ caretPosition, data, disableCaret, disableSelection, selectionRects }: CursorProps<UserCursor>) => {
  const previousCaretPosition = useRef(caretPosition);
  const { style, selectionStyle = style, navIdent, navn, tabId } = data ?? {};

  const labelRef = useRef<HTMLDivElement>(null);

  const { caretColor, selectionColor } = useMemo(() => getColors(tabId ?? ''), [tabId]);

  // Use the previous caret position if the current caret position is null.
  // This is to avoid flickering of the caret. It may lag behind a little instead.
  const safeCaretPosition = caretPosition ?? previousCaretPosition.current;

  // Remember the previous caret position.
  useEffect(() => {
    if (caretPosition !== null) {
      previousCaretPosition.current = caretPosition;
    }
  }, [caretPosition]);

  return (
    <>
      {disableSelection === true
        ? null
        : selectionRects.map((selectionPosition) => (
            <StyledSelection
              key={`${selectionColor}-${selectionPosition.left}-${selectionPosition.top}-${selectionPosition.width}-${selectionPosition.height}-${tabId}`}
              style={{ ...selectionStyle, ...selectionPosition, backgroundColor: selectionColor }}
            />
          ))}
      {disableCaret === true || safeCaretPosition === null ? null : (
        <StyledCaret style={{ ...safeCaretPosition, ...style, backgroundColor: caretColor }}>
          <CaretLabel ref={labelRef} style={{ backgroundColor: caretColor }}>
            {navn} ({navIdent})
          </CaretLabel>
        </StyledCaret>
      )}
    </>
  );
};

const BaseCursor = styled.div`
  pointer-events: none;
  position: absolute;
  z-index: 10;
`;

const StyledSelection = styled(BaseCursor)``;

const StyledCaret = styled(BaseCursor)`
  width: 1px;
`;

const CaretLabel = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  color: white;
  font-size: 0.75em;
  padding: 0.25em;
  border-radius: var(--a-border-radius-medium);
  border-bottom-left-radius: 0;
  white-space: nowrap;
`;

export const cursorStore = createZustandStore<Record<string, CursorState<UserCursor>>>(
  {},
  { mutative: true, name: 'cursors' },
);

interface CursorOverlayProps {
  containerElement: HTMLElement;
}

export const CursorOverlay = ({ containerElement }: CursorOverlayProps) => {
  const { useStore } = cursorStore;
  const yjsCursors = useStore();
  const containerRef = useRef(containerElement);
  const { cursors, refresh } = useCursorOverlayPositions({ containerRef, cursors: yjsCursors });

  // Refresh the cursor positions if any caret position is null.
  useEffect(() => {
    if (cursors.some((cursor) => cursor.caretPosition === null)) {
      const req = requestAnimationFrame(() => {
        refresh();
      });

      return () => {
        cancelAnimationFrame(req);
      };
    }
  }, [cursors, refresh]);

  return (
    <>
      {cursors.map((cursor) => (
        <Cursor key={cursor.data?.tabId} id={cursor.data?.navIdent ?? 'UNKNOWN'} {...cursor} />
      ))}
    </>
  );
};
