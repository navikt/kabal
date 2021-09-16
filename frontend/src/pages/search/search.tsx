import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useMemo, useState } from 'react';
import { SearchBox } from '../../components/searchbox/searchbox';
import { SearchResults } from '../../components/searchresults/searchresults';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { LoadPersonSoekParams, usePersonsoekQuery } from '../../redux-api/oppgaver';
import { OppgaverPageWrapper } from '../page-wrapper';

export const SearchPage: React.FC = () => {
  const { data: bruker } = useGetBrukerQuery();
  const [query, setQuery] = useState<string>('');

  // const queryParams: typeof skipToken | LoadPersonSoekParams =
  //   typeof bruker === 'undefined'
  //     ? skipToken
  //     : {
  //         navIdent: bruker.onPremisesSamAccountName,
  //         antall: 200,
  //         start: 0,
  //         fnr: query,
  //         soekString: query,
  //       };

  const setChangesWithDebounce = (query: string) => {
    const timeout = setTimeout(() => {
      setQuery(query);
    }, 1000);
    return () => clearTimeout(timeout); // Clear existing timer every time it runs.
  };

  const queryParams: typeof skipToken | LoadPersonSoekParams = useMemo(
    () =>
      typeof bruker === 'undefined'
        ? skipToken
        : {
            navIdent: bruker.onPremisesSamAccountName,
            antall: 200,
            start: 0,
            fnr: query,
            soekString: query,
          },
    [bruker, query]
  );

  const { data: personsoek } = usePersonsoekQuery(queryParams);

  return (
    <OppgaverPageWrapper>
      <SearchBox onChange={(query: string) => setChangesWithDebounce(query)} />
      <SearchResults personsoek={personsoek}/>
    </OppgaverPageWrapper>
  );
};
