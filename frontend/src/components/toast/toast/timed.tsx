import { Icon } from '@app/components/toast/toast/icon';
import { Container, StyledCloseButton, TimedToastContainer } from '@app/components/toast/toast/shared';
import type { TimedMessage } from '@app/components/toast/types';
import { useAnimationsEnabled } from '@app/hooks/use-animations-enabled';
import { XMarkIcon } from '@navikt/aksel-icons';
import { VStack } from '@navikt/ds-react';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';

interface Props extends TimedMessage {
  slideOut: () => void;
}

export const TimedToast = forwardRef<HTMLDivElement, Props>(
  ({ type, content, slideOut, expiresAt, id }, forwardedRef) => {
    const ref = useRef<HTMLDivElement>(null);
    // biome-ignore lint/style/noNonNullAssertion: Guaranteed to not be null.
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
        if (event.animationName !== 'timer') {
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
      <TimedToastContainer type={type} ref={ref} key={id} duration={duration}>
        <StyledCloseButton
          variant="tertiary-neutral"
          size="xsmall"
          onClick={slideOut}
          icon={<XMarkIcon aria-hidden />}
        />
        <Container>
          <Icon type={type} />
          <VStack gap="2 0">{content}</VStack>
        </Container>
      </TimedToastContainer>
    );
  },
);

TimedToast.displayName = 'TimedToast';
