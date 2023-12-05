import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Alert, Button, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useCallback, useEffect, useMemo } from 'react';
import { styled } from 'styled-components';
import { useLazySearchPeopleByNameQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { INameSearchParams } from '@app/types/oppgaver';
import { SearchResults } from './searchresults';

interface NameSearchProps {
  queryString: string;
}

const NUMBER_REGEX = /\d+/;
const containsNumber = (query: string) => NUMBER_REGEX.test(query);

export const NameSearch = ({ queryString }: NameSearchProps) => {
  const query = useGetQuery(queryString);
  const [_search, { data, isLoading, isFetching }] = useLazySearchPeopleByNameQuery();

  const search = useCallback(() => {
    if (query !== skipToken) {
      _search(query);
    }
  }, [query, _search]);

  useEffect(() => {
    const timeout = setTimeout(search, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  if (query === skipToken) {
    return null;
  }

  if (typeof data === 'undefined') {
    return <Loader size="xlarge" />;
  }

  if (data.people.length === 0) {
    return (
      <Alert variant="info" data-testid="search-result-none">
        <AlertContent>
          Ingen registrerte oppgaver på denne personen i Kabal.
          <Button
            icon={<MagnifyingGlassIcon aria-hidden />}
            onClick={search}
            variant="primary"
            size="small"
            loading={isLoading || isFetching}
          >
            Søk på nytt
          </Button>
        </AlertContent>
      </Alert>
    );
  }

  return <SearchResults people={data.people} onRefresh={search} isLoading={isLoading} isFetching={isFetching} />;
};

const useGetQuery = (queryString: string): INameSearchParams | typeof skipToken =>
  useMemo(() => {
    if (queryString.length === 0) {
      return skipToken;
    }

    if (containsNumber(queryString)) {
      return skipToken;
    }

    return { query: queryString, antall: 200, start: 0 };
  }, [queryString]);

const AlertContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
