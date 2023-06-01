import { Alert, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React from 'react';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { useSearchOppgaverByFnrQuery, useSearchPersonByFnrQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Result } from './result';

const FNR_REGEX = /^\s*\d{6}\s*\d{5}\s*$/;
const isFnr = (query: string) => FNR_REGEX.test(query);
const cleanFnr = (fnr: string) => fnr.replaceAll(/\s+/gi, '');

interface Props {
  queryString: string;
}

export const FnrSearch = ({ queryString }: Props) => {
  const query = useCleanQuery(queryString);
  const { data: oppgaver, isFetching: oppgaverIsFetching, refetch } = useSearchOppgaverByFnrQuery(query);
  const { data: person, isFetching: personIsFetching } = useSearchPersonByFnrQuery(query);

  if (query === skipToken) {
    return null;
  }

  if (oppgaverIsFetching || personIsFetching) {
    return <Loader size="xlarge" />;
  }

  if (typeof oppgaver === 'undefined') {
    return (
      <Alert variant="info" data-testid="search-result-none">
        Ingen registrerte oppgaver på denne personen i Kabal.
      </Alert>
    );
  }

  if (typeof person === 'undefined') {
    return (
      <Alert variant="info" data-testid="search-result-none">
        Fant ingen person med ID-nummer {formatFoedselsnummer(query)}.
      </Alert>
    );
  }

  return <Result {...oppgaver} person={person} onRefresh={refetch} isLoading={oppgaverIsFetching} />;
};

const useCleanQuery = (queryString: string): string | typeof skipToken => {
  if (!isFnr(queryString)) {
    return skipToken;
  }

  return cleanFnr(queryString);
};
