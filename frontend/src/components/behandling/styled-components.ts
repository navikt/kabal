import { styled } from 'styled-components';

export const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  white-space: normal;
  width: 750px;
  grid-column-gap: 1px;
  flex-grow: 1;
`;

export const StyledBehandlingSection = styled.section`
  padding: var(--a-spacing-4);
  min-height: 100%;
`;

export const DateContainer = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: var(--a-spacing-4);
`;
