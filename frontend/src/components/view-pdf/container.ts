import { styled } from 'styled-components';

interface ContainerProps {
  width: number;
}

export const Container = styled.section<ContainerProps>`
  display: flex;
  flex-direction: column;
  min-width: ${(props) => props.width}px;
  margin: 4px 8px;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  position: relative;
  height: 100%;
  scroll-snap-align: start;
`;
