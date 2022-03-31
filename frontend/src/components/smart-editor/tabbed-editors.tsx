import { NewTab } from '@navikt/ds-icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../hooks/oppgavebehandling/use-oppgave-id';
import { useSmartDocuments } from '../../hooks/use-smart-documents';
import { ISmartDocument } from '../../types/documents';
import { CommentSection } from './comments/comment-section';
import { SmartEditorContextComponent } from './context/smart-editor-context';
import { NewDocument } from './new-document/new-document';
import { SmartEditor } from './smart-editor';

export const TabbedEditors = () => {
  const oppgaveId = useOppgaveId();
  const documents = useSmartDocuments(oppgaveId);

  if (typeof documents === 'undefined') {
    return null;
  }

  return <Tabbed oppgaveId={oppgaveId} documents={documents} />;
};

interface TabbedProps {
  oppgaveId: string;
  documents: ISmartDocument[];
}

const Tabbed = ({ oppgaveId, documents }: TabbedProps) => {
  const [documentId, setDocumentId] = useState<string | null>(documents[0]?.id);

  const activeDocumentId = documents.some(({ id }) => id === documentId) ? documentId : null;

  return (
    <>
      <Tabs documents={documents} activeTab={activeDocumentId} setActiveTab={setDocumentId} />
      <ShowTab
        documents={documents}
        activeDocumentId={activeDocumentId}
        oppgaveId={oppgaveId}
        onCreate={setDocumentId}
      />
    </>
  );
};

interface TabsProps {
  documents: ISmartDocument[];
  activeTab: string | null;
  setActiveTab: (id: string | null) => void;
}

const Tabs = ({ documents, activeTab, setActiveTab }: TabsProps) => {
  const tabs = documents.map(({ id, tittel }) => {
    const Button = id === activeTab ? ActiveTabButton : TabButton;

    return (
      <Button key={id} onClick={() => setActiveTab(id)}>
        {tittel}
      </Button>
    );
  });

  const NewTabButton = activeTab === null ? ActiveTabButton : TabButton;

  return (
    <TabsContainer>
      {tabs}
      <NewTabButton onClick={() => setActiveTab(null)} title="Nytt dokument">
        <NewTab />
      </NewTabButton>
    </TabsContainer>
  );
};

interface Props {
  oppgaveId: string;
  activeDocumentId: string | null;
  documents: ISmartDocument[];
  onCreate: (documentId: string) => void;
}

const ShowTab = ({ activeDocumentId, documents, oppgaveId, onCreate }: Props) => {
  const editors = documents.map((document) => {
    const isActive = document.id === activeDocumentId;

    return (
      <EditorContainer key={document.id} isActive={isActive}>
        <SmartEditorContextComponent documentId={document.id}>
          <SmartEditor />
          <CommentSection />
        </SmartEditorContextComponent>
      </EditorContainer>
    );
  });

  const newTab = activeDocumentId === null ? <NewDocument onCreate={onCreate} oppgaveId={oppgaveId} /> : null;

  return (
    <>
      {editors}
      {newTab}
    </>
  );
};

const EditorContainer = styled.div<{ isActive: boolean }>`
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
  flex-direction: row;
  position: relative;
  width: 100%;
  overflow-y: hidden;
`;

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
  border-bottom: 1px solid lightgrey;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  height: fit-content;
`;

const TabButton = styled.button`
  background-color: transparent;
  border: none;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin: 0;
  cursor: pointer;
  border-radius: 4px;

  :hover {
    background-color: #f5f5f5;
  }
`;

const ActiveTabButton = styled(TabButton)`
  background-color: lightgrey;
`;
