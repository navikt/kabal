import { PanelContainer } from '@app/components/oppgavebehandling-panels/styled-components';
import { NewDocument, useNewSmartDocumentTemplates } from '@app/components/smart-editor/new-document/new-document';
import { TabPanel } from '@app/components/smart-editor/tabbed-editors/tab-panel';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import {
  useSmartEditorActiveDocument,
  useSmartEditorGodeFormuleringerOpen,
  useSmartEditorHistoryOpen,
} from '@app/hooks/settings/use-setting';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useSmartDocuments } from '@app/hooks/use-smart-documents';
import type { ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import { DocPencilIcon, TabsAddIcon } from '@navikt/aksel-icons';
import { Alert, Heading, Tabs, Tooltip } from '@navikt/ds-react';
import { useEffect } from 'react';

const NEW_TAB_ID = 'NEW_TAB_ID';

export const TabbedEditors = () => {
  const oppgaveId = useOppgaveId();
  const documents = useSmartDocuments(oppgaveId);

  if (documents === undefined) {
    return null;
  }

  return <Tabbed documents={documents} />;
};

interface TabbedProps {
  documents: ISmartDocumentOrAttachment[];
}

const Tabbed = ({ documents }: TabbedProps) => {
  const canCreateMainDocuments = useHasDocumentsAccess();

  const [firstDocument] = documents;
  const firstDocumentId = firstDocument?.id;

  const { value: editorId = firstDocumentId, setValue: setEditorId } = useSmartEditorActiveDocument();

  const defaultEditorId = canCreateMainDocuments ? NEW_TAB_ID : undefined;

  const activeEditorId =
    editorId !== undefined && documents.some(({ id }) => id === editorId) ? editorId : defaultEditorId;

  const { value: showGodeFormuleringer = false } = useSmartEditorGodeFormuleringerOpen();
  const { value: showHistory = false } = useSmartEditorHistoryOpen();

  // If the user does not have access to create documents, select the first document, if any.
  useEffect(() => {
    if (!canCreateMainDocuments && firstDocumentId !== undefined && activeEditorId === defaultEditorId) {
      setEditorId(firstDocumentId ?? defaultEditorId);
    }
  }, [activeEditorId, firstDocumentId, canCreateMainDocuments, setEditorId, defaultEditorId]);

  if (documents.length === 0 && !canCreateMainDocuments) {
    return (
      <PanelContainer>
        <div className="bg-bg-default p-4">
          <Heading level="1" size="medium" spacing>
            Ingen dokumenter.
          </Heading>
          <Alert variant="info" size="small">
            Ingen dokumenter å vise. Om du forventet å se noen dokumenter her, be saksbehandler om å opprette dem.
          </Alert>
        </div>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer>
      <Tabs className="flex h-full flex-col overflow-hidden" value={activeEditorId} onChange={setEditorId} size="small">
        <Tabs.List className="whitespace-nowrap" style={{ maxWidth: getMaxWidth(showGodeFormuleringer, showHistory) }}>
          {documents.map(({ id, tittel }) => (
            <Tabs.Tab key={id} value={id} label={tittel} icon={<DocPencilIcon aria-hidden />} />
          ))}
          <TabNew />
        </Tabs.List>

        <div className="grow overflow-hidden">
          {documents.map((d) => (
            <TabPanel key={d.id} smartDocument={d} />
          ))}

          <TabPanelNew onCreate={setEditorId} />
        </div>
      </Tabs>
    </PanelContainer>
  );
};

const TabNew = () => {
  const templates = useNewSmartDocumentTemplates();

  if (templates.length === 0) {
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
  const templates = useNewSmartDocumentTemplates();

  if (templates.length === 0) {
    return null;
  }

  return (
    <Tabs.Panel className="h-full overflow-hidden" value={NEW_TAB_ID}>
      <NewDocument onCreate={onCreate} />
    </Tabs.Panel>
  );
};

const ONLY_DOCUMENT = 762;
const HISTORY = 1_110;
const GODE_FORMULERINGER = 350;
const ALL = ONLY_DOCUMENT + HISTORY + GODE_FORMULERINGER;
const DOCUMENT_AND_HISTORY = ONLY_DOCUMENT + HISTORY;
const DOCUMENT_AND_GODE_FORMULERINGER = ONLY_DOCUMENT + GODE_FORMULERINGER;

const getMaxWidth = (showGodeFormuleringer: boolean, showHistory: boolean) => {
  if (showHistory && showGodeFormuleringer) {
    return ALL;
  }

  if (showGodeFormuleringer) {
    return DOCUMENT_AND_GODE_FORMULERINGER;
  }

  if (showHistory) {
    return DOCUMENT_AND_HISTORY;
  }

  return ONLY_DOCUMENT;
};
