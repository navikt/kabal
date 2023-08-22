import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import React from 'react';
import { styled } from 'styled-components';
import { BulletListElement, EditorValue, NumberedListElement } from '../types';

export const OrderedList = ({ children, ...props }: PlateElementProps) => (
  <PlateElement as={OrderedListStyle} {...props}>
    {children}
  </PlateElement>
);

const OrderedListStyle = styled.ol`
  padding-left: 1em;
  margin: 0;
  margin-top: 1em;
`;

export const UnorderedList = ({ children, ...props }: PlateElementProps<EditorValue, BulletListElement>) => (
  <PlateElement as={UnorderedListStyle} {...props}>
    {children}
  </PlateElement>
);

const UnorderedListStyle = styled.ul`
  padding-left: 1em;
  margin: 0;
  margin-top: 1em;
`;

export const ListItem = ({ children, ...props }: PlateElementProps<EditorValue, NumberedListElement>) => (
  <PlateElement as={ListItemStyle} {...props}>
    {children}
  </PlateElement>
);

const ListItemStyle = styled.li`
  & > ${UnorderedListStyle}, & > ${OrderedListStyle} {
    margin-top: 0;
  }
`;
