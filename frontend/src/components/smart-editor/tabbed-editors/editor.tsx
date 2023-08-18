import { ClockDashedIcon } from '@navikt/aksel-icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { isCollapsed, isText } from '@udecode/plate-common';
import React, { useContext, useRef } from 'react';
import { BasePoint, Path, Range } from 'slate';
import { styled } from 'styled-components';
import { SavedStatusProps } from '@app/components/saved-status/saved-status';
import { Bookmarks } from '@app/components/smart-editor/bookmarks/bookmarks';
import { CommentSection } from '@app/components/smart-editor/comments/comment-section';
import { NewComment } from '@app/components/smart-editor/comments/new-comment';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { GodeFormuleringer } from '@app/components/smart-editor/gode-formuleringer/gode-formuleringer';
import { useCanEditDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import { DocumentErrorComponent } from '@app/error-boundary/document-error';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { PlateEditor, PlateEditorContextComponent } from '@app/plate/plate-editor';
import { saksbehandlerPlugins } from '@app/plate/plugins/plugins';
import { Sheet } from '@app/plate/sheet';
import { PlateEditorContent } from '@app/plate/styled-components';
import { FloatingSaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/floating-toolbar';
import { SaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/saksbehandler-toolbar';
import { SaksbehandlerTableToolbar } from '@app/plate/toolbar/toolbars/table-toolbar';
import { EditorValue, useMyPlateEditorRef } from '@app/plate/types';
import { useLazyGetSmartEditorQuery } from '@app/redux-api/oppgaver/queries/smart-editor';
import { NoTemplateIdEnum, TemplateIdEnum } from '@app/types/smart-editor/template-enums';

interface EditorProps {
  id: string;
  templateId: TemplateIdEnum | NoTemplateIdEnum;
  initialValue: EditorValue;
  onChange: (value: EditorValue) => void;
  updateStatus: SavedStatusProps;
}

export const Editor = ({ id, templateId, initialValue, onChange, updateStatus }: EditorProps) => {
  const oppgaveId = useOppgaveId();
  const [getSmartEditor, { isLoading }] = useLazyGetSmartEditorQuery();
  const { newCommentSelection } = useContext(SmartEditorContext);

  if (oppgaveId === skipToken) {
    return null;
  }

  if (isLoading) {
    return (
      <Container>
        <SaksbehandlerToolbar {...updateStatus} />
        <Sheet $minHeight />
      </Container>
    );
  }

  return (
    <Container>
      <PlateEditorContextComponent
        initialValue={initialValue}
        id={id}
        onChange={onChange}
        plugins={saksbehandlerPlugins}
        decorate={([node, path]) => {
          if (newCommentSelection === null || isCollapsed(newCommentSelection) || !isText(node)) {
            return [];
          }

          if (Range.includes(newCommentSelection, path)) {
            const [start, end] = Range.edges(newCommentSelection);

            // Selection start point.
            const anchor: BasePoint = {
              path,
              offset: Path.equals(start.path, path) ? start.offset : 0,
            };

            // Selection end point.
            const focus: BasePoint = {
              path,
              offset: Path.equals(end.path, path) ? end.offset : node.text.length,
            };

            return [{ anchor, focus, selected: true }];
          }

          return [];
        }}
      >
        <GodeFormuleringer templateId={templateId} />

        <Content>
          <SaksbehandlerToolbar {...updateStatus} />

          <ErrorBoundary
            errorComponent={() => <DocumentErrorComponent documentId={id} oppgaveId={oppgaveId} />}
            actionButton={{
              onClick: () => getSmartEditor({ dokumentId: id, oppgaveId }, false).unwrap(),
              loading: isLoading,
              disabled: isLoading,
              buttonText: 'Gjenopprett dokument',
              buttonIcon: <ClockDashedIcon aria-hidden />,
              variant: 'primary',
              size: 'small',
            }}
          >
            <EditorWithNewCommentAndFloatingToolbar id={id} />
          </ErrorBoundary>
        </Content>

        <StickyRightContainer>
          <Bookmarks editorId={id} />
          <CommentSection />
        </StickyRightContainer>
      </PlateEditorContextComponent>
    </Container>
  );
};

const StickyRightContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  position: sticky;
  top: 0;
  overflow-y: auto;
  height: 100%;
  width: 350px;
`;

const EditorWithNewCommentAndFloatingToolbar = ({ id }: { id: string }) => {
  const readOnly = useCanEditDocument();
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <Sheet ref={containerRef} $minHeight>
      <FloatingSaksbehandlerToolbar container={containerRef.current} editorId={id} />
      <SaksbehandlerTableToolbar container={containerRef.current} editorId={id} />

      <NewComment container={containerRef.current} />

      <PlateEditor id={id} readOnly={readOnly} />
    </Sheet>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 16px;
  height: 100%;
  overflow-y: auto;
  align-items: flex-start;
  scroll-padding-top: 64px;
`;

const Content = ({ children }: { children?: React.ReactNode }) => {
  const editor = useMyPlateEditorRef();
  const { showGodeFormuleringer, setShowGodeFormuleringer, setNewCommentSelection } = useContext(SmartEditorContext);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const lowerCaseKey = event.key.toLowerCase();

    if ((event.ctrlKey || event.metaKey) && event.shiftKey && lowerCaseKey === 'f') {
      event.preventDefault();
      setShowGodeFormuleringer(!showGodeFormuleringer);

      return;
    }

    if ((event.ctrlKey || event.metaKey) && lowerCaseKey === 'k') {
      event.preventDefault();
      setNewCommentSelection(editor.selection);
    }
  };

  return <PlateEditorContent onKeyDown={onKeyDown}>{children}</PlateEditorContent>;
};
