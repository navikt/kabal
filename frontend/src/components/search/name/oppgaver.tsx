import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useGetBrukerQuery } from '../../../redux-api/bruker';
import { IFnrSearchParams, useFnrSearchQuery } from '../../../redux-api/oppgaver';
import { ActiveOppgaverTable } from '../common/active-oppgaver-table';
import { FullfoerteOppgaverTable } from '../common/fullfoerte-oppgaver-table';
import { StyledOppgaverContainer } from '../common/oppgaver-container';

interface Props {
  open: boolean;
  fnr: string;
}

export const Oppgaver = ({ open, fnr }: Props) => {
  const query = useGetQuery(fnr, open);
  const { data, isFetching, isError } = useFnrSearchQuery(query);

  if (!open || typeof data === 'undefined') {
    return null;
  }

  if (isFetching || isError) {
    return <NavFrontendSpinner />;
  }

  const { aapneKlagebehandlinger, avsluttedeKlagebehandlinger } = data;

  return (
    <StyledOppgaverContainer data-testid="search-result-expanded-container">
      <ActiveOppgaverTable activeOppgaver={aapneKlagebehandlinger} />
      <FullfoerteOppgaverTable finishedOppgaver={avsluttedeKlagebehandlinger} />
    </StyledOppgaverContainer>
  );
};

const useGetQuery = (fnr: string, open: boolean): IFnrSearchParams | typeof skipToken => {
  const { data: bruker } = useGetBrukerQuery();

  if (!open) {
    return skipToken;
  }

  if (typeof bruker === 'undefined') {
    return skipToken;
  }

  return { query: fnr, enhet: bruker.valgtEnhetView.id };
};
