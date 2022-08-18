import { Error, MinusCircle, Sandglass, Success } from '@navikt/ds-icons';
import React from 'react';

interface StatusIconProps {
  success: boolean;
  init: boolean;
  isLoading: boolean;
}

export const StatusIcon = ({ success, init, isLoading }: StatusIconProps) => {
  if (!init) {
    return <MinusCircle aria-hidden />;
  }

  if (isLoading) {
    return <Sandglass aria-hidden />;
  }

  return success ? <Success aria-hidden /> : <Error aria-hidden />;
};
