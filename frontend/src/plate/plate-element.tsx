import type { TElement } from '@udecode/plate';
import { PlateElement as PlateElementPrimitive, type PlateElementProps } from '@udecode/plate/react';

// Plate v44 removed generic in PlateElement
export const PlateElement = <T extends TElement = TElement>(props: PlateElementProps<T>) => {
  return <PlateElementPrimitive {...(props as PlateElementProps)} />;
};
