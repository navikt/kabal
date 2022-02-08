import { NewTab } from '@navikt/ds-icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../hooks/oppgavebehandling/use-oppgave-id';
import { useSmartDocuments } from '../../hooks/use-smart-documents';
import { IMainDocument } from '../../types/documents';
import { CommentSection } from './comments/comment-section';
import { SmartEditorContextComponent } from './context/smart-editor-context';
import { NewDocument } from './new-document/new-document';
import { SmartEditor } from './smart-editor';

export const TabbedEditors = () => {
  const oppgaveId = useOppgaveId();
  const documents = useSmartDocuments(oppgaveId);
  const [documentId, setDocumentId] = useState<string | null>(null);

  if (typeof documents === 'undefined') {
    return null;
  }

  const activeDocumentId = documents.some(({ id }) => id === documentId) ? documentId : null;

  return (
    <>
      <Tabs documents={documents} activeTab={activeDocumentId} setActiveTab={setDocumentId} />
      <ShowTab documentId={activeDocumentId} oppgaveId={oppgaveId} onCreate={setDocumentId} />
    </>
  );
};

interface TabsProps {
  documents: IMainDocument[];
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
  documentId: string | null;
  onCreate: (documentId: string) => void;
}

const ShowTab = ({ documentId, oppgaveId, onCreate }: Props) => {
  if (documentId === null) {
    return <NewDocument onCreate={onCreate} oppgaveId={oppgaveId} />;
  }

  return (
    <EditorContainer>
      <SmartEditorContextComponent documentId={documentId}>
        <SmartEditor />
        <CommentSection />
      </SmartEditorContextComponent>
    </EditorContainer>
  );
};

const EditorContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
`;

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  border-bottom: 1px solid lightgrey;
  width: 100%;
  overflow-x: auto;
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
