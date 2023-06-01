import { Alert, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect, useMemo } from 'react';
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
  const [search, { data, isFetching }] = useLazySearchPeopleByNameQuery();

  useEffect(() => {
    if (query === skipToken) {
      return;
    }

    const timeout = setTimeout(() => {
      search(query);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [query, search]);

  if (query === skipToken) {
    return null;
  }

  if (isFetching || typeof data === 'undefined') {
    return <Loader size="xlarge" />;
  }

  if (data.people.length === 0) {
    return (
      <Alert variant="info" data-testid="search-result-none">
        Ingen registrerte klager på denne personen i Kabal
      </Alert>
    );
  }

  return <SearchResults people={data.people} />;
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
