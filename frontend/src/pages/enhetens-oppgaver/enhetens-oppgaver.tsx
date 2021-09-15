import React from 'react';
import { EnhetensOppgaverTable } from '../../components/enhetens-oppgaver-table/enhetens-oppgaver-table';
import { OppgaverPageWrapper } from '../page-wrapper';

export const EnhetensOppgaverPage: React.FC = () => (
  <OppgaverPageWrapper>
    <EnhetensOppgaverTable />
  </OppgaverPageWrapper>
);
