import React, { useState } from 'react';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { useGetKlagebehandlingQuery } from '../../redux-api/oppgave';
import { PanelContainer } from '../klagebehandling-panels/panel';
import { ShowDocument } from '../show-document/show-document';
import { IShownDokument } from '../show-document/types';
import { AlleDokumenter } from './alle-dokumenter/alle-dokumenter';
import { Header } from './header';
import { NyeDokumenter } from './nye-dokumenter/nye-dokumenter';
import { TilknyttedeDokumenter } from './tilknyttede-dokumenter';

export interface DokumenterProps {
  shown: boolean;
}

export const Dokumenter = ({ shown }: DokumenterProps) => {
  const klagebehandlingId = useKlagebehandlingId();
  const [viewAll, setViewAll] = useState(true);
  const [shownDocument, setShownDocument] = useState<IShownDokument | null>(null);
  const { data: klagebehandling, isLoading } = useGetKlagebehandlingQuery(klagebehandlingId);

  if (!shown) {
    return null;
  }

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return null;
  }

  const antallTilknyttede = klagebehandling.tilknyttedeDokumenter.length;

  return (
    <>
      <PanelContainer>
        <Header settFullvisning={setViewAll} fullvisning={viewAll} antall={antallTilknyttede} />
        <NyeDokumenter setShownDocument={setShownDocument} show={viewAll} />
        <TilknyttedeDokumenter
          klagebehandlingId={klagebehandling.id}
          show={!viewAll}
          setShownDocument={setShownDocument}
          tilknyttedeDokumenter={klagebehandling.tilknyttedeDokumenter}
        />
        <AlleDokumenter show={viewAll} setShownDocument={setShownDocument} klagebehandlingId={klagebehandling.id} />
      </PanelContainer>
      <ShowDocument document={shownDocument} close={() => setShownDocument(null)} />
    </>
  );
};
