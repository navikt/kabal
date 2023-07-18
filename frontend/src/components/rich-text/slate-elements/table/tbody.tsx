import React from 'react';
import { styled } from 'styled-components';
import { TableBodyElementType } from '../../types/editor-types';
import { RenderElementProps } from '../render-props';

export const TableBodyElement = ({ attributes, children }: RenderElementProps<TableBodyElementType>) => (
  <StyledTableBody {...attributes}>{children}</StyledTableBody>
);

const StyledTableBody = styled.tbody``;
