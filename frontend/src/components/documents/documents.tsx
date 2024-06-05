import { Loader } from '@navikt/ds-react';
import { ExpandedDocuments } from '@app/components/documents/expanded-documents';
import { TabContextElement } from '@app/components/documents/tab-context';
import { PanelContainer } from '@app/components/oppgavebehandling-panels/styled-components';
import { ViewPDF } from '@app/components/view-pdf/view-pdf';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useDocumentsEnabled } from '@app/hooks/settings/use-setting';

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
      <ViewPDF />
    </TabContextElement>
  );
};
