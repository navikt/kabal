import { ptToEm } from '@app/plate/components/get-scaled-em';
import { ScaleContext } from '@app/plate/status-bar/scale-context';
import { useMyPlateEditorRef } from '@app/plate/types';
import { type ResizeEvent, ResizeHandle } from '@platejs/resizable';
import { setTableColSize } from '@platejs/table';
import { TablePlugin, useTableCellElement, useTableCellElementResizable } from '@platejs/table/react';
import { PlateElement, type PlateElementProps, useEditorPlugin, useReadOnly } from 'platejs/react';
import type { MouseEvent } from 'react';
import { useCallback, useContext } from 'react';

const BASE_CLASSES = 'min-w-12 relative align-top';
const REMOVE_P_PLACEHOLDER = "[&>p::before]:content-['']";
const REMOVE_P_MARGIN_TOP = '[&>*:first-child]:mt-0!';
const ALL_CLASSES = `${BASE_CLASSES} ${REMOVE_P_PLACEHOLDER} ${REMOVE_P_MARGIN_TOP}`;

export const TableCellElement = ({ children, ref, ...props }: PlateElementProps) => {
  const { api } = useEditorPlugin(TablePlugin);
  const { minHeight, width } = useTableCellElement();

  const spans = {
    colSpan: api.table.getColSpan(props.element),
    rowSpan: api.table.getRowSpan(props.element),
  };

  const style = {
    ...props.attributes.style,
    width,
    minHeight,
    padding: PADDING,
    border: `${ptToEm(1.25)} solid var(--ax-border-neutral)`,
  };

  return (
    <PlateElement as="td" ref={ref} {...props} className={ALL_CLASSES} style={style} {...spans}>
      {children}
      <Resize />
    </PlateElement>
  );
};

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

  const { options, className, style, ...rest } = rightProps;

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
    <ResizeHandle
      contentEditable={false}
      suppressContentEditableWarning
      onDoubleClick={onDblClick}
      {...rest}
      options={scaledOptions}
      style={{ width: PADDING, ...style }}
      className={`${className} absolute top-0 right-0 z-20 h-full translate-x-1/2 cursor-col-resize select-none`}
    />
  );
};

const PADDING = ptToEm(6);
