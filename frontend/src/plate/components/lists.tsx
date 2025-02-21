import { ptToEm } from '@app/plate/components/get-scaled-em';
import { PlateElement } from '@app/plate/plate-element';
import type { PlateElementProps } from '@udecode/plate/react';
import type { BulletListElement, ListItemElement, NumberedListElement } from '../types';

const LIST_CLASSES = 'pl-[1em] mr-0 mb-0 ml-0 in-[li]:mt-0 not-in-[li]:mt-[1em]';

export const OrderedList = ({ children, element, ...props }: PlateElementProps<NumberedListElement>) => (
  <PlateElement
    as="ol"
    {...props}
    element={element}
    style={{ marginLeft: ptToEm((element.indent ?? 0) * 24) }}
    className={`${LIST_CLASSES} list-decimal`}
  >
    {children}
  </PlateElement>
);

export const UnorderedList = ({ children, element, ...props }: PlateElementProps<BulletListElement>) => (
  <PlateElement
    as="ul"
    {...props}
    element={element}
    style={{ marginLeft: ptToEm((element.indent ?? 0) * 24) }}
    className={`${LIST_CLASSES} list-disc`}
  >
    {children}
  </PlateElement>
);

export const ListItem = ({ children, ...props }: PlateElementProps<ListItemElement>) => (
  <PlateElement as="li" {...props}>
    {children}
  </PlateElement>
);
