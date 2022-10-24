import styled, { css } from 'styled-components';

const commonStyles = css`
  & {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
  }
`;

export const StyledDocumentsContainer = styled.section`
  ${commonStyles}
`;

export const StyledJournalfoerteDocumentsContainer = styled.section`
  ${commonStyles}
  justify-content: space-between;
  flex-grow: 1;
  overflow: hidden;
`;
