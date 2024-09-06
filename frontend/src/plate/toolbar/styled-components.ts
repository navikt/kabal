import { styled } from 'styled-components';

export const StyledToolbar = styled.section`
  display: flex;
  justify-content: center;
  width: 210mm;
  flex-direction: row;
  flex-wrap: nowrap;
  position: sticky;
  top: var(--a-spacing-4);
  left: 0;
  background-color: var(--a-bg-default);
  z-index: 21;
  padding: var(--a-spacing-05);
  box-shadow: var(--a-shadow-medium);
  margin-bottom: var(--a-spacing-4);
  grid-area: toolbar;
`;

export const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
`;
