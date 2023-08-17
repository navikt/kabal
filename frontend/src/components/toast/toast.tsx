import { XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { keyframes, styled } from 'styled-components';
import {
  CheckmarkCircleFillIconColored,
  ExclamationmarkTriangleFillIconColored,
  InformationSquareFillIconColored,
  XMarkOctagonFillIconColored,
} from '@app/components/colored-icons/colored-icons';
import { SLIDE_DURATION, TOAST_TIMEOUT } from './constants';
import { Message } from './store';
import { ToastType } from './types';

export const Toast = memo(
  ({ type, message, close, setExpiresAt, expiresAt }: Message) => {
    const ref = useRef<HTMLDivElement>(null);
    const [remaining, setRemaining] = useState<number | null>(null);

    const onMouseLeave = () => {
      setExpiresAt(Date.now() + (remaining === null || remaining === Infinity ? TOAST_TIMEOUT : remaining));
      setRemaining(null);
    };

    const onMouseEnter = () => {
      setRemaining(expiresAt - Date.now());
      setExpiresAt(Infinity);
    };

    const slideOut = useCallback(() => {
      if (ref.current === null) {
        close();

        return;
      }

      const anim = ref.current.animate([{ transform: 'translateX(0%)' }, { transform: 'translateX(100%)' }], {
        duration: SLIDE_DURATION,
        easing: 'ease-in-out',
        fill: 'forwards',
      });

      anim.addEventListener('finish', close);
    }, [close]);

    useEffect(() => {
      if (expiresAt === Infinity) {
        return;
      }

      const timeout = expiresAt - Date.now() - SLIDE_DURATION;
      const timer = setTimeout(slideOut, timeout);

      return () => clearTimeout(timer);
    }, [expiresAt, slideOut]);

    const paused = remaining !== null;

    return (
      <StyledToast $type={type} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} $paused={paused} ref={ref}>
        <StyledCloseButton variant="tertiary" size="xsmall" onClick={slideOut} icon={<XMarkIcon aria-hidden />} />
        <Container>
          <Icon type={type} />
          <Content>{message}</Content>
        </Container>
      </StyledToast>
    );
  },
  (prevProps, nextProps) => prevProps.id === nextProps.id && prevProps.expiresAt === nextProps.expiresAt,
);

Toast.displayName = 'Toast';

interface IconProps {
  type: ToastType;
}

const Icon = ({ type }: IconProps) => {
  switch (type) {
    case ToastType.SUCCESS:
      return <CheckmarkCircleFillIconColored aria-hidden />;
    case ToastType.ERROR:
      return <XMarkOctagonFillIconColored aria-hidden />;
    case ToastType.INFO:
      return <InformationSquareFillIconColored aria-hidden />;
    case ToastType.WARNING:
      return <ExclamationmarkTriangleFillIconColored aria-hidden />;
  }
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  column-gap: 8px;
  white-space: pre-wrap;
  hyphens: auto;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const StyledCloseButton = styled(Button)`
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

const StyledToast = styled.section<{ $type: ToastType; $paused: boolean }>`
  color: black;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({ $type }) => getSubtleColor($type)};
  border-radius: var(--a-border-radius-medium);
  width: 300px;
  padding: var(--a-spacing-4);
  border: 1px solid ${({ $type }) => getColor($type)};
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
    animation-duration: ${TOAST_TIMEOUT - SLIDE_DURATION}ms;
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
