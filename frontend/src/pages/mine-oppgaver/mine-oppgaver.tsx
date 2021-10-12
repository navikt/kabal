import React from 'react';
import { FullfoerteOppgaverTable } from '../../components/fullfoerte-oppgaver-table/fullfoerte-oppgaver-table';
import { MineOppgaverTable } from '../../components/mine-oppgaver-table/mine-oppgaver-table';
import { OppgaverPageWrapper } from '../page-wrapper';

export const MineOppgaverPage = () => (
  <OppgaverPageWrapper>
    <MineOppgaverTable />
    <FullfoerteOppgaverTable />
  </OppgaverPageWrapper>
);
