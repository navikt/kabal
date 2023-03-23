import React from 'react';
import { OppgaveTable } from '@app/components/oppgave-table/oppgave-table';
import { OppgaverPageWrapper } from '../page-wrapper';

export const OppgaverPage = () => (
  <OppgaverPageWrapper>
    <OppgaveTable />
  </OppgaverPageWrapper>
);

// eslint-disable-next-line import/no-default-export
export default OppgaverPage;
