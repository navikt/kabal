import { isCollapsed, isEditorFocused, someNode, useEditorRef, useEditorSelection } from '@udecode/plate-common';
import { ELEMENT_TABLE } from '@udecode/plate-table';
import React, { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { IRangePosition } from '@app/plate/functions/range-position';
import { useRangePosition } from '@app/plate/hooks/use-range-position';
import { FloatingRedaktoerToolbarButtons } from '@app/plate/toolbar/toolbars/floating-redaktoer-toolbar-buttons';
import { FloatingSaksbehandlerToolbarButtons } from '@app/plate/toolbar/toolbars/floating-saksbehandler-toolbar-buttons';

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
  const editor = useEditorRef();
  const [toolbarRef, setRef] = useState<HTMLElement | null>(null);
  const selection = useEditorSelection(editorId);
  const isInTable = someNode(editor, { match: { type: ELEMENT_TABLE } });
  const position = useRangePosition(isInTable ? null : selection, container);
  const isFocused = isEditorFocused(editor);

  const horizontalPosition = useMemo(
    () => getHorizontalPosition(toolbarRef, container, position),
    [container, position, toolbarRef],
  );

  if (isInTable || !isFocused || position === null || isCollapsed(editor.selection)) {
    return null;
  }

  return (
    <StyledFloatingToolbar style={{ top: position.top - OFFSET, ...horizontalPosition }} ref={setRef}>
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

  const maxLeft = container.offsetWidth - toolbarRef.offsetWidth;

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
  transition:
    left 50ms ease-in-out,
    top 50ms ease-in-out;
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
