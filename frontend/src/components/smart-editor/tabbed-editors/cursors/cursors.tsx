import { getColorClasses } from '@app/components/smart-editor/tabbed-editors/cursors/cursor-colors';
import { BoxNew } from '@navikt/ds-react';
import { type CursorData, type CursorProps, type CursorState, useCursorOverlayPositions } from '@platejs/cursor';
import type { RelativeRange } from '@slate-yjs/core';
import { createZustandStore, type UnknownObject } from 'platejs';
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';

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

  const { caretBackgroundColorClass, selectionBackgroundColorClass } = useMemo(
    () => getColorClasses(tabId ?? ''),
    [tabId],
  );

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
            <div
              className={`pointer-events-none absolute z-10 ${selectionBackgroundColorClass}`}
              key={`${selectionBackgroundColorClass}-${selectionPosition.left}-${selectionPosition.top}-${selectionPosition.width}-${selectionPosition.height}-${tabId}`}
              style={{ ...selectionStyle, ...selectionPosition }}
            />
          ))}
      {disableCaret === true || safeCaretPosition === null ? null : (
        <div
          className={`pointer-events-none absolute z-10 w-[1px] ${caretBackgroundColorClass}`}
          style={{ ...safeCaretPosition, ...style }}
        >
          <BoxNew
            position="absolute"
            left="0"
            className={`bottom-full whitespace-nowrap rounded-l-sm rounded-br-sm p-[.25em] text-[.75em] text-ax-text-neutral ${caretBackgroundColorClass}`}
            ref={labelRef}
          >
            {navn} ({navIdent})
          </BoxNew>
        </div>
      )}
    </>
  );
};

export const cursorStore = createZustandStore<Record<string, CursorState<UserCursor>>>(
  {},
  { mutative: true, name: 'cursors' },
);

interface CursorOverlayProps {
  containerElement: HTMLElement;
}

export const CursorOverlay = ({ containerElement }: CursorOverlayProps) => {
  const yjsCursors = useSyncExternalStore(cursorStore.subscribe, () => cursorStore.store.getState());
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
