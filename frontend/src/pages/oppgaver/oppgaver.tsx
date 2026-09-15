import { withFaroProfiler } from '@grafana/faro-react';
import { LedigeAnkerAfter2027Table } from '@/components/ledige-anker-after-2027-table/ledige-anker-after-2027-table';
import { LedigeOppgaverTable } from '@/components/ledige-oppgaver-table/ledige-oppgaver-table';
import { LedigeRolOppgaverTable } from '@/components/rol-tables/ledige-rol-oppgaver-table';
import { OppgaverPageWrapper } from '@/pages/page-wrapper';

const OppgaverPageComponent = () => (
  <OppgaverPageWrapper>
    <LedigeAnkerAfter2027Table />
    <LedigeOppgaverTable />
    <LedigeRolOppgaverTable />
  </OppgaverPageWrapper>
);

export const OppgaverPage = withFaroProfiler(OppgaverPageComponent);
