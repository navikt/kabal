import { Loader } from '@navikt/ds-react';
import { ExpandedDocuments } from '@/components/documents/expanded-documents';
import { TabContextElement } from '@/components/documents/tab-context';
import { FileViewer } from '@/components/file-viewer/file-viewer';
import { PanelContainer } from '@/components/oppgavebehandling-panels/panel-container';
import { ViewPDF } from '@/components/view-pdf/view-pdf';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useDocumentsEnabled } from '@/hooks/settings/use-setting';
import {
  useShowNewFileViewerFeatureToggle,
  useShowOldPdfViewerFeatureToggle,
} from '@/simple-api-state/feature-toggles';

export const Documents = () => {
  const { value: shown = true } = useDocumentsEnabled();
  const { data, isLoading } = useOppgave();
  const showNewFileViewer = useShowNewFileViewerFeatureToggle();
  const showOldPdfViewer = useShowOldPdfViewerFeatureToggle();

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
      {showOldPdfViewer.data?.enabled === true ? <ViewPDF /> : null}
      {showNewFileViewer.data?.enabled === true ? <FileViewer /> : null}
    </TabContextElement>
  );
};
