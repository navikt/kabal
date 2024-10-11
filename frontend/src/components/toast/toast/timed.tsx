import { SCALE_X } from '@app/components/toast/toast/animations';
import { Icon } from '@app/components/toast/toast/icon';
import { Container, Content, StyledCloseButton, TimedToastStyle } from '@app/components/toast/toast/styled-components';
import type { TimedMessage } from '@app/components/toast/types';
import { useAnimationsEnabled } from '@app/hooks/use-animations-enabled';
import { XMarkIcon } from '@navikt/aksel-icons';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';

interface Props extends TimedMessage {
  slideOut: () => void;
}

export const TimedToast = forwardRef<HTMLDivElement, Props>(
  ({ type, content, slideOut, expiresAt, id }, forwardedRef) => {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);
    const animationsEnabled = useAnimationsEnabled();
    const duration = useMemo(() => expiresAt - Date.now(), [expiresAt]);

    useEffect(() => {
      if (animationsEnabled) {
        return;
      }

      const t = setTimeout(slideOut, duration);

      return () => clearTimeout(t);
    }, [animationsEnabled, slideOut, duration]);

    useEffect(() => {
      if (!animationsEnabled) {
        return;
      }

      const element = ref.current;

      if (element === null) {
        return;
      }

      const listener = (event: AnimationEvent) => {
        if (event.animationName !== SCALE_X.name) {
          return;
        }

        slideOut();
      };

      element.addEventListener('animationend', listener);

      return () => {
        element.removeEventListener('animationend', listener);
      };
    }, [animationsEnabled, slideOut]);

    return (
      <TimedToastStyle $type={type} ref={ref} key={id} $duration={duration}>
        <StyledCloseButton variant="tertiary" size="xsmall" onClick={slideOut} icon={<XMarkIcon aria-hidden />} />
        <Container>
          <Icon type={type} />
          <Content>{content}</Content>
        </Container>
      </TimedToastStyle>
    );
  },
);

TimedToast.displayName = 'TimedToast';
