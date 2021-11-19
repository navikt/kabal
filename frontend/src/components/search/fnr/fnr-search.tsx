import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import AlertStripe from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useGetBrukerQuery } from '../../../redux-api/bruker';
import { IFnrSearchParams, useFnrSearchQuery } from '../../../redux-api/oppgaver';
import { Result } from './result';

const FNR_REGEX = /^\s*\d{6}\s*\d{5}\s*$/;
const isFnr = (query: string) => FNR_REGEX.test(query);
const cleanFnr = (fnr: string) => fnr.replaceAll(/\s+/gi, '');

interface Props {
  queryString: string;
}

export const FnrSearch = ({ queryString }: Props) => {
  const query = useGetQuery(queryString);
  const { data, isFetching } = useFnrSearchQuery(query);

  if (query === skipToken) {
    return null;
  }

  if (isFetching) {
    return <NavFrontendSpinner />;
  }

  if (typeof data === 'undefined') {
    return (
      <AlertStripe type="info" data-testid="search-result-none">
        Ingen registrerte klager på denne personen i Kabal
      </AlertStripe>
    );
  }

  return <Result {...data} />;
};

const useGetQuery = (queryString: string): IFnrSearchParams | typeof skipToken => {
  const { data: bruker } = useGetBrukerQuery();

  if (typeof bruker === 'undefined') {
    return skipToken;
  }

  if (!isFnr(queryString)) {
    return skipToken;
  }

  return { query: cleanFnr(queryString), enhet: bruker.valgtEnhetView.id };
};
