import { ExpandedDocuments } from '@app/components/documents/expanded-documents';
import { TabContextElement } from '@app/components/documents/tab-context';
import { FileViewer } from '@app/components/file-viewer/file-viewer';
import { PanelContainer } from '@app/components/oppgavebehandling-panels/panel-container';
import { ViewPDF } from '@app/components/view-pdf/view-pdf';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useDocumentsEnabled } from '@app/hooks/settings/use-setting';
import { useNewFileViewerFeatureToggle } from '@app/simple-api-state/feature-toggles';
import { Loader } from '@navikt/ds-react';

export const Documents = () => {
  const { value: shown = true } = useDocumentsEnabled();
  const { data, isLoading } = useOppgave();
  const useNewFileViewer = useNewFileViewerFeatureToggle();

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
      <ViewPDF />
      {useNewFileViewer.data?.enabled === true ? <FileViewer /> : null}
    </TabContextElement>
  );
};
