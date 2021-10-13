import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useState } from 'react';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { useGetKlagebehandlingQuery } from '../../redux-api/oppgave';
import { IDocumentReference } from '../../redux-api/oppgave-types';
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
  const { data: klagebehandling, isLoading } = useGetKlagebehandlingQuery(klagebehandlingId);

  if (!shown) {
    return null;
  }

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const { tilknyttedeDokumenter, id, isAvsluttetAvSaksbehandler } = klagebehandling;

  return (
    <Documents
      id={id}
      tilknyttedeDokumenter={tilknyttedeDokumenter}
      isAvsluttetAvSaksbehandler={isAvsluttetAvSaksbehandler}
    />
  );
};

interface DocumentsProps {
  id: string;
  tilknyttedeDokumenter: IDocumentReference[];
  isAvsluttetAvSaksbehandler: boolean;
}

const Documents = ({ tilknyttedeDokumenter, id, isAvsluttetAvSaksbehandler }: DocumentsProps) => {
  const [viewAll, setViewAll] = useState(!isAvsluttetAvSaksbehandler);
  const [shownDocument, setShownDocument] = useState<IShownDokument | null>(null);

  const antallTilknyttede = tilknyttedeDokumenter.length;

  return (
    <>
      <PanelContainer>
        <Header settFullvisning={setViewAll} fullvisning={viewAll} antall={antallTilknyttede} />
        <NyeDokumenter setShownDocument={setShownDocument} show={viewAll} />
        <TilknyttedeDokumenter
          klagebehandlingId={id}
          show={!viewAll}
          setShownDocument={setShownDocument}
          tilknyttedeDokumenter={tilknyttedeDokumenter}
        />
        <AlleDokumenter show={viewAll} setShownDocument={setShownDocument} klagebehandlingId={id} />
      </PanelContainer>
      <ShowDocument document={shownDocument} close={() => setShownDocument(null)} />
    </>
  );
};
