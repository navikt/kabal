import { Loader } from '@navikt/ds-react';
import React from 'react';
import { CheckmarkCircleFillIconColored, XMarkOctagonFillIconColored } from '../colored-icons/colored-icons';

interface Props {
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
}

export const SavedStatus = ({ isLoading, isSuccess, isError }: Props) => {
  if (isLoading) {
    return <Loader size="xsmall" title="Lagrer..." />;
  }

  if (isSuccess) {
    return <CheckmarkCircleFillIconColored title="Lagret!" />;
  }

  if (isError) {
    return <XMarkOctagonFillIconColored title="Feil ved lagring" />;
  }

  return null;
};
