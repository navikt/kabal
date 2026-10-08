import {
  AnkerPåVentTable,
  FerdigstilteAnkerTable,
  LedigeAnkerTable,
  TildelteAnkerTable,
} from '@/components/oppgavestyring-anketeam/anketeam-table';
import { OppgaverPageWrapper } from '@/pages/page-wrapper';

export const OppgavestyringAnketeamPage = () => (
  <OppgaverPageWrapper title="Oppgavestyring anketeam">
    <LedigeAnkerTable />
    <TildelteAnkerTable />
    <AnkerPåVentTable />
    <FerdigstilteAnkerTable />
  </OppgaverPageWrapper>
);
