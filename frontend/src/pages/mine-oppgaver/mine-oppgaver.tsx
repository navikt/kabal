import React from 'react';
import { FullfoerteOppgaverTable } from '@app/components/fullfoerte-oppgaver-table/fullfoerte-oppgaver-table';
import { MineOppgaverTable } from '@app/components/mine-oppgaver-table/mine-oppgaver-table';
import { OppgaverPaaVentTable } from '@app/components/oppgaver-paa-vent-table/oppgaver-paa-vent-table';
import { OppgaverPageWrapper } from '../page-wrapper';

export const MineOppgaverPage = () => (
  <OppgaverPageWrapper>
    <MineOppgaverTable />
    <OppgaverPaaVentTable />
    <FullfoerteOppgaverTable />
  </OppgaverPageWrapper>
);

// eslint-disable-next-line import/no-default-export
export default MineOppgaverPage;
