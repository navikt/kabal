import { isCollapsed, isEditorFocused, someNode } from '@udecode/plate-common';
import { ELEMENT_TABLE } from '@udecode/plate-table';
import { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { CURRENT_SCALE } from '@app/components/smart-editor/hooks/use-scale';
import { BASE_FONT_SIZE_PX } from '@app/plate/components/get-scaled-em';
import { getRangePosition } from '@app/plate/functions/get-range-position';
import { IRangePosition } from '@app/plate/functions/range-position';
import { useSelection } from '@app/plate/hooks/use-selection';
import { FloatingRedaktoerToolbarButtons } from '@app/plate/toolbar/toolbars/floating-redaktoer-toolbar-buttons';
import { FloatingSaksbehandlerToolbarButtons } from '@app/plate/toolbar/toolbars/floating-saksbehandler-toolbar-buttons';
import { useMyPlateEditorRef } from '@app/plate/types';

interface Props {
  editorId: string;
  container: HTMLDivElement | null;
}

interface FloatingToolbarProps extends Props {
  children: React.ReactNode;
}

const FLOATING_TOOLBAR_OFFSET = 8;
const FLOATING_TOOLBAR_HEIGHT = 36;

const OFFSET = FLOATING_TOOLBAR_OFFSET + FLOATING_TOOLBAR_HEIGHT;

const FloatingToolbar = ({ editorId, container, children }: FloatingToolbarProps) => {
  const editor = useMyPlateEditorRef();
  const [toolbarRef, setRef] = useState<HTMLElement | null>(null);
  const selection = useSelection(editorId);
  const isInTable = someNode(editor, { match: { type: ELEMENT_TABLE } });
  const position = getRangePosition(editor, isInTable ? null : selection, container);
  const isFocused = isEditorFocused(editor);

  const horizontalPosition = useMemo(
    () => getHorizontalPosition(toolbarRef, container, position),
    [container, position, toolbarRef],
  );

  if (isInTable || !isFocused || position === null || isCollapsed(editor.selection)) {
    return null;
  }

  return (
    <StyledFloatingToolbar
      style={{
        top: `calc(${position.top}em - ${OFFSET}px)`,
        left: horizontalPosition.left === undefined ? undefined : `${horizontalPosition.left}em`,
        right: horizontalPosition.right === undefined ? undefined : `${horizontalPosition.right}em`,
      }}
      ref={setRef}
    >
      {children}
    </StyledFloatingToolbar>
  );
};

const getHorizontalPosition = (
  toolbarRef: HTMLElement | null,
  container: HTMLDivElement | null,
  position: IRangePosition | null,
) => {
  if (toolbarRef === null || container === null || position === null) {
    return {};
  }

  const maxLeft = (container.offsetWidth - toolbarRef.offsetWidth) / CURRENT_SCALE / BASE_FONT_SIZE_PX;

  return position.left > maxLeft ? { right: 0 } : { left: position.left };
};

export const StyledFloatingToolbar = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  padding: 2px;
  box-shadow: var(--a-shadow-medium);
  background-color: var(--a-surface-default);
  z-index: 21;
  will-change: left, top;
`;

export const FloatingSaksbehandlerToolbar = (props: Props) => (
  <FloatingToolbar {...props}>
    <FloatingSaksbehandlerToolbarButtons />
  </FloatingToolbar>
);

export const FloatingRedaktoerToolbar = (props: Props) => (
  <FloatingToolbar {...props}>
    <FloatingRedaktoerToolbarButtons />
  </FloatingToolbar>
);
