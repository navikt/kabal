import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../tilstand/konfigurerTilstand';
import { velgAlleDokumenter } from '../../../tilstand/moduler/dokumenter/selectors';
import { ShowDokument } from './ShowDokument';
import { DokumenterBeholder } from './styled-components/container';
import { TilknyttedeDokumenter } from './TilknyttedeDokumenter';
import { AlleDokumenter } from './AlleDokumenter';
import { hentDokumenter, hentTilknyttedeDokumenter } from '../../../tilstand/moduler/dokumenter/actions';
import { NULLSTILL_DOKUMENTER } from '../../../tilstand/moduler/dokumenter/state';
import { Header } from './Header';
import { IKlagebehandling } from '../../../tilstand/moduler/klagebehandling/stateTypes';
import { IShownDokument } from './typer';

export interface DokumenterProps {
  skjult: boolean;
  settFullvisning: (fullvisning: boolean) => void;
  fullvisning: boolean;
  klagebehandling: IKlagebehandling;
}

export const Dokumenter = ({ skjult, settFullvisning, fullvisning, klagebehandling }: DokumenterProps) => {
  const dispatch = useAppDispatch();
  const alleDokumenter = useAppSelector(velgAlleDokumenter);
  const [dokument, settDokument] = useState<IShownDokument | null>(null);

  const antallTilknyttede = klagebehandling.tilknyttedeDokumenter.length;

  useEffect(() => {
    dispatch(
      hentDokumenter({
        klagebehandlingId: klagebehandling.id,
        pageReference: null,
        temaFilter: undefined,
      })
    );
    dispatch(hentTilknyttedeDokumenter(klagebehandling.id));
    return () => {
      dispatch(NULLSTILL_DOKUMENTER());
    };
  }, [klagebehandling.id, dispatch]);

  if (skjult) {
    return null;
  }

  return (
    <>
      <DokumenterBeholder fullvisning={fullvisning}>
        <Header settFullvisning={settFullvisning} fullvisning={fullvisning} antall={antallTilknyttede} />
        <TilknyttedeDokumenter
          skjult={fullvisning}
          visDokument={settDokument}
          tilknyttedeDokumenter={klagebehandling.tilknyttedeDokumenter}
        />
        <AlleDokumenter
          skjult={!fullvisning}
          dokumenter={alleDokumenter}
          visDokument={settDokument}
          klagebehandling={klagebehandling}
        />
      </DokumenterBeholder>
      <ShowDokument dokument={dokument} klagebehandlingId={klagebehandling.id} close={() => settDokument(null)} />
    </>
  );
};
