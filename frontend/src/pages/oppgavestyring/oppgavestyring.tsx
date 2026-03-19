import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { EnhetensFerdigstilteOppgaverTable } from '@/components/enhetens-ferdigstilte-oppgaver-table /enhetens-ferdigstilte-oppgaver-table';
import { EnhetensOppgaverPaaVentTable } from '@/components/enhetens-oppgaver-paa-vent-table/enhetens-oppgaver-paa-vent-table';
import { EnhetensOppgaverTable } from '@/components/enhetens-oppgaver-table/enhetens-oppgaver-table';
import { ReturnerteRolOppgaverTable } from '@/components/rol/returnerte-table';
import { RolOppgaverTable } from '@/components/rol/under-arbeid-table';
import { OppgaverPageWrapper } from '@/pages/page-wrapper';

export const OppgavestyringPage = () => {
  const { user } = useContext(StaticDataContext);

  return (
    <OppgaverPageWrapper title={`Oppgavestyring - ${user.ansattEnhet.navn}`} testId="oppgavestyring-oppgaver-tables">
      <EnhetensOppgaverTable />
      <RolOppgaverTable />

      <EnhetensOppgaverPaaVentTable />

      <EnhetensFerdigstilteOppgaverTable />
      <ReturnerteRolOppgaverTable />
    </OppgaverPageWrapper>
  );
};
