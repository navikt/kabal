import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import { useTableElement, useTableElementState } from '@udecode/plate-table';
import React, { forwardRef } from 'react';
import { styled } from 'styled-components';
import { EditorValue, TableElement as ITableElement } from '@app/plate/types';

export const TableElement = forwardRef<
  React.ElementRef<typeof PlateElement>,
  PlateElementProps<EditorValue, ITableElement>
>(({ className, children, ...props }, ref) => {
  const { colSizes, minColumnWidth: minWidth } = useTableElementState();
  const { props: tableProps, colGroupProps } = useTableElement();

  return (
    <PlateElement as={TableStyled} ref={ref} className={className} {...tableProps} {...props}>
      <colgroup {...colGroupProps}>
        {colSizes.map((width, i) =>
          typeof width !== 'number' ? null : <col key={i} style={{ width: width === 0 ? 'auto' : width, minWidth }} />,
        )}
      </colgroup>

      <tbody style={{ minWidth: '100%' }}>{children}</tbody>
    </PlateElement>
  );
});

TableElement.displayName = 'TableElement';

const TableStyled = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 1em;
  max-width: 100%;
`;
