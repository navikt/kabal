import { css, styled } from 'styled-components';

export const StyledOppgaverContainer = styled.section`
  grid-area: oppgaver;
  border-top: 1px solid #c6c2bf;
  margin-top: 16px;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 75px;
`;

const resultCSS = css`
  display: grid;
  grid-template-areas:
    'result-name result-fnr result-open'
    'oppgaver oppgaver oppgaver';
  grid-template-columns: 1fr max-content 10em;
  grid-column-gap: 16px;
  align-items: center;
  padding: 16px;
  padding-right: 32px;
  border-top: 1px solid #c6c2bf;
  max-width: 2047px;
`;

export const StyledNameResult = styled.li`
  ${resultCSS}
`;

export const StyledFnrResult = styled.div`
  ${resultCSS}
`;

export const StyledName = styled.span`
  justify-self: left;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledFnr = styled.span`
  justify-self: left;
`;
