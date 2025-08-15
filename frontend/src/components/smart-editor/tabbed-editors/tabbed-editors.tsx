import { PanelContainer } from '@app/components/oppgavebehandling-panels/styled-components';
import { NewDocument } from '@app/components/smart-editor/new-document/new-document';
import { TabPanel } from '@app/components/smart-editor/tabbed-editors/tab-panel';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import {
  useSmartEditorActiveDocument,
  useSmartEditorGodeFormuleringerOpen,
  useSmartEditorHistoryOpen,
} from '@app/hooks/settings/use-setting';
import { useSmartDocuments } from '@app/hooks/use-smart-documents';
import type { ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import { DocPencilIcon, TabsAddIcon } from '@navikt/aksel-icons';
import { Tabs, Tooltip } from '@navikt/ds-react';

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
  const [firstDocument] = documents;
  const firstDocumentId = firstDocument?.id;

  const { value: editorId = firstDocumentId, setValue: setEditorId } = useSmartEditorActiveDocument();

  const activeEditorId = editorId !== undefined && documents.some(({ id }) => id === editorId) ? editorId : NEW_TAB_ID;

  const { value: showGodeFormuleringer = false } = useSmartEditorGodeFormuleringerOpen();
  const { value: showHistory = false } = useSmartEditorHistoryOpen();

  return (
    <PanelContainer>
      <Tabs className="flex h-full flex-col overflow-hidden" value={activeEditorId} onChange={setEditorId} size="small">
        <Tabs.List className="whitespace-nowrap" style={{ maxWidth: getMaxWidth(showGodeFormuleringer, showHistory) }}>
          {documents.map(({ id, tittel }) => (
            <Tabs.Tab key={id} value={id} label={tittel} icon={<DocPencilIcon aria-hidden />} />
          ))}

          <Tooltip content="Opprett nytt dokument">
            <Tabs.Tab value={NEW_TAB_ID} icon={<TabsAddIcon aria-hidden />} />
          </Tooltip>
        </Tabs.List>

        <div className="grow overflow-hidden">
          {documents.map((d) => (
            <TabPanel key={d.id} smartDocument={d} />
          ))}

          <Tabs.Panel className="h-full overflow-hidden" value={NEW_TAB_ID}>
            <NewDocument onCreate={setEditorId} />
          </Tabs.Panel>
        </div>
      </Tabs>
    </PanelContainer>
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
