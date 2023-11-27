import { XMarkIcon } from '@navikt/aksel-icons';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  CheckmarkCircleFillIconColored,
  ExclamationmarkTriangleFillIconColored,
  InformationSquareFillIconColored,
  XMarkOctagonFillIconColored,
} from '@app/components/colored-icons/colored-icons';
import { Container, Content, StyledCloseButton, StyledToast } from '@app/components/toast/styled-components';
import { SLIDE_DURATION, TOAST_TIMEOUT } from './constants';
import { Message } from './store';
import { ToastType } from './types';

export const Toast = memo(
  ({ type, message, close, setExpiresAt, expiresAt }: Message) => {
    const ref = useRef<HTMLDivElement>(null);
    const [remaining, setRemaining] = useState<number | null>(null);
    const mouse = useRef<MouseEvent | null>(null);

    const onMouseLeave = useCallback(() => {
      setExpiresAt(Date.now() + (remaining === null || remaining === Infinity ? TOAST_TIMEOUT : remaining));
      setRemaining(null);
    }, [remaining, setExpiresAt]);

    const onMouseEnter = useCallback(() => {
      setRemaining(expiresAt - Date.now());
      setExpiresAt(Infinity);
    }, [expiresAt, setExpiresAt]);

    useEffect(() => {
      const listener = (e: MouseEvent) => {
        mouse.current = e;
      };

      window.addEventListener('mousemove', listener);

      return () => window.removeEventListener('mousemove', listener);
    }, []);

    useEffect(() => {
      if (mouse.current === null) {
        return;
      }

      const { target } = mouse.current;

      if (
        expiresAt === Infinity &&
        ref.current !== null &&
        target instanceof global.Node &&
        ref.current !== target &&
        !ref.current.contains(target)
      ) {
        onMouseLeave();
      }
    }, [expiresAt, onMouseLeave]);

    const slideOut = useCallback(() => {
      if (ref.current === null) {
        return close();
      }

      const anim = ref.current.animate(SLIDE_OUT_KEYFRAMES, SLIDE_OUT_OPTIONS);

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

const SLIDE_OUT_KEYFRAMES: Keyframe[] = [
  { transform: 'translateX(0%)' },
  { transform: 'translateX(calc(100% + 8px))' },
];

const SLIDE_OUT_OPTIONS: KeyframeAnimationOptions = {
  duration: SLIDE_DURATION,
  easing: 'ease-in-out',
  fill: 'forwards',
};

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
