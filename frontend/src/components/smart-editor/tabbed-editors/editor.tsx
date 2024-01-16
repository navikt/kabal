import { ClockDashedIcon } from '@navikt/aksel-icons';
import { skipToken } from '@reduxjs/toolkit/query';
import { Plate, isCollapsed, isText } from '@udecode/plate-common';
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
import { Content } from '@app/components/smart-editor/tabbed-editors/content';
import { DocumentErrorComponent } from '@app/error-boundary/document-error';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { PlateEditor } from '@app/plate/plate-editor';
import { saksbehandlerPlugins } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@app/plate/sheet';
import { StatusBar } from '@app/plate/status-bar/status-bar';
import { FloatingSaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/floating-toolbar';
import { SaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/saksbehandler-toolbar';
import { SaksbehandlerTableToolbar } from '@app/plate/toolbar/toolbars/table-toolbar';
import { EditorValue, RichTextEditor } from '@app/plate/types';
import { useLazyGetDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

interface EditorProps {
  id: string;
  templateId: TemplateIdEnum;
  initialValue: EditorValue;
  onChange: (value: EditorValue) => void;
  updateStatus: SavedStatusProps;
}

export const Editor = ({ id, templateId, initialValue, onChange, updateStatus }: EditorProps) => {
  const oppgaveId = useOppgaveId();
  const [getDocument, { isLoading }] = useLazyGetDocumentQuery();
  const { newCommentSelection } = useContext(SmartEditorContext);
  const canEdit = useCanEditDocument(templateId);

  if (oppgaveId === skipToken) {
    return null;
  }

  if (isLoading) {
    return (
      <Container>
        <SaksbehandlerToolbar />
        <Sheet $minHeight />
      </Container>
    );
  }

  return (
    <Container>
      <Plate<EditorValue, RichTextEditor>
        initialValue={initialValue}
        id={id}
        readOnly={!canEdit}
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
          <SaksbehandlerToolbar />

          <ErrorBoundary
            errorComponent={() => <DocumentErrorComponent documentId={id} oppgaveId={oppgaveId} />}
            actionButton={{
              onClick: () => getDocument({ dokumentId: id, oppgaveId }, false).unwrap(),
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

        <StatusBar {...updateStatus} />
      </Plate>
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
`;

const EditorWithNewCommentAndFloatingToolbar = ({ id }: { id: string }) => {
  const { templateId } = useContext(SmartEditorContext);
  const canEdit = useCanEditDocument(templateId);
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <Sheet ref={containerRef} $minHeight>
      <FloatingSaksbehandlerToolbar container={containerRef.current} editorId={id} />
      <SaksbehandlerTableToolbar container={containerRef.current} editorId={id} />

      <NewComment container={containerRef.current} />

      <PlateEditor id={id} readOnly={!canEdit} />
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
