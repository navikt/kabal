import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import AlertStripe from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { usePersonAndOppgaverQuery } from '../../../redux-api/oppgaver';
import { ActiveOppgaverTable } from '../common/active-oppgaver-table';
import { FullfoerteOppgaverTable } from '../common/fullfoerte-oppgaver-table';
import { StyledOppgaverContainer } from '../common/styled-components';

interface Props {
  open: boolean;
  fnr: string;
}

export const Oppgaver = ({ open, fnr }: Props) => {
  const { data, isFetching, isUninitialized } = usePersonAndOppgaverQuery(open ? fnr : skipToken);

  if (!open) {
    return null;
  }

  if (isFetching) {
    return <NavFrontendSpinner />;
  }

  if (typeof data === 'undefined') {
    if (isUninitialized) {
      return null;
    }

    return <AlertStripe type="info">Ingen registrerte klager på denne personen i Kabal</AlertStripe>;
  }

  const { aapneKlagebehandlinger, avsluttedeKlagebehandlinger } = data;

  return (
    <StyledOppgaverContainer data-testid="search-result-expanded-container">
      <ActiveOppgaverTable activeOppgaver={aapneKlagebehandlinger} />
      <FullfoerteOppgaverTable finishedOppgaver={avsluttedeKlagebehandlinger} />
    </StyledOppgaverContainer>
  );
};
