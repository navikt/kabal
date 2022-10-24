import styled from 'styled-components';

export const StyledDocumentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  padding-top: 8px;
  margin: 0;
  margin-bottom: 16px;
  list-style-type: none;
  flex-grow: 1;
  overflow-y: auto;
  border-bottom: 1px solid #c6c2bf;
`;

export const StyledDocumentListItem = styled.li`
  display: block;
  position: relative;
`;
