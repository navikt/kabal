import { PlateElement, withRef } from 'platejs/react';

export const TableRowElement = withRef<typeof PlateElement>(({ children, ...props }, ref) => (
  <PlateElement
    as="tr"
    ref={ref}
    {...props}
    className="bg-surface-subtle even:bg-surface-default"
    style={{ position: 'static' }}
  >
    {children}
  </PlateElement>
));
