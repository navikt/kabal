import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { LocalAlert } from '@/components/local-alert/local-alert';
import { getErrorData } from '@/functions/get-error-data';

interface ErrorAlertProps {
  error: SerializedError | FetchBaseQueryError | undefined;
  refetch: () => void;
  isFetching: boolean;
  children: string;
}

export const ErrorAlert = ({ error, refetch, isFetching, children }: ErrorAlertProps) => {
  const errorData = getErrorData(error);

  return (
    <LocalAlert
      status="error"
      title={
        <>
          {children}: {errorData.title} {errorData.status !== undefined ? `(${errorData.status})` : null}
        </>
      }
    >
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
    </LocalAlert>
  );
};
