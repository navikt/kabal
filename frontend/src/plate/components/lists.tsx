import { PlateElement, type PlateElementProps } from 'platejs/react';
import { FONT_SIZE_PT, indentInEm, ptToEm } from '@/plate/components/get-scaled-em';
import type { BulletListElement, ListItemElement, NumberedListElement } from '@/plate/types';

const LIST_CLASSES = 'mr-0 mt-0 in-[li]:mb-0 not-in-[li]:mb-[1em] in-[li]:ml-[1em] not-in-[li]:ml-[2em]';

export const OrderedList = ({ children, element, ...props }: PlateElementProps<NumberedListElement>) => (
  <PlateElement
    as="div"
    {...props}
    style={{ marginLeft: indentInEm(element.indent), fontSize: ptToEm(FONT_SIZE_PT) }}
    element={element}
  >
    <ol className={`${LIST_CLASSES} list-decimal`}>{children}</ol>
  </PlateElement>
);

export const UnorderedList = ({ children, element, ...props }: PlateElementProps<BulletListElement>) => (
  <PlateElement
    as="div"
    {...props}
    element={element}
    style={{ marginLeft: indentInEm(element.indent), fontSize: ptToEm(FONT_SIZE_PT) }}
  >
    <ul
      className={`${LIST_CLASSES} list-disc [&_ul]:list-[circle] [&_ul_ul]:list-[square] [&_ul_ul_ul]:list-disc [&_ul_ul_ul_ul]:list-[circle] [&_ul_ul_ul_ul_ul]:list-[square] [&_ul_ul_ul_ul_ul_ul]:list-disc [&_ul_ul_ul_ul_ul_ul_ul]:list-[circle] [&_ul_ul_ul_ul_ul_ul_ul_ul]:list-[square]`}
    >
      {children}
    </ul>
  </PlateElement>
);

export const ListItem = ({ children, ...props }: PlateElementProps<ListItemElement>) => (
  <PlateElement as="li" {...props}>
    {children}
  </PlateElement>
);
