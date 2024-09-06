import { styled } from 'styled-components';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin: var(--a-spacing-1) var(--a-spacing-2);
  background-color: var(--a-bg-default);
  box-shadow: var(--a-shadow-medium);
  border-radius: var(--a-border-radius-medium);
  position: relative;
  height: 100%;
  scroll-snap-align: start;
`;

export const ErrorOrLoadingContainer = styled(Container)`
  align-items: center;
  justify-content: center;
`;
