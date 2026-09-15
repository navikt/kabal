import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { AnkerPåVentTable } from '@/components/oppgavestyring-anketeam/anker-på-vent';
import { FerdigstilteAnkerTable } from '@/components/oppgavestyring-anketeam/ferdigstilte-anker';
import { LedigeAnkerTable } from '@/components/oppgavestyring-anketeam/ledige-anker';
import { TildelteAnkerTable } from '@/components/oppgavestyring-anketeam/tildelte-anker';
import { OppgaverPageWrapper } from '@/pages/page-wrapper';

export const OppgavestyringAnketeamPage = () => {
  const { user } = useContext(StaticDataContext);

  return (
    <OppgaverPageWrapper title={`Oppgavestyring anketeam - ${user.ansattEnhet.navn}`}>
      <LedigeAnkerTable />
      <TildelteAnkerTable />
      <AnkerPåVentTable />
      <FerdigstilteAnkerTable />
    </OppgaverPageWrapper>
  );
};
