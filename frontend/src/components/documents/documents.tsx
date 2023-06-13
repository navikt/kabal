import { Loader } from '@navikt/ds-react';
import React from 'react';
import { PanelContainer } from '@app/components/oppgavebehandling-panels/styled-components';
import { ViewPDF } from '@app/components/view-pdf/view-pdf';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useDocumentsEnabled, useDocumentsExpanded } from '@app/hooks/settings/use-setting';
import { CollapsedDocuments } from './collapsed/collapsed';
import { ExpandedDocuments } from './expanded/expanded';

export const Documents = () => {
  const { value: shown = true, isLoading: isSettingLoading } = useDocumentsEnabled();
  const { data, isLoading } = useOppgave();

  if (!shown || isSettingLoading) {
    return null;
  }

  if (isLoading || typeof data === 'undefined') {
    return (
      <PanelContainer data-testid="documents-panel">
        <Loader size="xlarge" />
      </PanelContainer>
    );
  }

  return <DocumentsView />;
};

const DocumentsView = () => {
  const { value: isExpanded = true } = useDocumentsExpanded();

  const DocumentList = isExpanded ? ExpandedDocuments : CollapsedDocuments;

  return (
    <>
      <PanelContainer data-testid="documents-panel">
        <DocumentList />
      </PanelContainer>
      <ViewPDF />
    </>
  );
};
