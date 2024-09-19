import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getErrorData } from '@app/functions/get-error-data';

interface ErrorAlertProps {
  error: SerializedError | FetchBaseQueryError | undefined;
  refetch: () => void;
  isFetching: boolean;
  children: string;
}

export const ErrorAlert = ({ error, refetch, isFetching, children }: ErrorAlertProps) => {
  const errorData = getErrorData(error);

  return (
    <Alert variant="warning" data-testid="search-result-none">
      <Heading size="xsmall">
        {children}: <br />
        <i>{errorData.title}</i> {errorData.status !== undefined ? `(${errorData.status})` : null}
      </Heading>

      {errorData.detail !== undefined ? <BodyShort>{errorData.detail}</BodyShort> : null}

      <Button
        icon={<MagnifyingGlassIcon aria-hidden />}
        onClick={refetch}
        variant="primary"
        size="small"
        loading={isFetching}
      >
        Søk på nytt
      </Button>
    </Alert>
  );
};
