import { NewTab } from '@navikt/ds-icons';
import React, { useState } from 'react';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useSmartDocuments } from '../../../hooks/use-smart-documents';
import { ISmartDocument } from '../../../types/documents';
import { CommentSection } from '../comments/comment-section';
import { SmartEditorContextComponent } from '../context/smart-editor-context';
import { ErrorBoundary } from '../error-boundary/error-boundary';
import { NewDocument } from '../new-document/new-document';
import { SmartEditor } from '../smart-editor';
import { CommentsClickBoundary } from './comments-click-boundry';
import { ActiveTabButton, TabButton, TabsContainer } from './styled-components';

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
  const [firstDocument] = documents;
  const [documentId, setDocumentId] = useState<string | null>(firstDocument?.id ?? null);

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
      <SmartEditorContextComponent key={document.id} documentId={document.id}>
        <CommentsClickBoundary isActive={isActive}>
          <ErrorBoundary documentId={document.id} oppgaveId={oppgaveId}>
            <SmartEditor />
            <CommentSection />
          </ErrorBoundary>
        </CommentsClickBoundary>
      </SmartEditorContextComponent>
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
