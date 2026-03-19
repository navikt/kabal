import { DocPencilIcon, TabsAddIcon } from '@navikt/aksel-icons';
import { Tabs, Tooltip } from '@navikt/ds-react';
import type { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useRef } from 'react';
import { PanelContainer } from '@/components/oppgavebehandling-panels/panel-container';
import { usePanelContainerRef } from '@/components/oppgavebehandling-panels/panel-container-ref-context';
import { usePanelShortcut } from '@/components/oppgavebehandling-panels/panel-shortcuts-context';
import { NewDocument } from '@/components/smart-editor/new-document/new-document';
import {
  EditorPanelFocusProvider,
  useEditorPanelFocusRef,
  useRequestEditorPanelFocus,
} from '@/components/smart-editor/tabbed-editors/editor-panel-focus-context';
import { TabPanel } from '@/components/smart-editor/tabbed-editors/tab-panel';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useSmartEditorActiveDocument } from '@/hooks/settings/use-setting';
import { useElementWidth } from '@/hooks/use-element-width';
import { useIsRolOrKrolUser } from '@/hooks/use-is-rol';
import { useGetDocumentsQuery } from '@/redux-api/oppgaver/queries/documents';
import { CreatorRole, type ISmartDocumentOrAttachment } from '@/types/documents/documents';

const focusFirstButton = (container: HTMLElement | null) => {
  const firstButton = container?.querySelector<HTMLButtonElement>('button:not([disabled])');

  if (firstButton !== undefined && firstButton !== null) {
    firstButton.focus({ preventScroll: true });
  }
};

const NEW_TAB_ID = 'NEW_TAB_ID';

export const TabbedEditors = () => {
  const oppgaveId = useOppgaveId();
  const documents = useRelevantSmartDocuments(oppgaveId);

  if (documents === undefined) {
    return null;
  }

  return (
    <PanelContainer>
      <EditorPanelFocusProvider>
        <Tabbed documents={documents} />
      </EditorPanelFocusProvider>
    </PanelContainer>
  );
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
  const requestEditorPanelFocus = useRequestEditorPanelFocus();

  const onCreateDocument = useCallback(
    (id: string) => {
      setEditorId(id);
      requestEditorPanelFocus();
    },
    [setEditorId, requestEditorPanelFocus],
  );

  const hasActiveEditor = editorId !== undefined && documents.some(({ id }) => id === editorId);
  const activeEditorId = hasActiveEditor ? editorId : NEW_TAB_ID;

  const panelContainerRef = usePanelContainerRef();
  const newDocumentRef = useRef<HTMLElement>(null);
  const editorFocusRef = useEditorPanelFocusRef();

  const focusPanel = useCallback(() => {
    const editorFocusFn = editorFocusRef.current;

    if (editorFocusFn !== null) {
      editorFocusFn();
    } else {
      focusFirstButton(newDocumentRef.current);
    }
  }, [editorFocusRef]);

  usePanelShortcut(3, focusPanel, panelContainerRef);

  const ref = useRef<HTMLDivElement>(null);
  const width = useElementWidth(ref);

  return (
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
          <NewDocument onCreate={onCreateDocument} ref={newDocumentRef} />
        </Tabs.Panel>
      </div>
    </Tabs>
  );
};
