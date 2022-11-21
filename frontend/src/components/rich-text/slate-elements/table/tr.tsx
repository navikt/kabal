import React from 'react';
import styled from 'styled-components';
import { TableRowElementType } from '../../types/editor-types';
import { RenderElementProps } from '../render-props';

export const TableRowElement = ({ attributes, children }: RenderElementProps<TableRowElementType>) => (
  <StyledTableRow {...attributes}>{children}</StyledTableRow>
);

const StyledTableRow = styled.tr`
  :nth-child(odd) {
    background-color: var(--a-surface-subtle);
  }
  :nth-child(even) {
    background-color: #fff;
  }
`;
