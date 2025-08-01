import { PlateElement, type PlateElementProps } from 'platejs/react';

export const TableRowElement = ({ children, ref, ...props }: PlateElementProps) => (
  <PlateElement
    as="tr"
    ref={ref}
    {...props}
    className="odd:bg-ax-bg-neutral-soft-a even:bg-transparent"
    style={{ position: 'static' }}
  >
    {children}
  </PlateElement>
);
