import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import { ResizeHandle } from '@udecode/plate-resizable';
import {
  setTableColSize,
  useTableCellElement,
  useTableCellElementResizable,
  useTableCellElementResizableState,
  useTableCellElementState,
} from '@udecode/plate-table';
import React, { forwardRef, useCallback } from 'react';
import { styled } from 'styled-components';
import { useMyPlateEditorRef } from '@app/plate/types';
import { StyledParagraph } from '../paragraph';

interface TableCellElementProps extends PlateElementProps {}

export const TableCellElement = forwardRef<React.ElementRef<typeof PlateElement>, TableCellElementProps>(
  ({ className, children, ...props }, ref) => {
    const { selected } = useTableCellElementState();
    const { props: cellProps } = useTableCellElement({ element: props.element });

    return (
      <PlateElement asChild ref={ref} className={className} {...cellProps} {...props}>
        <StyledCell $selected={selected}>
          <Content>{children}</Content>
          <Resize />
        </StyledCell>
      </PlateElement>
    );
  },
);

TableCellElement.displayName = 'TableCellElement';

const Resize = () => {
  const { colIndex, rowIndex, readOnly, isSelectingCell, hovered } = useTableCellElementState();
  const resizableState = useTableCellElementResizableState({ colIndex, rowIndex });
  const { rightProps } = useTableCellElementResizable(resizableState);
  const editor = useMyPlateEditorRef();

  const onDblClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setTableColSize(editor, { colIndex, width: 0 });
    },
    [colIndex, editor],
  );

  if (isSelectingCell || readOnly) {
    return null;
  }

  return (
    <StyledRightHandle
      contentEditable={false}
      suppressContentEditableWarning
      onDoubleClick={onDblClick}
      {...rightProps}
      style={{ backgroundColor: hovered ? 'color-mix(in srgb, var(--a-blue-200), transparent)' : 'transparent' }}
    />
  );
};

const PADDING = '4pt';

const StyledRightHandle = styled(ResizeHandle)`
  position: absolute;
  z-index: 20;
  user-select: none;
  height: 100%;
  width: ${PADDING};
  transform: translateX(50%);
  right: 0;
  top: 0;
  cursor: col-resize;
`;

interface CellProps {
  $selected: boolean;
}

const StyledCell = styled.td<CellProps>`
  position: relative;
  border: 1.25pt solid var(--a-border-default);
  vertical-align: top;
  background-color: ${({ $selected }) => ($selected ? 'var(--a-surface-selected)' : 'transparent')};
  padding: 0;
`;

const Content = styled.div`
  padding: ${PADDING};
  position: relative;
  height: 100%;
  z-index: 20;

  > ${StyledParagraph} {
    &::before {
      content: '';
    }
  }

  > :first-child {
    margin-top: 0;
  }
`;
