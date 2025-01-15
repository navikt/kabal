import { ptToEm } from '@app/plate/components/get-scaled-em';
import type { TableElement as ITableElement } from '@app/plate/types';
import { TableProvider, useTableElement } from '@udecode/plate-table/react';
import { withHOC } from '@udecode/plate/react';
import { PlateElement, type PlateElementProps, withRef } from '@udecode/plate/react';
import { styled } from 'styled-components';

export const TableElement = withHOC(
  TableProvider,
  withRef<typeof PlateElement, PlateElementProps<ITableElement>>(({ children, ...props }, ref) => {
    const { props: tableProps } = useTableElement();

    return (
      <PlateElement
        as={TableStyled}
        ref={ref}
        {...props}
        style={{ marginLeft: ptToEm(24 * (props.element.indent ?? 0)) }}
      >
        {/* <colgroup {...colGroupProps}>
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
        </colgroup> */}

        <tbody style={{ minWidth: '100%' }} {...tableProps}>
          {children}
        </tbody>
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
