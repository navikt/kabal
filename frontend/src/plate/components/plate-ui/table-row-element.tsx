import { PlateElement, type PlateElementProps } from '@udecode/plate-common/react';
import { type ElementRef, forwardRef } from 'react';
import { styled } from 'styled-components';

type PlateTableRowElementProps = PlateElementProps;

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
