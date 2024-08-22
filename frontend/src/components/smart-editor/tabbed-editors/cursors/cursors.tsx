import { RelativeRange } from '@slate-yjs/core';
import { UnknownObject, createZustandStore } from '@udecode/plate-common';
import { CursorData, CursorProps, CursorState, useCursorOverlayPositions } from '@udecode/plate-cursor';
import { useRef } from 'react';
import { styled } from 'styled-components';
import { getColor } from '@app/components/smart-editor/tabbed-editors/cursors/cursor-colors';
import { TAB_UUID } from '@app/headers';

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
  const { style, selectionStyle = style, navIdent, navn, tabId } = data ?? {};

  const labelRef = useRef<HTMLDivElement>(null);

  const caretColor = getColor(tabId ?? '', 1);
  const selectionColor = getColor(tabId ?? '', 0.2);

  return (
    <>
      {disableSelection === true
        ? null
        : selectionRects.map((position, i) => (
            <StyledSelection key={i} style={{ ...selectionStyle, ...position }} $color={selectionColor} />
          ))}
      {disableCaret === true || caretPosition === null ? null : (
        <StyledCaret style={{ ...caretPosition, ...style }} $color={caretColor}>
          <CaretLabel ref={labelRef} $color={caretColor}>
            {navn} ({navIdent})
          </CaretLabel>
        </StyledCaret>
      )}
    </>
  );
};

interface ColorProps {
  $color: string;
}

const BaseCursor = styled.div`
  pointer-events: none;
  position: absolute;
  z-index: 10;
`;

const StyledSelection = styled(BaseCursor)<ColorProps>`
  background-color: ${({ $color }) => $color};
`;

const StyledCaret = styled(BaseCursor)<ColorProps>`
  width: 1px;
  background-color: ${({ $color }) => $color};
`;

const CaretLabel = styled.div<ColorProps>`
  position: absolute;
  bottom: 100%;
  left: 0;
  background-color: ${({ $color }) => $color};
  color: white;
  font-size: 0.75em;
  padding: 0.25em;
  border-radius: var(--a-border-radius-medium);
  white-space: nowrap;
`;

export const cursorStore = createZustandStore('cursors')<Record<string, CursorState<UserCursor>>>({});

interface CursorOverlayProps {
  containerElement: HTMLElement | null;
}

export const CursorOverlay = ({ containerElement }: CursorOverlayProps) => {
  const { useStore } = cursorStore;
  const yjsCursors = useStore();
  const { cursors } = useCursorOverlayPositions({
    containerRef: { current: containerElement },
    cursors: yjsCursors,
  });

  return (
    <>
      {cursors
        .filter(({ data }) => data?.tabId !== TAB_UUID)
        .map((cursor) => (
          <Cursor key={cursor.data?.tabId} {...cursor} />
        ))}
    </>
  );
};
