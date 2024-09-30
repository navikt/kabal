import { ptToEm } from '@app/plate/components/get-scaled-em';
import { PlateElement, type PlateElementProps } from '@udecode/plate-common/react';
import { styled } from 'styled-components';
import type { BulletListElement, ListItemElement, NumberedListElement } from '../types';

export const OrderedList = ({ children, element, ...props }: PlateElementProps<NumberedListElement>) => (
  <PlateElement
    as={OrderedListStyle}
    {...props}
    element={element}
    style={{ marginLeft: ptToEm((element.indent ?? 0) * 24) }}
  >
    {children}
  </PlateElement>
);

const OrderedListStyle = styled.ol`
  padding-left: 1em;
  margin: 0;
  margin-top: 1em;
`;

export const UnorderedList = ({ children, element, ...props }: PlateElementProps<BulletListElement>) => (
  <PlateElement
    as={UnorderedListStyle}
    {...props}
    element={element}
    style={{ marginLeft: ptToEm((element.indent ?? 0) * 24) }}
  >
    {children}
  </PlateElement>
);

const UnorderedListStyle = styled.ul`
  padding-left: 1em;
  margin: 0;
  margin-top: 1em;
`;

export const ListItem = ({ children, ...props }: PlateElementProps<ListItemElement>) => (
  <PlateElement as={ListItemStyle} {...props}>
    {children}
  </PlateElement>
);

const ListItemStyle = styled.li`
  & > ${UnorderedListStyle}, & > ${OrderedListStyle} {
    margin-top: 0;
  }
`;
