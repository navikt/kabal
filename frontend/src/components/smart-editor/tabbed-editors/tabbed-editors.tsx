import { ClockDashedIcon, DocPencilIcon, TabsAddIcon } from '@navikt/aksel-icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { ErrorBoundary, StyledDescriptionTerm, StyledPreDescriptionDetails } from '@app/error-boundary/error-boundary';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSmartEditorActiveDocument } from '@app/hooks/settings/use-setting';
import { useIsMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useSmartEditors } from '@app/hooks/use-smart-editors';
import { useLazyGetSmartEditorQuery } from '@app/redux-api/oppgaver/queries/smart-editor';
import { ISmartEditor } from '@app/types/smart-editor/smart-editor';
import { CommentSection } from '../comments/comment-section';
import { SmartEditorContextComponent } from '../context/smart-editor-context';
import { GodeFormuleringer } from '../gode-formuleringer/gode-formuleringer';
import { NewDocument } from '../new-document/new-document';
import { SmartEditor } from '../smart-editor';
import { CommentsClickBoundary } from './comments-click-boundry';
import { ActiveTabButton, TabButton, TabsContainer } from './styled-components';

const NEW_TAB_ID = 'NEW_TAB_ID';

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
  const { value: editorId = firstEditor?.id ?? NEW_TAB_ID, setValue: setEditorId } = useSmartEditorActiveDocument();

  const activeEditorId = editors.some(({ id }) => id === editorId) ? editorId : NEW_TAB_ID;

  return (
    <>
      <Tabs editors={editors} activeTab={activeEditorId} setActiveTab={setEditorId} />
      <ShowTab editors={editors} activeEditorId={activeEditorId} oppgaveId={oppgaveId} onCreate={setEditorId} />
    </>
  );
};

interface TabsProps {
  editors: ISmartEditor[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Tabs = ({ editors, activeTab, setActiveTab }: TabsProps) => {
  const tabs = editors.map(({ id, tittel }) => {
    const Button = id === activeTab ? ActiveTabButton : TabButton;

    return (
      <Button type="button" key={id} onClick={() => setActiveTab(id)}>
        <DocPencilIcon aria-hidden />
        {tittel}
      </Button>
    );
  });

  return (
    <TabsContainer>
      {tabs}
      <ShowNewTabButton onClick={() => setActiveTab(NEW_TAB_ID)} isActive={activeTab === NEW_TAB_ID} />
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
      <TabsAddIcon />
    </NewTabButton>
  );
};

interface Props {
  oppgaveId: string;
  activeEditorId: string;
  editors: ISmartEditor[];
  onCreate: (documentId: string) => void;
}

const ShowTab = ({ activeEditorId, editors, oppgaveId, onCreate }: Props) => {
  const [getSmartEditor, { isLoading }] = useLazyGetSmartEditorQuery();

  const editorComponents = editors.map((editor) => {
    const isActive = editor.id === activeEditorId;

    return (
      <SmartEditorContextComponent
        key={editor.id}
        documentId={editor.id}
        templateId={editor.templateId}
        dokumentTypeId={editor.dokumentTypeId}
      >
        <CommentsClickBoundary isActive={isActive}>
          <ErrorBoundary
            errorComponent={() => <DocumentErrorComponent documentId={editor.id} oppgaveId={oppgaveId} />}
            actionButton={{
              onClick: () => getSmartEditor({ dokumentId: editor.id, oppgaveId }, false).unwrap(),
              loading: isLoading,
              disabled: isLoading,
              buttonText: 'Gjenopprett dokument',
              buttonIcon: <ClockDashedIcon aria-hidden />,
              variant: 'primary',
              size: 'small',
            }}
          >
            <GodeFormuleringer templateId={editor.templateId} />
            <SmartEditor />
            <CommentSection />
          </ErrorBoundary>
        </CommentsClickBoundary>
      </SmartEditorContextComponent>
    );
  });

  const newTab = activeEditorId === NEW_TAB_ID ? <NewDocument onCreate={onCreate} oppgaveId={oppgaveId} /> : null;

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
