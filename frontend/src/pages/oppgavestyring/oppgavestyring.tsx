import React from 'react';
import { EnhetensFerdigstilteOppgaverTable } from '@app/components/enhetens-ferdigstilte-oppgaver-table /enhetens-ferdigstilte-oppgaver-table';
import { EnhetensOppgaverPaaVentTable } from '@app/components/enhetens-oppgaver-paa-vent-table/enhetens-oppgaver-paa-vent-table';
import { EnhetensOppgaverTable } from '@app/components/enhetens-oppgaver-table/enhetens-oppgaver-table';
import { ReturnerteRolOppgaverTable } from '@app/components/rol/returnerte-table';
import { RolOppgaverTable } from '@app/components/rol/under-arbeid-table';
import { useUser } from '@app/simple-api-state/use-user';
import { OppgaverPageWrapper } from '../page-wrapper';

export const OppgavestyringPage = () => {
  const { data: user } = useUser();

  return (
    <OppgaverPageWrapper title={`Oppgavestyring - ${user?.ansattEnhet.navn}`} testId="oppgavestyring-oppgaver-tables">
      <EnhetensOppgaverTable />
      <RolOppgaverTable />

      <EnhetensOppgaverPaaVentTable />

      <EnhetensFerdigstilteOppgaverTable />
      <ReturnerteRolOppgaverTable />
    </OppgaverPageWrapper>
  );
};

// eslint-disable-next-line import/no-default-export
export default OppgavestyringPage;