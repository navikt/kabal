import { ErrorColored, SuccessColored } from '@navikt/ds-icons';
import { Loader } from '@navikt/ds-react';
import React from 'react';

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
    return <SuccessColored title="Lagret!" />;
  }

  if (isError) {
    return <ErrorColored title="Feil ved lagring" />;
  }

  return null;
};
