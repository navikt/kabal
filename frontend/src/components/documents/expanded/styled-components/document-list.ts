import styled from 'styled-components';
import { DOCUMENT_ROW_WIDTH } from './constants';

interface IDragOver {
  $dragOver: boolean;
}

export const StyledDocumentList = styled.ul<IDragOver>`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  padding-top: 8px;
  padding-bottom: 8px;
  margin: 0;
  list-style-type: none;
  flex-grow: 1;
  border-bottom: 1px solid #c6c2bf;
  overflow-y: auto;
  background-color: ${({ $dragOver }) => ($dragOver ? 'var(--a-surface-action-subtle-hover)' : 'unset')};
`;

export const StyledDocumentListItem = styled.li<IDragOver>`
  display: block;
  position: relative;
  max-width: ${DOCUMENT_ROW_WIDTH}px;
  outline: ${({ $dragOver }) => ($dragOver ? '2px dashed var(--a-border-subtle-hover)' : 'none')};
  margin-left: 2px;
  border-radius: 4px;
  background-color: ${({ $dragOver }) => ($dragOver ? 'var(--a-surface-action-subtle-hover)' : 'unset')};
`;
