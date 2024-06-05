import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Alert, Button, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { styled } from 'styled-components';
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
  const {
    data: oppgaver,
    isLoading: oppgaverIsLoading,
    isFetching: oppgaverIsFetching,
    refetch: refetchOppgaver,
  } = useSearchOppgaverByFnrQuery(query);
  const {
    data: person,
    isLoading: personIsLoading,
    isFetching: personIsFetching,
    refetch: refetchPerson,
  } = useSearchPersonByFnrQuery(query);

  if (query === skipToken) {
    return null;
  }

  if (oppgaverIsLoading || personIsLoading) {
    return <Loader size="xlarge" />;
  }

  if (typeof oppgaver === 'undefined') {
    return (
      <Alert variant="info" data-testid="search-result-none">
        <AlertContent>
          Ingen registrerte oppgaver på denne personen i Kabal.
          <Button
            icon={<MagnifyingGlassIcon aria-hidden />}
            onClick={refetchOppgaver}
            variant="primary"
            size="small"
            loading={oppgaverIsFetching}
          >
            Søk på nytt
          </Button>
        </AlertContent>
      </Alert>
    );
  }

  if (typeof person === 'undefined') {
    return (
      <Alert variant="info" data-testid="search-result-none">
        <AlertContent>
          Fant ingen person med ID-nummer {formatFoedselsnummer(query)}.
          <Button
            icon={<MagnifyingGlassIcon aria-hidden />}
            onClick={refetchPerson}
            variant="primary"
            size="small"
            loading={personIsFetching}
          >
            Søk på nytt
          </Button>
        </AlertContent>
      </Alert>
    );
  }

  return <Result {...oppgaver} person={person} onRefresh={refetchOppgaver} isLoading={oppgaverIsFetching} />;
};

const useCleanQuery = (queryString: string): string | typeof skipToken => {
  if (!isFnr(queryString)) {
    return skipToken;
  }

  return cleanFnr(queryString);
};

const AlertContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
