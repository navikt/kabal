import { Loader } from '@navikt/ds-react';
import React from 'react';
import { FeilregistrerteOppgaverTable } from '@app/components/search/common/feilregistrerte-oppgaver-table';
import { OppgaverPaaVentTable } from '@app/components/search/common/oppgaver-paa-vent-table';
import { useSearchOppgaverByFnrQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { FullfoerteOppgaverTable } from '../common/fullfoerte-oppgaver-table';
import { LedigeOppgaverTable } from '../common/ledige-oppgaver-table';
import { StyledOppgaverContainer } from '../common/styled-components';

interface Props {
  fnr: string;
}

export const Oppgaver = ({ fnr }: Props) => {
  const { data, isFetching, isLoading, refetch } = useSearchOppgaverByFnrQuery(fnr, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading || typeof data === 'undefined') {
    return <Loader size="xlarge" />;
  }

  const { aapneBehandlinger, avsluttedeBehandlinger, feilregistrerteBehandlinger, paaVentBehandlinger } = data;

  return (
    <StyledOppgaverContainer data-testid="search-result-expanded-container">
      <LedigeOppgaverTable oppgaveIds={aapneBehandlinger} onRefresh={refetch} isLoading={isFetching} />
      <OppgaverPaaVentTable oppgaveIds={paaVentBehandlinger} onRefresh={refetch} isLoading={isFetching} />
      <FullfoerteOppgaverTable oppgaveIds={avsluttedeBehandlinger} onRefresh={refetch} isLoading={isFetching} />
      <FeilregistrerteOppgaverTable
        oppgaveIds={feilregistrerteBehandlinger}
        onRefresh={refetch}
        isLoading={isFetching}
      />
    </StyledOppgaverContainer>
  );
};
