import { Alert, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React from 'react';
import { usePersonAndOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Result } from './result';

const FNR_REGEX = /^\s*\d{6}\s*\d{5}\s*$/;
const isFnr = (query: string) => FNR_REGEX.test(query);
const cleanFnr = (fnr: string) => fnr.replaceAll(/\s+/gi, '');

interface Props {
  queryString: string;
}

export const FnrSearch = ({ queryString }: Props) => {
  const query = useCleanQuery(queryString);
  const { data, isFetching } = usePersonAndOppgaverQuery(query);

  if (query === skipToken) {
    return null;
  }

  if (isFetching) {
    return <Loader size="xlarge" />;
  }

  if (typeof data === 'undefined') {
    return (
      <Alert variant="info" data-testid="search-result-none">
        Ingen registrerte klager på denne personen i Kabal
      </Alert>
    );
  }

  return <Result {...data} />;
};

const useCleanQuery = (queryString: string): string | typeof skipToken => {
  if (!isFnr(queryString)) {
    return skipToken;
  }

  return cleanFnr(queryString);
};
