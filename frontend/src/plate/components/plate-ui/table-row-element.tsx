import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import { ElementRef, forwardRef } from 'react';
import { styled } from 'styled-components';

interface PlateTableRowElementProps extends PlateElementProps {}

const TableRowElement = forwardRef<ElementRef<typeof PlateElement>, PlateTableRowElementProps>(
  ({ children, ...props }, ref) => (
    <PlateElement as={StyledTableRowElement} ref={ref} {...props}>
      {children}
    </PlateElement>
  ),
);

TableRowElement.displayName = 'TableRowElement';

export { TableRowElement };

const StyledTableRowElement = styled.tr`
  background-color: var(--a-surface-subtle);

  &:nth-child(even) {
    background-color: var(--a-surface-default);
  }
`;
