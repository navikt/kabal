import { ToastType } from '@app/components/toast/types';
import { BoxNew, type BoxNewProps, Button, type ButtonProps, HGrid, VStack } from '@navikt/ds-react';
import type { FragmentProps } from 'react';

export const Container = ({ children }: FragmentProps) => (
  <HGrid columns="var(--ax-space-24) 1fr" align="center" gap="2" className="hyphens-auto whitespace-pre-wrap">
    {children}
  </HGrid>
);

export const StyledCloseButton = (props: Omit<ButtonProps, 'className'>) => (
  <Button {...props} className="absolute top-0 right-0 text-ax-text-neutral" />
);

interface ToastContainerProps extends FragmentProps {
  type: ToastType;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const ToastContainer = ({ children, className, type, ...rest }: ToastContainerProps) => (
  <VStack asChild position="relative" width="300px" {...rest}>
    <BoxNew
      as="section"
      background={TYPE_TO_BACKGROUND_COLOR[type]}
      borderColor={TYPE_TO_BORDER_COLOR[type]}
      borderWidth="1"
      borderRadius="medium"
      padding="space-16"
      className={`text-ax-text-neutral ${className}`}
    >
      {children}
    </BoxNew>
  </VStack>
);

interface TimedToastContainerProps extends ToastContainerProps {
  duration: number;
}

export const TimedToastContainer = ({ children, type, duration, className, ...rest }: TimedToastContainerProps) => (
  <ToastContainer type={type} className={`group/toast animate-slide-in ${className}`} {...rest}>
    {children}
    <Timer type={type} duration={duration} />
  </ToastContainer>
);

interface TimerProps {
  duration: number;
  type: ToastType;
}

const Timer = ({ duration, type }: TimerProps) => (
  <BoxNew
    role="presentation"
    aria-hidden
    position="absolute"
    bottom="0"
    left="0"
    right="0"
    width="100%"
    borderWidth="0 0 4 0"
    borderColor={TYPE_TO_BORDER_COLOR[type]}
    style={{
      animationDuration: `${duration - SLIDE_DURATION}ms`,
    }}
    className="origin-left animate-forwards animate-linear animate-once animate-timer group-hover/toast:animate-paused"
  />
);

const TYPE_TO_BACKGROUND_COLOR: Record<ToastType, BoxNewProps['background']> = {
  [ToastType.SUCCESS]: 'success-moderate',
  [ToastType.ERROR]: 'danger-moderate',
  [ToastType.INFO]: 'info-moderate',
  [ToastType.WARNING]: 'warning-moderate',
};

const TYPE_TO_BORDER_COLOR: Record<ToastType, BoxNewProps['borderColor']> = {
  [ToastType.SUCCESS]: 'success',
  [ToastType.ERROR]: 'danger',
  [ToastType.INFO]: 'info',
  [ToastType.WARNING]: 'warning',
};

export const SLIDE_DURATION = 150;
