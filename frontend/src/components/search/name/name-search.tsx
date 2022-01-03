import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import AlertStripe from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useNameSearchQuery } from '../../../redux-api/oppgaver';
import { INameSearchParams } from '../../../types/oppgaver';
import { SearchResults } from './searchresults';

interface NameSearchProps {
  queryString: string;
}

const NUMBER_REGEX = /\d+/;
const containsNumber = (query: string) => NUMBER_REGEX.test(query);

export const NameSearch = ({ queryString }: NameSearchProps) => {
  const query = useGetQuery(queryString);
  const { data, isFetching } = useNameSearchQuery(query);

  if (query === skipToken) {
    return null;
  }

  if (isFetching || typeof data === 'undefined') {
    return <NavFrontendSpinner />;
  }

  if (data.people.length === 0) {
    return (
      <AlertStripe type="info" data-testid="search-result-none">
        Ingen registrerte klager på denne personen i Kabal
      </AlertStripe>
    );
  }

  return <SearchResults people={data.people} />;
};

const useGetQuery = (queryString: string): INameSearchParams | typeof skipToken => {
  if (queryString.length === 0) {
    return skipToken;
  }

  if (containsNumber(queryString)) {
    return skipToken;
  }

  return { query: queryString, antall: 200, start: 0 };
};
