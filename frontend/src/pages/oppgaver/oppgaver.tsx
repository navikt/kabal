import React from 'react';
import { LedigeOppgaverTable } from '@app/components/ledige-oppgaver-table/ledige-oppgaver-table';
import { OppgaverPageWrapper } from '../page-wrapper';

export const OppgaverPage = () => (
  <OppgaverPageWrapper>
    <LedigeOppgaverTable />
  </OppgaverPageWrapper>
);

// eslint-disable-next-line import/no-default-export
export default OppgaverPage;
