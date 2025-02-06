import { ptToEm } from '@app/plate/components/get-scaled-em';
import { ScaleContext } from '@app/plate/status-bar/scale-context';
import { useMyPlateEditorRef } from '@app/plate/types';
import { type ResizeEvent, ResizeHandle } from '@udecode/plate-resizable';
import { setTableColSize } from '@udecode/plate-table';
import { TablePlugin, useTableCellElement, useTableCellElementResizable } from '@udecode/plate-table/react';
import { PlateElement, useEditorPlugin, useReadOnly, withRef } from '@udecode/plate/react';
import { useCallback, useContext } from 'react';
import type { MouseEvent } from 'react';
import { styled } from 'styled-components';
import { StyledParagraph } from '../paragraph';

export const TableCellElement = withRef<typeof PlateElement>(({ style, children, ...props }, ref) => {
  const { api } = useEditorPlugin(TablePlugin);
  const { selected, minHeight, width } = useTableCellElement();

  const spans = {
    colSpan: api.table.getColSpan(props.element),
    rowSpan: api.table.getRowSpan(props.element),
  };

  return (
    <PlateElement asChild ref={ref} {...props}>
      <StyledCell $selected={selected} className="min-w-12" style={{ ...style, width }} {...spans}>
        <Content style={{ minHeight }}>{children}</Content>
        <Resize />
      </StyledCell>
    </PlateElement>
  );
});

const Resize = () => {
  const { scale } = useContext(ScaleContext);
  const readOnly = useReadOnly();
  const { colIndex, isSelectingCell, ...state } = useTableCellElement();
  const { rightProps } = useTableCellElementResizable({ colIndex, ...state });
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
    />
  );
};

const PADDING = ptToEm(6);

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
