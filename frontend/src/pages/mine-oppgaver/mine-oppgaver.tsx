import { FullfoerteOppgaverTable } from '@/components/fullfoerte-oppgaver-table/fullfoerte-oppgaver-table';
import { MineOppgaverTable } from '@/components/mine-oppgaver-table/mine-oppgaver-table';
import { OppgaverPaaVentTable } from '@/components/oppgaver-paa-vent-table/oppgaver-paa-vent-table';
import { MineRolOppgaverTable } from '@/components/rol-tables/mine-rol-oppgaver-table';
import { ReturnerteRolOppgaverTable } from '@/components/rol-tables/returnerte-rol-oppgaver-table';
import { OppgaverPageWrapper } from '@/pages/page-wrapper';

export const MineOppgaverPage = () => (
  <OppgaverPageWrapper testId="mine-oppgaver-tables">
    <MineOppgaverTable />
    <MineRolOppgaverTable />
    <OppgaverPaaVentTable />
    <FullfoerteOppgaverTable />
    <ReturnerteRolOppgaverTable />
  </OppgaverPageWrapper>
);
