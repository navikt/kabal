import React from 'react';
import { EnhetensOppgaverPaaVentTable } from '@app/components/enhetens-oppgaver-paa-vent-table/enhetens-oppgaver-paa-vent-table';
import { EnhetensOppgaverTable } from '@app/components/enhetens-oppgaver-table/enhetens-oppgaver-table';
import { OppgaverPageWrapper } from '../page-wrapper';

export const EnhetensOppgaverPage = () => (
  <OppgaverPageWrapper>
    <EnhetensOppgaverTable />
    <EnhetensOppgaverPaaVentTable />
  </OppgaverPageWrapper>
);

// eslint-disable-next-line import/no-default-export
export default EnhetensOppgaverPage;
