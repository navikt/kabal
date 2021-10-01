import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetKlagebehandlingQuery } from '../../redux-api/oppgave';
import { IKlagebehandlingUpdate } from '../../redux-api/oppgave-types';
import { ShowDokument } from '../show-document/show-document';
import { IShownDokument } from '../show-document/types';
import { AlleDokumenter } from './alle-dokumenter/alle-dokumenter';
import { Header } from './header';
import { DocumentsContainer } from './styled-components/container';
import { TilknyttedeDokumenter } from './tilknyttede-dokumenter';

export interface DokumenterProps {
  shown: boolean;
  onCheck: (update: Partial<IKlagebehandlingUpdate>) => void;
}

interface Params {
  id: string;
}

export const Dokumenter = ({ shown, onCheck }: DokumenterProps) => {
  const { id } = useParams<Params>();
  const [fullView, setFullView] = useState(true);
  const [dokument, settDokument] = useState<IShownDokument | null>(null);
  const { data: klagebehandling, isLoading } = useGetKlagebehandlingQuery(id);

  if (!shown) {
    return null;
  }

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <span>Laster klagebehandling...</span>;
  }

  const antallTilknyttede = klagebehandling.tilknyttedeDokumenter.length;

  return (
    <>
      <DocumentsContainer fullvisning={fullView}>
        <Header settFullvisning={setFullView} fullvisning={fullView} antall={antallTilknyttede} />
        <TilknyttedeDokumenter
          klagebehandlingId={klagebehandling.id}
          skjult={fullView}
          visDokument={settDokument}
          tilknyttedeDokumenter={klagebehandling.tilknyttedeDokumenter}
        />
        <AlleDokumenter
          skjult={!fullView}
          visDokument={settDokument}
          klagebehandling={klagebehandling}
          onChange={(tilknyttedeDokumenter) => onCheck({ tilknyttedeDokumenter })}
        />
      </DocumentsContainer>
      <ShowDokument dokument={dokument} klagebehandlingId={klagebehandling.id} close={() => settDokument(null)} />
    </>
  );
};
