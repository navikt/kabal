import React from 'react';
import { EnhetensFerdigstilteOppgaverTable } from '@app/components/enhetens-ferdigstilte-oppgaver-table /enhetens-ferdigstilte-oppgaver-table';
import { EnhetensOppgaverPaaVentTable } from '@app/components/enhetens-oppgaver-paa-vent-table/enhetens-oppgaver-paa-vent-table';
import { EnhetensOppgaverTable } from '@app/components/enhetens-oppgaver-table/enhetens-oppgaver-table';
import { useUser } from '@app/simple-api-state/use-user';
import { OppgaverPageWrapper } from '../page-wrapper';

export const EnhetensOppgaverPage = () => {
  const { data: user } = useUser();

  return (
    <OppgaverPageWrapper title={`Enhetens oppgaver - ${user?.ansattEnhet.navn}`}>
      <EnhetensOppgaverTable />
      <EnhetensOppgaverPaaVentTable />
      <EnhetensFerdigstilteOppgaverTable />
    </OppgaverPageWrapper>
  );
};

// eslint-disable-next-line import/no-default-export
export default EnhetensOppgaverPage;
