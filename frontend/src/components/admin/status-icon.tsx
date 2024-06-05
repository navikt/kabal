import { CheckmarkCircleIcon, HourglassIcon, MinusCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';

interface StatusIconProps {
  success: boolean;
  init: boolean;
  isLoading: boolean;
}

export const StatusIcon = ({ success, init, isLoading }: StatusIconProps) => {
  if (!init) {
    return <MinusCircleIcon aria-hidden />;
  }

  if (isLoading) {
    return <HourglassIcon aria-hidden />;
  }

  return success ? <CheckmarkCircleIcon aria-hidden /> : <XMarkOctagonIcon aria-hidden />;
};
