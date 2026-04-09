import { withFaroProfiler } from '@grafana/faro-react';
import { LedigeOppgaverTable } from '@/components/ledige-oppgaver-table/ledige-oppgaver-table';
import { LedigeRolOppgaverTable } from '@/components/rol-tables/ledige-rol-oppgaver-table';
import { OppgaverPageWrapper } from '@/pages/page-wrapper';

const OppgaverPageComponent = () => (
  <OppgaverPageWrapper>
    <LedigeOppgaverTable />
    <LedigeRolOppgaverTable />
  </OppgaverPageWrapper>
);

export const OppgaverPage = withFaroProfiler(OppgaverPageComponent);
