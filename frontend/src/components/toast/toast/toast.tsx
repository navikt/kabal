import { XMarkIcon } from '@navikt/aksel-icons';
import { memo, useCallback, useEffect, useRef } from 'react';
import { SLIDE_OUT_KEYFRAMES, SLIDE_OUT_OPTIONS } from '@app/components/toast/toast/animations';
import { CLOSE_TOAST_EVENT_TYPE } from '@app/components/toast/toast/constants';
import { isTimedToast } from '@app/components/toast/toast/helpers';
import { Icon } from '@app/components/toast/toast/icon';
import { BaseToastStyle, Container, Content, StyledCloseButton } from '@app/components/toast/toast/styled-components';
import { TimedToast } from '@app/components/toast/toast/timed';
import { Message } from '@app/components/toast/types';
import { useAnimationsEnabled } from '@app/hooks/use-animations-enabled';

export const Toast = memo(
  (message: Message) => {
    const { id, type, close, content } = message;
    const ref = useRef<HTMLDivElement>(null);
    const animationsEnabled = useAnimationsEnabled();

    const slideOut = useCallback(() => {
      if (!animationsEnabled || ref.current === null) {
        return close();
      }

      const anim = ref.current.animate(SLIDE_OUT_KEYFRAMES, SLIDE_OUT_OPTIONS);

      anim.addEventListener('finish', close);
    }, [animationsEnabled, close]);

    useEffect(() => {
      const element = ref.current;

      if (element === null) {
        return;
      }

      element.addEventListener(CLOSE_TOAST_EVENT_TYPE, slideOut);

      return () => element.removeEventListener(CLOSE_TOAST_EVENT_TYPE, slideOut);
    }, [slideOut]);

    if (isTimedToast(message)) {
      return <TimedToast {...message} key={id} ref={ref} slideOut={slideOut} />;
    }

    return (
      <BaseToastStyle $type={type} ref={ref} key={id}>
        <StyledCloseButton variant="tertiary" size="xsmall" onClick={slideOut} icon={<XMarkIcon aria-hidden />} />
        <Container>
          <Icon type={type} />
          <Content>{content}</Content>
        </Container>
      </BaseToastStyle>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.id !== nextProps.id) {
      return false;
    }

    if ('expiresAt' in prevProps && 'expiresAt' in nextProps) {
      return prevProps.expiresAt === nextProps.expiresAt;
    }

    return true;
  },
);

Toast.displayName = 'Toast';
