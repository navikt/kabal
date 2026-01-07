import { ptToEm } from '@app/plate/components/get-scaled-em';
import { PlateElement, type PlateElementProps } from 'platejs/react';
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
    className={`${LIST_CLASSES} list-disc [&_ul]:list-[circle] [&_ul_ul]:list-[square] [&_ul_ul_ul]:list-disc [&_ul_ul_ul_ul]:list-[circle] [&_ul_ul_ul_ul_ul]:list-[square] [&_ul_ul_ul_ul_ul_ul]:list-disc [&_ul_ul_ul_ul_ul_ul_ul]:list-[circle] [&_ul_ul_ul_ul_ul_ul_ul_ul]:list-[square]`}
  >
    {children}
  </PlateElement>
);

export const ListItem = ({ children, ...props }: PlateElementProps<ListItemElement>) => (
  <PlateElement as="li" {...props}>
    {children}
  </PlateElement>
);
