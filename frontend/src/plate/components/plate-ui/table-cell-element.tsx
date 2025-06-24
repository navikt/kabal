import { ptToEm } from '@app/plate/components/get-scaled-em';
import { ScaleContext } from '@app/plate/status-bar/scale-context';
import { useMyPlateEditorRef } from '@app/plate/types';
import { type ResizeEvent, ResizeHandle } from '@platejs/resizable';
import { setTableColSize } from '@platejs/table';
import { TablePlugin, useTableCellElement, useTableCellElementResizable } from '@platejs/table/react';
import { PlateElement, useEditorPlugin, useReadOnly, withRef } from 'platejs/react';
import { useCallback, useContext } from 'react';
import type { MouseEvent } from 'react';
import { styled } from 'styled-components';

const BASE_CLASSES = 'min-w-12 relative align-top ';
const REMOVE_P_PLACEHOLDER = "[&>p::before]:content-['']";
const REMOVE_P_MARGIN_TOP = '[&>*:first-child]:mt-0!';
const ALL_CLASSES = `${BASE_CLASSES} ${REMOVE_P_PLACEHOLDER} ${REMOVE_P_MARGIN_TOP}`;

export const TableCellElement = withRef<typeof PlateElement>(({ children, className, ...props }, ref) => {
  const { api } = useEditorPlugin(TablePlugin);
  const { minHeight, width } = useTableCellElement();

  const spans = {
    colSpan: api.table.getColSpan(props.element),
    rowSpan: api.table.getRowSpan(props.element),
  };

  const style = {
    ...props.style,
    width,
    minHeight,
    padding: PADDING,
    border: `${ptToEm(1.25)} solid var(--a-border-default)`,
  };

  return (
    <PlateElement as="td" ref={ref} {...props} className={ALL_CLASSES} style={style} {...spans}>
      {children}
      <Resize />
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
