import { Error, MinusCircle, Sandglass, Success } from '@navikt/ds-icons';
import React from 'react';

interface StatusIconProps {
  success: boolean;
  init: boolean;
  isLoading: boolean;
}

export const StatusIcon = ({ success, init, isLoading }: StatusIconProps) => {
  if (!init) {
    return <MinusCircle />;
  }

  if (isLoading) {
    return <Sandglass />;
  }

  return success ? <Success /> : <Error />;
};
