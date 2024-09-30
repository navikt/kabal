import { DocPencilIcon, TabsAddIcon } from '@navikt/aksel-icons';
import { Alert, Heading, Tabs, Tooltip } from '@navikt/ds-react';
import { useEffect } from 'react';
import { styled } from 'styled-components';
import { StyledTabsPanel, TabPanel } from '@app/components/smart-editor/tabbed-editors/tab-panel';
import { useFirstEditor } from '@app/components/smart-editor/tabbed-editors/use-first-editor';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useBehandlingEnabled, useSmartEditorActiveDocument } from '@app/hooks/settings/use-setting';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useSmartDocuments } from '@app/hooks/use-smart-documents';
import { ISmartDocument } from '@app/types/documents/documents';
import { NewDocument } from '../new-document/new-document';

const NEW_TAB_ID = 'NEW_TAB_ID';

export const TabbedEditors = () => {
  const oppgaveId = useOppgaveId();
  const documents = useSmartDocuments(oppgaveId);
  const { setValue } = useBehandlingEnabled();

  useEffect(() => {
    if (documents?.length === 0) {
      setValue(true);
    }
  }, [documents?.length, setValue]);

  if (documents === undefined) {
    return null;
  }

  return <Tabbed documents={documents} />;
};

interface TabbedProps {
  documents: ISmartDocument[];
}

const Tabbed = ({ documents }: TabbedProps) => {
  const firstDocument = useFirstEditor(documents);
  const firstDocumentId = firstDocument?.id;
  const { value: editorId = firstDocumentId ?? NEW_TAB_ID, setValue: setEditorId } = useSmartEditorActiveDocument();
  const hasDocumentsAccess = useHasDocumentsAccess();

  const activeEditorId = documents.some(({ id }) => id === editorId) ? editorId : NEW_TAB_ID;

  // If the user does not have access to create documents, select the first document, if any.
  useEffect(() => {
    if (!hasDocumentsAccess && firstDocumentId !== undefined && activeEditorId === NEW_TAB_ID) {
      setEditorId(firstDocumentId ?? NEW_TAB_ID);
    }
  }, [activeEditorId, firstDocumentId, hasDocumentsAccess, setEditorId]);

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

  return (
    <Tooltip content="Opprett nytt dokument">
      <Tabs.Tab value={NEW_TAB_ID} icon={<TabsAddIcon aria-hidden />} />
    </Tooltip>
  );
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

const StyledTabs = styled(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: white;
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
  background: white;
  padding: 16px;
`;
