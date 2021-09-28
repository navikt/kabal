import React, { useState } from 'react';
import { ShowDokument } from '../show-document/show-document';
import { DokumenterBeholder } from './styled-components/container';
import { TilknyttedeDokumenter } from './tilknyttede-dokumenter';
import { AlleDokumenter } from './alle-dokumenter';
import { Header } from './header';
import { IKlagebehandling } from '../../redux-api/oppgave-state-types';
import { useGetDokumenterQuery } from '../../redux-api/dokumenter/api';
import { IShownDokument } from '../show-document/types';

export interface DokumenterProps {
  skjult: boolean;
  settFullvisning: (fullvisning: boolean) => void;
  fullvisning: boolean;
  klagebehandling: IKlagebehandling;
}

export const Dokumenter = ({ skjult, settFullvisning, fullvisning, klagebehandling }: DokumenterProps) => {
  const [dokument, settDokument] = useState<IShownDokument | null>(null);

  const antallTilknyttede = klagebehandling.tilknyttedeDokumenter.length;

  if (skjult) {
    return null;
  }

  return (
    <>
      <DokumenterBeholder fullvisning={fullvisning}>
        <Header settFullvisning={settFullvisning} fullvisning={fullvisning} antall={antallTilknyttede} />
        <TilknyttedeDokumenter
          klagebehandlingId={klagebehandling.id}
          skjult={fullvisning}
          visDokument={settDokument}
          tilknyttedeDokumenter={klagebehandling.tilknyttedeDokumenter}
        />
        <AlleDokumenter skjult={!fullvisning} visDokument={settDokument} klagebehandling={klagebehandling} />
      </DokumenterBeholder>
      <ShowDokument dokument={dokument} klagebehandlingId={klagebehandling.id} close={() => settDokument(null)} />
    </>
  );
};
