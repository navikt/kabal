import { ptToEm } from '@app/plate/components/get-scaled-em';
import type { TableElement as ITableElement } from '@app/plate/types';
import { TableProvider, useTableElement } from '@platejs/table/react';
import { PlateElement, type PlateElementProps, withHOC, withRef } from 'platejs/react';
import { styled } from 'styled-components';

export const TableElement = withHOC(
  TableProvider,
  withRef<typeof PlateElement, PlateElementProps<ITableElement>>(({ children, ...props }, ref) => {
    const { props: tableProps } = useTableElement();

    return (
      <PlateElement style={{ marginLeft: ptToEm(24 * (props.element.indent ?? 0)) }} {...props}>
        <TableStyled ref={ref} {...tableProps}>
          <tbody>{children}</tbody>
        </TableStyled>
      </PlateElement>
    );
  }),
);

const TableStyled = styled.table`
  border-collapse: collapse;
  margin-top: 1em;
  max-width: 100%;
`;
