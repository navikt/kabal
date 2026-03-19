import { LedigeOppgaverTable } from '@/components/ledige-oppgaver-table/ledige-oppgaver-table';
import { LedigeRolOppgaverTable } from '@/components/rol-tables/ledige-rol-oppgaver-table';
import { OppgaverPageWrapper } from '@/pages/page-wrapper';

export const OppgaverPage = () => (
  <OppgaverPageWrapper testId="ledige-oppgaver-tables">
    <LedigeOppgaverTable />
    <LedigeRolOppgaverTable />
  </OppgaverPageWrapper>
);
