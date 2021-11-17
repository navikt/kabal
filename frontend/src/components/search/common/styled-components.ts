import styled from 'styled-components';

export const StyledTable = styled.table`
  margin: 20px 0;
`;

export const StyledResult = styled.li`
  display: grid;
  grid-template-areas:
    'result-name result-fnr result-open'
    'oppgaver oppgaver oppgaver';
  grid-template-columns: 2fr 10em 10em;
  grid-column-gap: 16px;
  align-items: center;
  padding: 16px;
  padding-right: 32px;
  margin-top: 20px;
  border-top: 1px solid #c6c2bf;
`;

export const StyledName = styled.span`
  justify-self: left;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledFnr = styled.span`
  justify-self: left;
`;

export const RightAlignCell = styled.td`
  text-align: right;
`;
