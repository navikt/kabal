import { Button } from '@navikt/ds-react';
import { keyframes, styled } from 'styled-components';
import { SLIDE_DURATION } from '@app/components/toast/constants';
import { ToastType } from '@app/components/toast/types';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  column-gap: 8px;
  white-space: pre-wrap;
  hyphens: auto;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

export const StyledCloseButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  color: black;
`;

const scaleX = keyframes`
  from {
    transform: scaleX(100%);
  }

  to {
    transform: scaleX(0%);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0%);
  }
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
`;

interface TimedToastProps {
  $paused: boolean;
  $timeout: number;
}

export const TimedToastStyle = styled(BaseToastStyle)<TimedToastProps>`
  animation-name: ${slideIn};
  animation-duration: ${SLIDE_DURATION}ms;
  animation-timing-function: ease-in-out;
  animation-delay: 0ms;
  animation-play-state: 'running';
  animation-fill-mode: forwards;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: ${({ $type }) => getColor($type)};
    transform-origin: left;
    animation-play-state: ${({ $paused }) => ($paused ? 'paused' : 'running')};
    animation-name: ${scaleX};
    animation-duration: ${({ $timeout }) => $timeout - SLIDE_DURATION}ms;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
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
