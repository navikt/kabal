import React, { useState } from 'react';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { useGetKlagebehandlingQuery } from '../../redux-api/oppgave';
import { IKlagebehandlingUpdate } from '../../redux-api/oppgave-types';
import { PanelContainer } from '../klagebehandling-panels/panel';
import { ShowDocument } from '../show-document/show-document';
import { IShownDokument } from '../show-document/types';
import { AlleDokumenter } from './alle-dokumenter/alle-dokumenter';
import { Header } from './header';
import { TilknyttedeDokumenter } from './tilknyttede-dokumenter';

export interface DokumenterProps {
  shown: boolean;
  onChange: (update: Partial<IKlagebehandlingUpdate>) => void;
}

export const Dokumenter = ({ shown, onChange }: DokumenterProps) => {
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
        <TilknyttedeDokumenter
          klagebehandlingId={klagebehandling.id}
          show={!viewAll}
          setShownDocument={setShownDocument}
          tilknyttedeDokumenter={klagebehandling.tilknyttedeDokumenter}
        />
        <AlleDokumenter
          show={viewAll}
          setShownDocument={setShownDocument}
          klagebehandling={klagebehandling}
          onChange={(tilknyttedeDokumenter) => onChange({ tilknyttedeDokumenter })}
        />
      </PanelContainer>
      <ShowDocument
        document={shownDocument}
        klagebehandlingId={klagebehandling.id}
        close={() => setShownDocument(null)}
      />
    </>
  );
};
