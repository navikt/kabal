import React from 'react';
import { MineOppgaverTable } from '../../components/mine-oppgaver-table/mine-oppgaver-table';
import { OppgaverPageWrapper } from '../page-wrapper';

export const MineOppgaverPage: React.FC = () => (
  <OppgaverPageWrapper>
    <MineOppgaverTable />
  </OppgaverPageWrapper>
);
