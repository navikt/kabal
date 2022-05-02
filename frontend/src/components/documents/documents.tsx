import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useState } from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { IOppgavebehandling } from '../../types/oppgavebehandling';
import { PanelContainer } from '../oppgavebehandling-panels/panel';
import { ShowDocument } from '../show-document/show-document';
import { IShownDocument } from '../show-document/types';
import { CollapsedDocuments } from './collapsed/collapsed';
import { ShownDocumentContext } from './context';
import { ExpandedDocuments } from './expanded/expanded';

interface Props {
  shown: boolean;
}

export const Documents = ({ shown }: Props) => {
  const { data, isLoading } = useOppgave();

  if (!shown) {
    return null;
  }

  if (isLoading || typeof data === 'undefined') {
    return (
      <PanelContainer data-testid="documents-panel">
        <NavFrontendSpinner />
      </PanelContainer>
    );
  }

  return <DocumentsView oppgave={data} />;
};

interface DocumentsViewProps {
  oppgave: IOppgavebehandling;
}

const DocumentsView = ({ oppgave }: DocumentsViewProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(!oppgave.isAvsluttetAvSaksbehandler);
  const [shownDocument, setShownDocument] = useState<IShownDocument | null>(null);

  const DocumentList = isExpanded ? ExpandedDocuments : CollapsedDocuments;

  return (
    <ShownDocumentContext.Provider value={{ shownDocument, setShownDocument }}>
      <PanelContainer data-testid="documents-panel">
        <DocumentList toggleExpanded={() => setIsExpanded(!isExpanded)} />
      </PanelContainer>
      <ShowDocument close={() => setShownDocument(null)} />
    </ShownDocumentContext.Provider>
  );
};
