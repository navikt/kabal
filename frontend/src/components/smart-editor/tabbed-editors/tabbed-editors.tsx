import { NewTab, Notes } from '@navikt/ds-icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useState } from 'react';
import {
  ErrorBoundary,
  StyledDescriptionTerm,
  StyledPreDescriptionDetails,
} from '../../../error-boundary/error-boundary';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useIsMedunderskriver } from '../../../hooks/use-is-medunderskriver';
import { useSmartEditors } from '../../../hooks/use-smart-editors';
import { useDeleteDocumentMutation } from '../../../redux-api/oppgaver/mutations/documents';
import { ISmartEditor } from '../../../types/smart-editor/smart-editor';
import { CommentSection } from '../comments/comment-section';
import { SmartEditorContextComponent } from '../context/smart-editor-context';
import { GodeFormuleringer } from '../gode-formuleringer/gode-formuleringer';
import { NewDocument } from '../new-document/new-document';
import { SmartEditor } from '../smart-editor';
import { CommentsClickBoundary } from './comments-click-boundry';
import { ActiveTabButton, TabButton, TabsContainer } from './styled-components';

export const TabbedEditors = () => {
  const oppgaveId = useOppgaveId();
  const editors = useSmartEditors(oppgaveId);

  if (typeof editors === 'undefined' || oppgaveId === skipToken) {
    return null;
  }

  return <Tabbed oppgaveId={oppgaveId} editors={editors} />;
};

interface TabbedProps {
  oppgaveId: string;
  editors: ISmartEditor[];
}

const Tabbed = ({ oppgaveId, editors }: TabbedProps) => {
  const [firstEditor] = editors;
  const [editorId, setEditorId] = useState<string | null>(firstEditor?.id ?? null);

  const activeEditorId = editors.some(({ id }) => id === editorId) ? editorId : null;

  return (
    <>
      <Tabs editors={editors} activeTab={activeEditorId} setActiveTab={setEditorId} />
      <ShowTab editors={editors} activeEditorId={activeEditorId} oppgaveId={oppgaveId} onCreate={setEditorId} />
    </>
  );
};

interface TabsProps {
  editors: ISmartEditor[];
  activeTab: string | null;
  setActiveTab: (id: string | null) => void;
}

const Tabs = ({ editors, activeTab, setActiveTab }: TabsProps) => {
  const tabs = editors.map(({ id, tittel }) => {
    const Button = id === activeTab ? ActiveTabButton : TabButton;

    return (
      <Button type="button" key={id} onClick={() => setActiveTab(id)}>
        <Notes /> {tittel}
      </Button>
    );
  });

  return (
    <TabsContainer>
      {tabs}
      <ShowNewTabButton onClick={() => setActiveTab(null)} isActive={activeTab === null} />
    </TabsContainer>
  );
};

interface ShowNewTabProps {
  onClick: () => void;
  isActive: boolean;
}

const ShowNewTabButton = ({ isActive, onClick }: ShowNewTabProps) => {
  const isMedunderskriver = useIsMedunderskriver();

  if (isMedunderskriver) {
    return null;
  }

  const NewTabButton = isActive ? ActiveTabButton : TabButton;

  return (
    <NewTabButton onClick={onClick} title="Nytt dokument">
      <NewTab />
    </NewTabButton>
  );
};

interface Props {
  oppgaveId: string;
  activeEditorId: string | null;
  editors: ISmartEditor[];
  onCreate: (documentId: string) => void;
}

const ShowTab = ({ activeEditorId, editors, oppgaveId, onCreate }: Props) => {
  const [deleteDocument, { isLoading }] = useDeleteDocumentMutation();

  const editorComponents = editors.map((editor) => {
    const isActive = editor.id === activeEditorId;

    return (
      <SmartEditorContextComponent key={editor.id} documentId={editor.id} templateId={editor.templateId}>
        <CommentsClickBoundary isActive={isActive}>
          <ErrorBoundary
            onDelete={() => deleteDocument({ dokumentId: editor.id, oppgaveId })}
            isDeleting={isLoading}
            deleteButtonText="Slett dokument"
            errorComponent={() => <DocumentErrorComponent documentId={editor.id} oppgaveId={oppgaveId} />}
          >
            <GodeFormuleringer templateId={editor.templateId} />
            <SmartEditor />
            <CommentSection />
          </ErrorBoundary>
        </CommentsClickBoundary>
      </SmartEditorContextComponent>
    );
  });

  const newTab = activeEditorId === null ? <NewDocument onCreate={onCreate} oppgaveId={oppgaveId} /> : null;

  return (
    <>
      {editorComponents}
      {newTab}
    </>
  );
};

interface DocumentErrorComponentProps {
  oppgaveId: string;
  documentId: string;
}

const DocumentErrorComponent = ({ oppgaveId, documentId }: DocumentErrorComponentProps) => (
  <dl>
    <StyledDescriptionTerm>Behandlings-ID</StyledDescriptionTerm>
    <StyledPreDescriptionDetails>{oppgaveId}</StyledPreDescriptionDetails>
    <StyledDescriptionTerm>Dokument-ID</StyledDescriptionTerm>
    <StyledPreDescriptionDetails>{documentId}</StyledPreDescriptionDetails>
  </dl>
);