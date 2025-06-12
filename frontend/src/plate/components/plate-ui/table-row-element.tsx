import { PlateElement, withRef } from '@udecode/plate/react';

export const TableRowElement = withRef<typeof PlateElement>(({ children, ...props }, ref) => (
  <PlateElement as="tr" ref={ref} {...props} className="static bg-surface-subtle even:bg-surface-default">
    {children}
  </PlateElement>
));
