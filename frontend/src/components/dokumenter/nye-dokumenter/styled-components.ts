import styled from 'styled-components';

export const StyledListHeader = styled.div`
  display: grid;
  grid-template-columns: auto 10em 5em 5em;
  grid-column-gap: 1em;
  border-bottom: 1px solid #c6c2bf;
  padding-bottom: 1em;
`;

export const StyledValg = styled.h2`
  font-size: 1em;
  margin: 0;
  grid-column: 4;
  text-align: right;
`;

export const StyledTitle = styled.h2`
  margin: 0;
  font-size: 1em;
  grid-column: 1;
`;

export const StyledNyeDokumenter = styled.div`
  padding: 1em;
`;

export const StyledNewDocument = styled.li`
  display: grid;
  grid-template-columns: auto 5em 32px;
  grid-template-areas: 'title date options';
  grid-column-gap: 1em;
`;

export const StyledList = styled.ul`
  padding: 0;
  list-style-type: none;
`;

export const StyledFilename = styled.h1`
  grid-area: title;
  font-size: 1em;
  color: inherit;
  margin: 0;
  padding: 0;
`;

export const StyledDate = styled.time`
  grid-area: date;
  font-size: 12px;
  text-align: center;
`;

export const StyledDeleteButton = styled.button`
  grid-area: options;
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  color: #0067c5;
  text-decoration: underline;
  text-align: right;

  &:disabled {
    cursor: not-allowed;
  }
`;
