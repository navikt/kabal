import { Alert, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React from 'react';
import { useSearchOppgaverByFnrQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { FullfoerteOppgaverTable } from '../common/fullfoerte-oppgaver-table';
import { LedigeOppgaverTable } from '../common/ledige-oppgaver-table';
import { StyledOppgaverContainer } from '../common/styled-components';

interface Props {
  open: boolean;
  fnr: string;
}

export const Oppgaver = ({ open, fnr }: Props) => {
  const { data, isFetching, isUninitialized, refetch } = useSearchOppgaverByFnrQuery(open ? fnr : skipToken, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

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

    return <Alert variant="info">Ingen registrerte oppgaver på denne personen i Kabal</Alert>;
  }

  const { aapneBehandlinger, avsluttedeBehandlinger } = data;

  return (
    <StyledOppgaverContainer data-testid="search-result-expanded-container">
      <LedigeOppgaverTable oppgaveIds={aapneBehandlinger} onRefresh={refetch} isLoading={isFetching} />
      <FullfoerteOppgaverTable oppgaveIds={avsluttedeBehandlinger} onRefresh={refetch} isLoading={isFetching} />
    </StyledOppgaverContainer>
  );
};
