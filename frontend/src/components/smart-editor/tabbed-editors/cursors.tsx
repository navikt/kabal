import { createZustandStore } from '@udecode/plate-common';
import {
  CursorData,
  CursorOverlay as CursorOverlayPrimitive,
  CursorOverlayProps,
  CursorProps,
} from '@udecode/plate-cursor';
import { styled } from 'styled-components';

const cursorStore = createZustandStore('cursor')({
  cursors: {},
});

const Cursor = ({
  caretPosition,
  classNames,
  data,
  disableCaret,
  disableSelection,
  selectionRects,
}: CursorProps<CursorData>) => {
  const { style, selectionStyle = style } = data ?? {};

  return (
    <>
      {disableSelection === true
        ? null
        : selectionRects.map((position, i) => (
            <StyledCaret
              className={classNames?.selectionRect}
              key={i}
              style={{
                ...selectionStyle,
                ...position,
              }}
            />
          ))}
      {disableCaret === true || caretPosition === null ? null : (
        <StyledCaret className={classNames?.caret} style={{ ...caretPosition, ...style }} />
      )}
    </>
  );
};

const StyledCaret = styled.div`
  pointer-events: none;
  position: absolute;
  z-index: 10;
  min-width: 20px;
  background-color: red;
`;

export const CursorOverlay = ({ cursors, ...props }: CursorOverlayProps) => {
  const dynamicCursors = cursorStore.use.cursors();

  const allCursors = { ...cursors, ...dynamicCursors };

  return <CursorOverlayPrimitive {...props} cursors={allCursors} onRenderCursor={Cursor} />;
};
