import React from 'react';
import { LedigeOppgaverTable } from '@app/components/ledige-oppgaver-table/ledige-oppgaver-table';
import { LedigeRolOppgaverTable } from '@app/components/rol-tables/ledige-rol-oppgaver-table';
import { OppgaverPageWrapper } from '../page-wrapper';

export const OppgaverPage = () => (
  <OppgaverPageWrapper testId="ledige-oppgaver-tables">
    <LedigeOppgaverTable />
    <LedigeRolOppgaverTable />
  </OppgaverPageWrapper>
);
