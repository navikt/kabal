import { styled } from 'styled-components';

export const StyledToolbar = styled.section`
  display: flex;
  justify-content: center;
  width: 210mm;
  flex-direction: row;
  flex-wrap: nowrap;
  position: sticky;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 21;
  padding: 2px;
  box-shadow: var(--a-shadow-medium);
`;

export const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
`;
