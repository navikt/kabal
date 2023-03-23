import { Alert, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React from 'react';
import { usePersonAndOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
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
    return <Loader size="xlarge" />;
  }

  if (typeof data === 'undefined') {
    if (isUninitialized) {
      return null;
    }

    return <Alert variant="info">Ingen registrerte klager på denne personen i Kabal</Alert>;
  }

  const { aapneBehandlinger: aapneKlagebehandlinger, avsluttedeBehandlinger: avsluttedeKlagebehandlinger } = data;

  return (
    <StyledOppgaverContainer data-testid="search-result-expanded-container">
      <ActiveOppgaverTable activeOppgaver={aapneKlagebehandlinger} />
      <FullfoerteOppgaverTable finishedOppgaver={avsluttedeKlagebehandlinger} />
    </StyledOppgaverContainer>
  );
};
