import { Button } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { SCALE_X, SLIDE_DURATION, SLIDE_IN } from '@app/components/toast/toast/animations';
import { ToastType } from '@app/components/toast/types';

export const Container = styled.div`
  display: grid;
  grid-template-columns: var(--a-spacing-6) 1fr;
  align-items: center;
  column-gap: var(--a-spacing-2);
  white-space: pre-wrap;
  hyphens: auto;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-2);
`;

export const StyledCloseButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  color: black;
`;

interface BaseToastProps {
  $type: ToastType;
}

export const BaseToastStyle = styled.section<BaseToastProps>`
  color: black;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({ $type }) => getSubtleColor($type)};
  border-radius: var(--a-border-radius-medium);
  width: 300px;
  padding: var(--a-spacing-4);
  border: 1px solid ${({ $type }) => getColor($type)};

  animation-name: ${SLIDE_IN};
  animation-duration: ${SLIDE_DURATION}ms;
  animation-timing-function: ease-in-out;
  animation-delay: 0ms;
  animation-play-state: running;
  animation-fill-mode: forwards;
`;

interface TimedToastProps {
  /** Animation duration */
  $duration: number;
}

export const TimedToastStyle = styled(BaseToastStyle)<TimedToastProps>`
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: var(--a-spacing-1);
    background-color: ${({ $type }) => getColor($type)};
    transform-origin: left;

    animation-name: ${SCALE_X};
    animation-play-state: running;
    animation-duration: ${({ $duration }) => $duration - SLIDE_DURATION}ms;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  &:hover {
    &::after {
      animation-play-state: paused;
    }
  }
`;

const getSubtleColor = (type: ToastType) => `var(--a-surface-${typeToCss(type)}-subtle)`;
const getColor = (type: ToastType) => `var(--a-border-${typeToCss(type)})`;

const typeToCss = (type: ToastType) => {
  switch (type) {
    case ToastType.SUCCESS:
      return 'success';
    case ToastType.ERROR:
      return 'danger';
    case ToastType.INFO:
      return 'info';
    case ToastType.WARNING:
      return 'warning';
  }
};
