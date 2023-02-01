import styled, { css } from 'styled-components';

const commonStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  padding-top: 8px;
  margin: 0;
  margin-bottom: 16px;
  list-style-type: none;
  flex-grow: 1;
  border-bottom: 1px solid #c6c2bf;
`;

export const StyledDocumentList = styled.ul`
  ${commonStyles}
  overflow-y: visible;
`;

export const StyledJournalfoerteDocumentList = styled(StyledDocumentList)`
  ${commonStyles}
  overflow-y: auto;
`;

export const StyledDocumentListItem = styled.li`
  display: block;
  position: relative;
`;
