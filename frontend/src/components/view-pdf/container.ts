import { styled } from 'styled-components';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin: 4px 8px;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: var(--a-border-radius-medium);
  position: relative;
  height: 100%;
  scroll-snap-align: start;
`;
