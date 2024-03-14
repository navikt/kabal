import { styled } from 'styled-components';

export const StyledToolbar = styled.section`
  display: flex;
  justify-content: center;
  width: 210mm;
  flex-direction: row;
  flex-wrap: nowrap;
  position: sticky;
  top: 16px;
  left: 0;
  background-color: white;
  z-index: 21;
  padding: 2px;
  box-shadow: var(--a-shadow-medium);
  margin-bottom: 16px;
  grid-area: toolbar;
`;

export const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
`;
