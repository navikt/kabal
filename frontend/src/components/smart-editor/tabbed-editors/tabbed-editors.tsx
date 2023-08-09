import { DocPencilIcon, TabsAddIcon } from '@navikt/aksel-icons';
import { Tabs } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useRef } from 'react';
import { styled } from 'styled-components';
import { SmartEditorContextComponent } from '@app/components/smart-editor/context';
import { Editor } from '@app/components/smart-editor/tabbed-editors/editor';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSmartEditorActiveDocument } from '@app/hooks/settings/use-setting';
import { useIsMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useSmartEditors } from '@app/hooks/use-smart-editors';
import { useUpdateSmartEditorMutation } from '@app/redux-api/oppgaver/mutations/smart-editor';
import { ISmartEditor } from '@app/types/smart-editor/smart-editor';
import { NoTemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { NewDocument } from '../new-document/new-document';

const NEW_TAB_ID = 'NEW_TAB_ID';

export const TabbedEditors = () => {
  const oppgaveId = useOppgaveId();
  const editors = useSmartEditors(oppgaveId);

  if (typeof editors === 'undefined') {
    return null;
  }

  return <Tabbed editors={editors} />;
};

interface TabbedProps {
  editors: ISmartEditor[];
}

const Tabbed = ({ editors }: TabbedProps) => {
  const [firstEditor] = editors;
  const { value: editorId = firstEditor?.id ?? NEW_TAB_ID, setValue: setEditorId } = useSmartEditorActiveDocument();

  const activeEditorId = editors.some(({ id }) => id === editorId) ? editorId : NEW_TAB_ID;

  return (
    <StyledTabs value={activeEditorId} onChange={setEditorId} size="small">
      <StyledTabsList>
        {editors.map(({ id, tittel }) => (
          <Tabs.Tab key={id} value={id} label={tittel} icon={<DocPencilIcon aria-hidden />} />
        ))}
        <TabNew />
      </StyledTabsList>
      <StyledTabPanels>
        {editors.map((editor) => (
          <TabPanel key={editor.id} smartEditor={editor} />
        ))}
        <TabPanelNew onCreate={setEditorId} />
      </StyledTabPanels>
    </StyledTabs>
  );
};

const TabNew = () => {
  const isMedunderskriver = useIsMedunderskriver();

  if (isMedunderskriver) {
    return null;
  }

  return <Tabs.Tab value={NEW_TAB_ID} icon={<TabsAddIcon aria-hidden />} />;
};

interface TabPanelNewProps {
  onCreate: (documentId: string) => void;
}

const TabPanelNew = ({ onCreate }: TabPanelNewProps) => {
  const isMedunderskriver = useIsMedunderskriver();

  if (isMedunderskriver) {
    return null;
  }

  return (
    <StyledTabsPanel value={NEW_TAB_ID}>
      <NewDocument onCreate={onCreate} />
    </StyledTabsPanel>
  );
};

interface TabPanelProps {
  smartEditor: ISmartEditor;
}

const TabPanel = ({ smartEditor }: TabPanelProps) => {
  const oppgaveId = useOppgaveId();
  const [update, status] = useUpdateSmartEditorMutation();
  const timeout = useRef<NodeJS.Timeout>();

  const { id, templateId, content } = smartEditor;

  return (
    <StyledTabsPanel value={smartEditor.id}>
      <SmartEditorContextComponent editor={smartEditor}>
        <Editor
          key={id}
          id={id}
          initialValue={content}
          templateId={templateId}
          onChange={(c) => {
            clearTimeout(timeout.current);

            if (oppgaveId === skipToken || templateId === NoTemplateIdEnum.NONE) {
              return;
            }

            timeout.current = setTimeout(() => update({ content: c, templateId, oppgaveId, dokumentId: id }), 1000);
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
  max-width: 1176px;
`;

const StyledTabPanels = styled.div`
  background: var(--a-bg-subtle);
  overflow: hidden;
  flex-grow: 1;
`;
