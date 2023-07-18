import { styled } from 'styled-components';

const StyledDocumentListItem = styled.li`
  display: block;
  margin-left: 2px;
  margin-right: 2px;
  border-radius: 4px;
`;

export const StyledAttachmentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0;
  grid-column-end: action-end;
  grid-column-start: title-start;
  position: relative;
  padding: 0;
  margin: 0;
  margin-left: 12px;
  list-style-type: none;

  &::before {
    content: '';
    display: block;
    width: 0;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 16px;
    border-left: 1px solid #c6c2bf;
  }
`;

export const StyledAttachmentListItem = styled(StyledDocumentListItem)`
  position: relative;
  padding-left: 12px;
  margin-left: 0;
  margin-right: 0;

  &::before {
    content: '';
    display: block;
    width: 12px;
    position: absolute;
    left: 0;
    top: 50%;
    border-bottom: 1px solid #c6c2bf;
  }
`;
