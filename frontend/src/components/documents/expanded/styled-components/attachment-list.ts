import styled from 'styled-components';
import { StyledDocumentListItem } from './document-list';

export const StyledAttachmentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0;
  grid-column-end: action-end;
  grid-column-start: title-start;
  position: relative;
  padding: 0;
  margin: 0;
  margin-left: 4px;
  list-style-type: none;

  &::before {
    content: '';
    display: block;
    width: 0;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 20px;
    border-left: 1px solid #c6c2bf;
  }
`;

export const StyledAttachmentListItem = styled(StyledDocumentListItem)`
  padding-left: 12px;

  &::before {
    content: '';
    display: block;
    width: 12px;
    position: absolute;
    left: 0;
    top: 20px;
    border-bottom: 1px solid #c6c2bf;
  }
`;
