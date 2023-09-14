import React from 'react';
import { FullfoerteOppgaverTable } from '@app/components/fullfoerte-oppgaver-table/fullfoerte-oppgaver-table';
import { MineOppgaverTable } from '@app/components/mine-oppgaver-table/mine-oppgaver-table';
import { OppgaverPaaVentTable } from '@app/components/oppgaver-paa-vent-table/oppgaver-paa-vent-table';
import { MineRolOppgaverTable } from '@app/components/rol-tables/mine-rol-oppgaver-table';
import { ReturnerteRolOppgaverTable } from '@app/components/rol-tables/returnerte-rol-oppgaver-table';
import { OppgaverPageWrapper } from '../page-wrapper';

export const MineOppgaverPage = () => (
  <OppgaverPageWrapper testId="mine-oppgaver-tables">
    <MineOppgaverTable />
    <MineRolOppgaverTable />
    <OppgaverPaaVentTable />
    <FullfoerteOppgaverTable />
    <ReturnerteRolOppgaverTable />
  </OppgaverPageWrapper>
);

// eslint-disable-next-line import/no-default-export
export default MineOppgaverPage;
