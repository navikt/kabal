import { ExpandedDocuments } from '@app/components/documents/expanded-documents';
import { TabContextElement } from '@app/components/documents/tab-context';
import { FileViewer } from '@app/components/file-viewer/file-viewer';
import { PanelContainer } from '@app/components/oppgavebehandling-panels/panel-container';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useDocumentsEnabled } from '@app/hooks/settings/use-setting';
import { Loader } from '@navikt/ds-react';

export const Documents = () => {
  const { value: shown = true } = useDocumentsEnabled();
  const { data, isLoading } = useOppgave();

  if (!shown) {
    return null;
  }

  if (isLoading || typeof data === 'undefined') {
    return (
      <PanelContainer data-testid="documents-panel">
        <Loader size="xlarge" />
      </PanelContainer>
    );
  }

  return (
    <TabContextElement>
      <PanelContainer data-testid="documents-panel">
        <ExpandedDocuments />
      </PanelContainer>
      <FileViewer />
    </TabContextElement>
  );
};
