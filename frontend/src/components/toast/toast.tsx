import { Close, ErrorColored, InformationColored, SuccessColored, WarningColored } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
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
      setExpiresAt(Infinity);
      setRemaining(expiresAt - Date.now());
    };

    useEffect(() => {
      if (expiresAt === Infinity || ref.current === null) {
        return;
      }

      const timeout = expiresAt - Date.now() - SLIDE_DURATION;

      const timer = setTimeout(() => {
        if (ref.current === null) {
          return;
        }

        ref.current.animate([{ transform: 'translateX(0%)' }, { transform: 'translateX(100%)' }], {
          duration: SLIDE_DURATION,
          easing: 'ease-in-out',
          fill: 'forwards',
        });
      }, timeout);

      return () => clearTimeout(timer);
    }, [expiresAt]);

    const paused = remaining !== null;

    return (
      <StyledToast $type={type} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} $paused={paused} ref={ref}>
        <StyledCloseButton variant="tertiary" size="xsmall" onClick={close} icon={<Close aria-hidden />} />
        <Container>
          <Icon type={type} />
          <Content>{message}</Content>
        </Container>
      </StyledToast>
    );
  },
  (prevProps, nextProps) => prevProps.id === nextProps.id && prevProps.expiresAt === nextProps.expiresAt
);

Toast.displayName = 'Toast';

interface IconProps {
  type: ToastType;
}

const Icon = ({ type }: IconProps) => {
  switch (type) {
    case ToastType.SUCCESS:
      return <SuccessColored aria-hidden />;
    case ToastType.ERROR:
      return <ErrorColored aria-hidden />;
    case ToastType.INFO:
      return <InformationColored aria-hidden />;
    case ToastType.WARNING:
      return <WarningColored aria-hidden />;
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
  border-radius: 4px;
  width: 300px;
  padding: var(--a-spacing-4);
  border: 1px solid ${({ $type }) => getColor($type)};
  animation-name: ${slideIn};
  animation-duration: ${SLIDE_DURATION}ms;
  animation-timing-function: ease-in-out;
  animation-delay: 0ms;
  animation-play-state: 'running';
  animation-fill-mode: forwards;

  ::after {
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
