import React, { useCallback, useEffect, useState } from 'react';
import { SearchBox } from '../../components/searchbox/searchbox';
import { SearchResults } from '../../components/searchbox/searchresults';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { PersonSoekApiResponse, usePersonsoekMutation } from '../../redux-api/oppgaver';
import { OppgaverPageWrapper } from '../page-wrapper';

const INITIAL_STATE = { antallTreffTotalt: 0, personer: [] };

export const SearchPage = () => {
  const { data: bruker } = useGetBrukerQuery();
  const [personsoek, loader] = usePersonsoekMutation();
  // Do not put the query in the URL. It will be logged, and it may contain fnr.
  const [query, setQuery] = useState<string>('tvilsom saks'); // TODO: Set inital state to empty string.
  const [personsoekResultat, setPersonsoekResultat] = useState<PersonSoekApiResponse>(INITIAL_STATE);

  const getPersonsoekUpdate = useCallback(() => {
    if (bruker === undefined) {
      return;
    }

    personsoek({
      navIdent: bruker.info.navIdent,
      antall: 200,
      start: 0,
      fnr: query,
      soekString: query,
    })
      .unwrap()
      .then(setPersonsoekResultat)
      .catch(() => setPersonsoekResultat(INITIAL_STATE));
  }, [bruker, personsoek, query]);

  useEffect(() => {
    const timeout = setTimeout(getPersonsoekUpdate, 1000);
    return () => clearTimeout(timeout); // Clear existing timer every time it runs.
  }, [getPersonsoekUpdate, personsoek, setPersonsoekResultat]);

  const { isLoading } = loader;

  return (
    <OppgaverPageWrapper>
      <SearchBox query={query} setQuery={setQuery} />
      <SearchResults isLoading={isLoading} personsoekResultat={personsoekResultat} />
    </OppgaverPageWrapper>
  );
};
