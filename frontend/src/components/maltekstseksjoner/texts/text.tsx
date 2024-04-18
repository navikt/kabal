import { Alert, Loader } from '@navikt/ds-react';
import React from 'react';
import { useGetTextByIdQuery } from '@app/redux-api/texts/queries';
import { isApiError } from '@app/types/errors';

interface Props {
  textId: string;
  isActive: boolean;
  setActive: (textId: string) => void;
  maltekstseksjonId: string;
  className?: string;
}

export const Text = ({ textId, className, ...rest }: Props) => {
  const { data, isLoading, isError, error } = useGetTextByIdQuery(textId);

  if (isError) {
    return (
      <div className={className}>
        <Alert variant="error" inline size="small">
          Feil ved lasting: {'data' in error && isApiError(error.data) ? error.data.detail : 'Ukjent feil'}
        </Alert>
      </div>
    );
  }

  if (isLoading || data === undefined) {
    return (
      <div className={className}>
        <Loader />
      </div>
    );
  }

  return <div className={className}>Data: {JSON.stringify(data)}</div>;
};
