import { ptToEm } from '@app/plate/components/get-scaled-em';
import { ScaleContext } from '@app/plate/status-bar/scale-context';
import { MAX_TABLE_WIDTH } from '@app/plate/toolbar/table/constants';
import { type ResizeEvent, ResizeHandle } from '@platejs/resizable';
import { TablePlugin, useTableCellElement, useTableCellElementResizable, useTableColSizes } from '@platejs/table/react';
import { PlateElement, useEditorPlugin, useReadOnly, withRef } from 'platejs/react';
import { useContext, useMemo } from 'react';
import { styled } from 'styled-components';

const BASE_CLASSES = 'relative align-top';
const REMOVE_P_PLACEHOLDER = "[&>p::before]:content-['']";
const REMOVE_P_MARGIN_TOP = '[&>*:first-child]:mt-0!';
const ALL_CLASSES = `${BASE_CLASSES} ${REMOVE_P_PLACEHOLDER} ${REMOVE_P_MARGIN_TOP}`;

export const TableCellElement = withRef<typeof PlateElement>(({ children, className, ...props }, ref) => {
  const { api } = useEditorPlugin(TablePlugin);
  const { minHeight, width: rawWidth } = useTableCellElement();
  const { scale: percentage } = useContext(ScaleContext);
  const colSizes = useTableColSizes();

  const totalWidth = useMemo(() => colSizes.reduce((a, b) => a + b, 0), [colSizes]);

  const spans = {
    colSpan: api.table.getColSpan(props.element),
    rowSpan: api.table.getRowSpan(props.element),
  };

  const scale = percentage / 100;

  // Width should always be a number unless something weird has happened
  const width =
    typeof rawWidth === 'number' ? Math.floor(rawWidth * scale) : Math.floor((MAX_TABLE_WIDTH - totalWidth) * scale);

  const style: React.CSSProperties = {
    ...props.style,
    width,
    maxWidth: width,
    minHeight,
    padding: PADDING,
    border: `${ptToEm(1.25)} solid var(--a-border-default)`,
    overflowWrap: 'anywhere',
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

  if (isSelectingCell || readOnly) {
    return null;
  }

  const { options, ...rest } = rightProps;

  const scaledOptions = {
    ...options,
    onResize: (e: ResizeEvent) => {
      const delta = Math.floor(e.delta / scaleFactor);
      const initialSize = Math.floor(e.initialSize / scaleFactor);

      const nextCol = colSizes[colIndex + 1];

      // Last column
      if (nextCol === undefined) {
        const rest = colSizes.filter((_, i) => i !== colIndex);
        const widthOfRest = rest.reduce((a, b) => a + b, 0);
        const totalSize = widthOfRest + delta + initialSize;

        // Attempted to be resized outside bounds
        if (totalSize >= MAX_TABLE_WIDTH && delta > 0) {
          return options?.onResize?.({ ...e, initialSize: 0, delta: MAX_TABLE_WIDTH - widthOfRest });
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
