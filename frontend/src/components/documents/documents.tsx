import { Heading, Loader } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { DragAndDropContextElement } from '@app/components/documents/drag-context';
import { TabContextElement } from '@app/components/documents/tab-context';
import { ToggleExpandedButton } from '@app/components/documents/toggle-expand-button';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { PanelContainer } from '@app/components/oppgavebehandling-panels/styled-components';
import { ViewPDF } from '@app/components/view-pdf/view-pdf';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useDocumentsEnabled } from '@app/hooks/settings/use-setting';
import { JournalfoerteDocuments } from './journalfoerte-documents/journalfoerte-documents';
import { NewDocuments } from './new-documents/new-documents';
import { UploadFileButton } from './upload-file/upload-file';

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

  return (
    <TabContextElement>
      <PanelContainer data-testid="documents-panel">
        <ExpandedDocuments />
      </PanelContainer>
      <ViewPDF />
    </TabContextElement>
  );
};

const ExpandedDocuments = () => {
  const [isExpanded] = useIsExpanded();

  return (
    <DragAndDropContextElement>
      <Container $isExpanded={isExpanded}>
        <DocumentsHeader>
          <Heading size="medium" level="1">
            Dokumenter
          </Heading>
          {isExpanded ? <UploadFileButton /> : null}
          <ToggleExpandedButton />
        </DocumentsHeader>

        <NewDocuments />

        <JournalfoerteDocuments />
      </Container>
    </DragAndDropContextElement>
  );
};

const Container = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ $isExpanded }) => ($isExpanded ? '1024px' : '350px')};
  height: 100%;
  overflow-y: hidden;
`;

const DocumentsHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  column-gap: 8px;
  position: relative;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-top: 8px;
  border-bottom: 1px solid #c6c2bf;
  margin-bottom: 8px;
`;
