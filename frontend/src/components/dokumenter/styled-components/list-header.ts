import styled from 'styled-components';

export const ListHeader = styled.div`
  display: grid;
  grid-template-columns: auto 140px 5em 32px;
  grid-template-areas: 'title tema date checkbox';
  grid-column-gap: 1em;
  align-items: center;
  padding: 16px;
`;

export const ListTitle = styled.h1`
  margin: 0;
  font-size: 1em;
  grid-area: title;
`;
