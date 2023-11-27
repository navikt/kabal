import { Heading, Loader, Switch } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import { DragAndDropContextElement } from '@app/components/documents/drag-context';
import { Fields, SIZES } from '@app/components/documents/journalfoerte-documents/grid';
import { TabContextElement } from '@app/components/documents/tab-context';
import { ToggleExpandedButton } from '@app/components/documents/toggle-expand-button';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { PanelContainer } from '@app/components/oppgavebehandling-panels/styled-components';
import { ViewPDF } from '@app/components/view-pdf/view-pdf';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import {
  useArchivedDocumentsColumns,
  useArchivedDocumentsFullTitle,
} from '@app/hooks/settings/use-archived-documents-setting';
import { useDocumentsEnabled } from '@app/hooks/settings/use-setting';
import { JournalfoerteDocuments } from './journalfoerte-documents/journalfoerte-documents';
import { NewDocuments } from './new-documents/new-documents';
import { UploadFile } from './upload-file/upload-file';

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
  const { value: fullTitle, setValue } = useArchivedDocumentsFullTitle();
  const { columns } = useArchivedDocumentsColumns();

  const maxWidth = useMemo(() => {
    if (fullTitle) {
      return 'unset';
    }

    if (!isExpanded) {
      return 400;
    }

    return (
      600 +
      Object.values(columns).reduce((acc, v) => (v ? acc + 8 : acc), 0) +
      (columns.AVSENDER_MOTTAKER ? SIZES[Fields.AvsenderMottaker] : 0) +
      (columns.DATO_OPPRETTET ? SIZES[Fields.DatoOpprettet] : 0) +
      (columns.DATO_REG_SENDT ? SIZES[Fields.DatoRegSendt] : 0) +
      (columns.SAKSNUMMER ? SIZES[Fields.Saksnummer] : 0) +
      (columns.TEMA ? SIZES[Fields.Tema] : 0) +
      (columns.TYPE ? SIZES[Fields.Type] : 0)
    );
  }, [columns, fullTitle, isExpanded]);

  return (
    <DragAndDropContextElement>
      <Container style={{ maxWidth }}>
        <DocumentsHeader>
          <Heading size="medium" level="1">
            Dokumenter
          </Heading>
          <Switch size="small" checked={fullTitle} onChange={(e) => setValue(e.target.checked)}>
            <NoWrap>Full tittel</NoWrap>
          </Switch>
          {isExpanded ? <UploadFile /> : null}
          <ToggleExpandedButton />
        </DocumentsHeader>

        <NewDocuments />
        <JournalfoerteDocuments />
      </Container>
    </DragAndDropContextElement>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  height: 100%;
  overflow-y: hidden;
`;

const DocumentsHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
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

const NoWrap = styled.span`
  white-space: nowrap;
`;
