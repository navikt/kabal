import { PanelContainer } from '@app/components/oppgavebehandling-panels/styled-components';
import { NewDocument } from '@app/components/smart-editor/new-document/new-document';
import { TabPanel } from '@app/components/smart-editor/tabbed-editors/tab-panel';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSmartEditorActiveDocument } from '@app/hooks/settings/use-setting';
import { useElementWidth } from '@app/hooks/use-element-width';
import { useIsRolOrKrolUser } from '@app/hooks/use-is-rol';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { CreatorRole, type ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import { DocPencilIcon, TabsAddIcon } from '@navikt/aksel-icons';
import { Tabs, Tooltip } from '@navikt/ds-react';
import type { skipToken } from '@reduxjs/toolkit/query';
import { useRef } from 'react';

const NEW_TAB_ID = 'NEW_TAB_ID';

export const TabbedEditors = () => {
  const oppgaveId = useOppgaveId();
  const documents = useRelevantSmartDocuments(oppgaveId);

  if (documents === undefined) {
    return null;
  }

  return <Tabbed documents={documents} />;
};

const useRelevantSmartDocuments = (oppgaveId: string | typeof skipToken): ISmartDocumentOrAttachment[] | undefined => {
  const { data, isSuccess } = useGetDocumentsQuery(oppgaveId);
  const isRolOrKrol = useIsRolOrKrolUser();

  if (!isSuccess) {
    return undefined;
  }

  const sortedSmartDocuments = data
    .filter((d): d is ISmartDocumentOrAttachment => d.isSmartDokument && !d.isMarkertAvsluttet)
    .toSorted((a, b) => a.created.localeCompare(b.created));

  if (isRolOrKrol) {
    return sortedSmartDocuments.filter((d) => d.creator.creatorRole === CreatorRole.KABAL_ROL);
  }

  return sortedSmartDocuments.filter((d) => d.creator.creatorRole !== CreatorRole.KABAL_ROL);
};

interface TabbedProps {
  documents: ISmartDocumentOrAttachment[];
}

const Tabbed = ({ documents }: TabbedProps) => {
  const [firstDocument] = documents;
  const firstDocumentId = firstDocument?.id;

  const { value: editorId = firstDocumentId, setValue: setEditorId } = useSmartEditorActiveDocument();

  const activeEditorId = editorId !== undefined && documents.some(({ id }) => id === editorId) ? editorId : NEW_TAB_ID;

  const ref = useRef<HTMLDivElement>(null);
  const width = useElementWidth(ref);

  return (
    <PanelContainer>
      <Tabs className="flex h-full flex-col overflow-hidden" value={activeEditorId} onChange={setEditorId} size="small">
        <div style={{ maxWidth: width }}>
          <Tabs.List className="whitespace-nowrap">
            {documents.map(({ id, tittel }) => (
              <Tabs.Tab key={id} value={id} label={tittel} icon={<DocPencilIcon aria-hidden />} />
            ))}

            <Tooltip content="Opprett nytt dokument">
              <Tabs.Tab value={NEW_TAB_ID} icon={<TabsAddIcon aria-hidden />} />
            </Tooltip>
          </Tabs.List>
        </div>

        <div className="w-fit overflow-hidden" style={{ height: 'calc(100% - 32px)' }} ref={ref}>
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
