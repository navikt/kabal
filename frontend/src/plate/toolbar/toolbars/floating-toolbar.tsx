import { isExpanded, someNode, usePlateEditorRef, usePlateSelection } from '@udecode/plate-common';
import { ELEMENT_TABLE } from '@udecode/plate-table';
import React from 'react';
import { styled } from 'styled-components';
import { useRangePosition } from '@app/plate/hooks/use-range-position';
import { CommentsButton } from '@app/plate/toolbar/add-comment';
import { Marks } from '@app/plate/toolbar/marks';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { Table } from '@app/plate/toolbar/table/table';
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
  const editor = usePlateEditorRef();
  const selection = usePlateSelection(editorId);
  const position = useRangePosition(selection, container);

  const tableActive = someNode(editor, { match: { type: ELEMENT_TABLE } });

  if (position === null) {
    return null;
  }

  return (
    <StyledFloatingToolbar style={{ top: position.top - OFFSET, left: position.left }}>
      {!tableActive ? children : null}
      {tableActive ? (
        <>
          <Marks />
          <ToolbarSeparator />
          <Table />
          {isExpanded(editor.selection) ? (
            <>
              <ToolbarSeparator />
              <CommentsButton />
            </>
          ) : null}
        </>
      ) : null}
    </StyledFloatingToolbar>
  );
};

const StyledFloatingToolbar = styled.section`
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
