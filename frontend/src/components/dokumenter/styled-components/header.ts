import styled from 'styled-components';

export const DokumenterNav = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 1em;
  background: white;
  border-bottom: 1px solid #c6c2bf;
  height: 64px;
  align-items: center;
`;

export const DokumenterTittel = styled.h1`
  padding: 0;
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
  flex-grow: 1;
  line-height: 1;
`;
