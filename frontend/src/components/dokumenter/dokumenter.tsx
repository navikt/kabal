import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useState } from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { IDocumentReference } from '../../redux-api/klagebehandling-state-types';
import { PanelContainer } from '../oppgavebehandling-panels/panel';
import { ShowDocument } from '../show-document/show-document';
import { IShownDokument } from '../show-document/types';
import { AlleDokumenter } from './alle-dokumenter/alle-dokumenter';
import { ShownDocumentContext } from './context';
import { Header } from './header';
import { NyeDokumenter } from './nye-dokumenter/nye-dokumenter';
import { StyledAllDocumentsContainer, StyledAllDocumentsSizer } from './styled-components/fullvisning';
import { DokumenterNav, DokumenterTittel } from './styled-components/header';
import { TilknyttedeDokumenter } from './tilknyttede-dokumenter';

export interface DokumenterProps {
  shown: boolean;
}

export const Dokumenter = ({ shown }: DokumenterProps) => {
  const { data: oppgavebehandling, isLoading } = useOppgave();

  if (!shown) {
    return null;
  }

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return (
      <PanelContainer data-testid="documents-panel">
        <DokumenterNav>
          <DokumenterTittel>Dokumenter</DokumenterTittel>
        </DokumenterNav>
        <NavFrontendSpinner />
      </PanelContainer>
    );
  }

  const { tilknyttedeDokumenter, isAvsluttetAvSaksbehandler } = oppgavebehandling;

  return (
    <Documents tilknyttedeDokumenter={tilknyttedeDokumenter} isAvsluttetAvSaksbehandler={isAvsluttetAvSaksbehandler} />
  );
};

interface DocumentsProps {
  tilknyttedeDokumenter: IDocumentReference[];
  isAvsluttetAvSaksbehandler: boolean;
}

const Documents = ({ tilknyttedeDokumenter, isAvsluttetAvSaksbehandler }: DocumentsProps) => {
  const [viewAll, setViewAll] = useState(!isAvsluttetAvSaksbehandler);
  const [shownDocument, setShownDocument] = useState<IShownDokument | null>(null);

  const antallTilknyttede = tilknyttedeDokumenter.length;

  const header = <Header settFullvisning={setViewAll} fullvisning={viewAll} antall={antallTilknyttede} />;

  const children = viewAll ? (
    <AllDocuments header={header} />
  ) : (
    <AttachedDocuments header={header} tilknyttedeDokumenter={tilknyttedeDokumenter} />
  );

  return (
    <ShownDocumentContext.Provider value={{ shownDocument, setShownDocument }}>
      <PanelContainer data-testid="documents-panel">{children}</PanelContainer>

      <ShowDocument document={shownDocument} close={() => setShownDocument(null)} />
    </ShownDocumentContext.Provider>
  );
};

interface AllDocumentsProps {
  header: JSX.Element;
}

const AllDocuments = ({ header }: AllDocumentsProps) => (
  <StyledAllDocumentsContainer>
    <StyledAllDocumentsSizer>
      {header}
      <NyeDokumenter />
      <AlleDokumenter />
    </StyledAllDocumentsSizer>
  </StyledAllDocumentsContainer>
);

interface AttachedDocumentsProps {
  tilknyttedeDokumenter: IDocumentReference[];
  header: JSX.Element;
}

const AttachedDocuments = ({ header, tilknyttedeDokumenter }: AttachedDocumentsProps) => (
  <section>
    {header}
    <TilknyttedeDokumenter tilknyttedeDokumenter={tilknyttedeDokumenter} />
  </section>
);
