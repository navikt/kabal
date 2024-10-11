import { ptToEm } from '@app/plate/components/get-scaled-em';
import { ScaleContext } from '@app/plate/status-bar/scale-context';
import { type EditorValue, useMyPlateEditorRef } from '@app/plate/types';
import { PlateElement, type PlateElementProps } from '@udecode/plate-common';
import { type ResizeEvent, ResizeHandle } from '@udecode/plate-resizable';
import {
  type TTableCellElement,
  setTableColSize,
  useTableCellElement,
  useTableCellElementResizable,
  useTableCellElementResizableState,
  useTableCellElementState,
} from '@udecode/plate-table';
import { forwardRef, useCallback, useContext } from 'react';
import { styled } from 'styled-components';
import { StyledParagraph } from '../paragraph';

type TableCellElementProps = PlateElementProps<EditorValue, TTableCellElement>;

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
  const { scale } = useContext(ScaleContext);
  const { colIndex, readOnly, isSelectingCell, hovered, ...state } = useTableCellElementState();
  const resizableState = useTableCellElementResizableState({ colIndex, ...state });
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

  const { options, ...rest } = rightProps;

  const scaledOptions = {
    ...options,
    onResize: (e: ResizeEvent) => {
      const scaleFactor = scale / 100;

      return options?.onResize?.({
        ...e,
        initialSize: Math.round(e.initialSize / scaleFactor),
        delta: Math.round(e.delta / scaleFactor),
      });
    },
  };

  return (
    <StyledRightHandle
      contentEditable={false}
      suppressContentEditableWarning
      onDoubleClick={onDblClick}
      {...rest}
      options={scaledOptions}
      style={{ backgroundColor: hovered ? 'color-mix(in srgb, var(--a-blue-200), transparent)' : 'transparent' }}
    />
  );
};

const PADDING = ptToEm(3);

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
  border: ${ptToEm(1.25)} solid var(--a-border-default);
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
