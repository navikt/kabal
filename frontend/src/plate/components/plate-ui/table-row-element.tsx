import { PlateElement, withRef } from '@udecode/plate/react';
import { styled } from 'styled-components';

const TableRowElement = withRef<typeof PlateElement>(({ children, ...props }, ref) => (
  <PlateElement as={StyledTableRowElement} ref={ref} {...props} className="static">
    {children}
  </PlateElement>
));

export { TableRowElement };

const StyledTableRowElement = styled.tr`
  background-color: var(--a-surface-subtle);

  &:nth-child(even) {
    background-color: var(--a-surface-default);
  }
`;
