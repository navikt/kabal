import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useRef } from 'react';
import { styled } from 'styled-components';

export enum Direction {
  LEFT = 0,
  RIGHT = 1,
}

interface Props {
  children: React.ReactNode;
  close: () => void;
  direction: Direction;
}

export const PopupContainer = ({ children, close, direction }: Props) => {
  const ref = useRef(null);
  useOnClickOutside(ref, close);

  return (
    <StyledPanel ref={ref} $direction={direction}>
      {children}
    </StyledPanel>
  );
};

const StyledPanel = styled.div<{ $direction: Direction }>`
  position: absolute;
  left: ${({ $direction }) => ($direction === Direction.LEFT ? 'auto' : '0')};
  right: ${({ $direction }) => ($direction === Direction.RIGHT ? 'auto' : '0')};
  bottom: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-4);
  box-shadow: var(--a-shadow-medium);
  background-color: var(--a-bg-default);
  padding: var(--a-spacing-4);
`;
