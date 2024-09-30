import { ptToEm, pxToEm } from '@app/plate/components/get-scaled-em';
import type { TableElement as ITableElement } from '@app/plate/types';
import { PlateElement, type PlateElementProps, withHOC, withRef } from '@udecode/plate-common/react';
import { TableProvider, useTableElement, useTableElementState } from '@udecode/plate-table/react';
import { styled } from 'styled-components';

export const TableElement = withHOC(
  TableProvider,
  withRef<typeof PlateElement, PlateElementProps<ITableElement>>(({ className, children, element, ...props }, ref) => {
    const { colSizes, minColumnWidth: minWidth } = useTableElementState();
    const { props: tableProps, colGroupProps } = useTableElement();

    return (
      <PlateElement
        as={TableStyled}
        ref={ref}
        className={className}
        {...tableProps}
        {...props}
        style={{ marginLeft: ptToEm(24 * (element.indent ?? 0)) }}
        element={element}
      >
        <colgroup {...colGroupProps}>
          {colSizes.map((width, i) =>
            typeof width !== 'number' ? null : (
              <col
                // biome-ignore lint/suspicious/noArrayIndexKey: No other way to uniquely identify the columns.
                key={i}
                style={{
                  width: width === 0 ? 'auto' : pxToEm(width),
                  minWidth: typeof minWidth === 'number' ? pxToEm(minWidth) : minWidth,
                }}
              />
            ),
          )}
        </colgroup>

        <tbody style={{ minWidth: '100%' }}>{children}</tbody>
      </PlateElement>
    );
  }),
);

TableElement.displayName = 'TableElement';

const TableStyled = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 1em;
  max-width: 100%;
`;
