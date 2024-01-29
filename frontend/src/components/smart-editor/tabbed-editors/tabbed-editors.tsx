import { DocPencilIcon, TabsAddIcon } from '@navikt/aksel-icons';
import { Alert, Heading, Tabs } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useRef } from 'react';
import { styled } from 'styled-components';
import { SmartEditorContextComponent } from '@app/components/smart-editor/context';
import { Editor } from '@app/components/smart-editor/tabbed-editors/editor';
import { useFirstEditor } from '@app/components/smart-editor/tabbed-editors/use-first-editor';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSmartEditorActiveDocument } from '@app/hooks/settings/use-setting';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useSmartDocuments } from '@app/hooks/use-smart-documents';
import { useUpdateSmartDocumentMutation } from '@app/redux-api/oppgaver/mutations/smart-document';
import { ISmartDocument } from '@app/types/documents/documents';
import { NewDocument } from '../new-document/new-document';

const NEW_TAB_ID = 'NEW_TAB_ID';

export const TabbedEditors = () => {
  const oppgaveId = useOppgaveId();
  const documents = useSmartDocuments(oppgaveId);

  if (typeof documents === 'undefined') {
    return null;
  }

  return <Tabbed documents={documents} />;
};

interface TabbedProps {
  documents: ISmartDocument[];
}

const Tabbed = ({ documents }: TabbedProps) => {
  const firstDocument = useFirstEditor(documents);
  const { value: editorId = firstDocument?.id ?? NEW_TAB_ID, setValue: setEditorId } = useSmartEditorActiveDocument();
  const hasDocumentsAccess = useHasDocumentsAccess();

  const activeEditorId = documents.some(({ id }) => id === editorId) ? editorId : NEW_TAB_ID;

  if (documents.length === 0 && !hasDocumentsAccess) {
    return (
      <StyledNoDocuments>
        <Heading level="1" size="medium" spacing>
          Ingen redigerbare dokumenter.
        </Heading>
        <Alert variant="info" size="small">
          Ingen redigerbare dokumenter å vise. Om du forventet å se noen dokumenter her, be saksbehandler om å opprette
          dem.
        </Alert>
      </StyledNoDocuments>
    );
  }

  return (
    <StyledTabs value={activeEditorId} onChange={setEditorId} size="small">
      <StyledTabsList>
        {documents.map(({ id, tittel }) => (
          <Tabs.Tab key={id} value={id} label={tittel} icon={<DocPencilIcon aria-hidden />} />
        ))}
        <TabNew />
      </StyledTabsList>
      <StyledTabPanels>
        {documents.map((d) => (
          <TabPanel key={d.id} smartDocument={d} />
        ))}
        <TabPanelNew onCreate={setEditorId} />
      </StyledTabPanels>
    </StyledTabs>
  );
};

const TabNew = () => {
  const isMedunderskriver = useIsMedunderskriver();
  const isRol = useIsRol();
  const isFeilregistrert = useIsFeilregistrert();
  const hasDocumentsAccess = useHasDocumentsAccess();

  if (isMedunderskriver || isRol || isFeilregistrert || !hasDocumentsAccess) {
    return null;
  }

  return <Tabs.Tab value={NEW_TAB_ID} icon={<TabsAddIcon aria-hidden />} />;
};

interface TabPanelNewProps {
  onCreate: (documentId: string) => void;
}

const TabPanelNew = ({ onCreate }: TabPanelNewProps) => {
  const isMedunderskriver = useIsMedunderskriver();
  const isRol = useIsRol();

  if (isMedunderskriver || isRol) {
    return null;
  }

  return (
    <StyledTabsPanel value={NEW_TAB_ID}>
      <NewDocument onCreate={onCreate} />
    </StyledTabsPanel>
  );
};

interface TabPanelProps {
  smartDocument: ISmartDocument;
}

const TabPanel = ({ smartDocument }: TabPanelProps) => {
  const oppgaveId = useOppgaveId();
  const [update, status] = useUpdateSmartDocumentMutation();
  const timeout = useRef<NodeJS.Timeout>();

  const { id, content } = smartDocument;

  return (
    <StyledTabsPanel value={smartDocument.id}>
      <SmartEditorContextComponent editor={smartDocument}>
        <Editor
          key={id}
          smartDocument={smartDocument}
          onChange={(c) => {
            if (areDescendantsEqual(c, content)) {
              return;
            }

            clearTimeout(timeout.current);

            if (oppgaveId === skipToken) {
              return;
            }

            timeout.current = setTimeout(
              () =>
                update({
                  content: c,
                  oppgaveId,
                  dokumentId: id,
                  version: smartDocument.version,
                }),
              1000,
            );
          }}
          updateStatus={status}
        />
      </SmartEditorContextComponent>
    </StyledTabsPanel>
  );
};

const StyledTabs = styled(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledTabsPanel = styled(Tabs.Panel)`
  height: 100%;
  overflow: hidden;
`;

const StyledTabsList = styled(Tabs.List)`
  max-width: 762px;
  white-space: nowrap;
`;

const StyledTabPanels = styled.div`
  background-color: var(--a-surface-subtle);
  overflow: hidden;
  flex-grow: 1;
`;

const StyledNoDocuments = styled.div`
  padding: 16px;
`;
