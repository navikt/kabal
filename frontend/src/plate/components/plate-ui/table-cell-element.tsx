import { ptToEm } from '@app/plate/components/get-scaled-em';
import { ScaleContext } from '@app/plate/status-bar/scale-context';
import { MAX_WIDTH } from '@app/plate/toolbar/table/with-overrides';
import { type ResizeEvent, ResizeHandle } from '@platejs/resizable';
import { TablePlugin, useTableCellElement, useTableCellElementResizable, useTableColSizes } from '@platejs/table/react';
import { PlateElement, useEditorPlugin, useReadOnly, withRef } from 'platejs/react';
import { useContext, useMemo } from 'react';
import { styled } from 'styled-components';

const BASE_CLASSES = 'relative align-top ';
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

  const style: React.CSSProperties = {
    ...props.style,
    width,
    minHeight,
    padding: PADDING,
    border: `${ptToEm(1.25)} solid var(--a-border-default)`,
    wordBreak: 'break-all',
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
  const colSizes = useTableColSizes();

  const scaleFactor = useMemo(() => scale / 100, [scale]);
  const scaledColSizes = useMemo(() => colSizes.map((size) => size * scaleFactor), [colSizes, scaleFactor]);
  const scaledMaxWidth = useMemo(() => MAX_WIDTH * scaleFactor, [scaleFactor]);

  if (isSelectingCell || readOnly) {
    return null;
  }

  const { options, ...rest } = rightProps;

  const scaledOptions = {
    ...options,
    onResize: (e: ResizeEvent) => {
      const delta = Math.round(e.delta * scaleFactor);
      const initialSize = Math.round(e.initialSize * scaleFactor);

      const nextCol = scaledColSizes[colIndex + 1];

      // Last column
      if (nextCol === undefined) {
        const rest = scaledColSizes.filter((_, i) => i !== colIndex);
        const widthOfRest = rest.reduce((a, b) => a + b, 0);
        const totalSize = widthOfRest + delta + initialSize;

        // Attempted to be resized outside bounds
        if (totalSize >= scaledMaxWidth && delta > 0) {
          return options?.onResize?.({ ...e, initialSize: 0, delta: scaledMaxWidth - widthOfRest });
        }
      }

      return options?.onResize?.({ ...e, initialSize, delta });
    },
  };

  return <StyledRightHandle contentEditable={false} suppressContentEditableWarning {...rest} options={scaledOptions} />;
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
