import { Loader } from '@navikt/ds-react';
import { DOCUMENTS_HEADING, ExpandedDocuments } from '@/components/documents/expanded-documents';
import { TabContextElement } from '@/components/documents/tab-context';
import { FileViewer } from '@/components/file-viewer/file-viewer';
import { PanelContainer } from '@/components/oppgavebehandling-panels/panel-container';
import { ViewPDF } from '@/components/view-pdf/view-pdf';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useDocumentsEnabled } from '@/hooks/settings/use-setting';
import { useShownDocuments } from '@/hooks/use-shown-documents';
import {
  useShowNewFileViewerFeatureToggle,
  useShowOldPdfViewerFeatureToggle,
} from '@/simple-api-state/feature-toggles';

export const Documents = () => {
  const { value: shown = true } = useDocumentsEnabled();
  const { data, isLoading } = useOppgave();
  const showNewFileViewer = useShowNewFileViewerFeatureToggle();
  const showOldPdfViewer = useShowOldPdfViewerFeatureToggle();
  const shownDocuments = useShownDocuments();

  if (!shown) {
    return null;
  }

  if (isLoading || typeof data === 'undefined') {
    return (
      <PanelContainer aria-label={DOCUMENTS_HEADING}>
        <Loader size="xlarge" />
      </PanelContainer>
    );
  }

  return (
    <TabContextElement>
      <PanelContainer aria-label={DOCUMENTS_HEADING}>
        <ExpandedDocuments />
      </PanelContainer>
      {showOldPdfViewer.data?.enabled === true ? <ViewPDF /> : null}
      {showNewFileViewer.data?.enabled === true ? <FileViewer {...shownDocuments} /> : null}
    </TabContextElement>
  );
};
