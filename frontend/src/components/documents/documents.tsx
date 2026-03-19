import { Loader } from '@navikt/ds-react';
import { ExpandedDocuments } from '@/components/documents/expanded-documents';
import { TabContextElement } from '@/components/documents/tab-context';
import { FileViewer } from '@/components/file-viewer/file-viewer';
import { PanelContainer } from '@/components/oppgavebehandling-panels/panel-container';
import { ViewPDF } from '@/components/view-pdf/view-pdf';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useDocumentsEnabled } from '@/hooks/settings/use-setting';
import { useNewFileViewerFeatureToggle } from '@/simple-api-state/feature-toggles';

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
