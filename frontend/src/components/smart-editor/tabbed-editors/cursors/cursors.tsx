import { RelativeRange } from '@slate-yjs/core';
import { UnknownObject } from '@udecode/plate-common';
import { CursorData, CursorOverlayProps, CursorProps, useCursorOverlayPositions } from '@udecode/plate-cursor';
import { useContext, useRef } from 'react';
import { styled } from 'styled-components';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { getColor } from '@app/components/smart-editor/tabbed-editors/cursors/cursor-colors';

export interface UserCursor extends CursorData, UnknownObject {
  navn: string;
  navIdent: string;
}

interface YjsCursor {
  selection: RelativeRange;
  data: UserCursor;
}

export const isYjsCursor = (value: unknown): value is YjsCursor =>
  typeof value === 'object' && value !== null && 'selection' in value && 'data' in value;

const Cursor = ({ caretPosition, data, disableCaret, disableSelection, selectionRects }: CursorProps<UserCursor>) => {
  const { style, selectionStyle = style, navIdent, navn } = data ?? {};

  const labelRef = useRef<HTMLDivElement>(null);

  const caretColor = getColor(navIdent ?? '', 1);
  const selectionColor = getColor(navIdent ?? '', 0.2);

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

const StyledSelection = styled.div<ColorProps>`
  position: absolute;
  z-index: 10;
  background-color: ${({ $color }) => $color};
`;

const StyledCaret = styled.div<ColorProps>`
  pointer-events: none;
  position: absolute;
  z-index: 10;
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

export const CursorOverlay = (props: CursorOverlayProps<UserCursor>) => {
  const { user } = useContext(StaticDataContext);
  const { cursors } = useCursorOverlayPositions(props);

  return (
    <>
      {cursors
        .filter(({ data }) => data?.navIdent !== user.navIdent)
        .map((cursor) => (
          <Cursor key={cursor.key as string} {...cursor} />
        ))}
    </>
  );
};
