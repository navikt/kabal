import styled from 'styled-components';

export const StyledAttachmentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0;
  padding-top: 4px;
  margin: 0;
  margin-left: 4px;
  list-style: none;
  position: relative;

  &::before {
    content: '';
    display: block;
    width: 0;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 9.5px;
    border-left: 1px solid #c6c2bf;
  }
`;

export const AttachmentListItem = styled.li`
  position: relative;
  padding-left: 16px;

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
