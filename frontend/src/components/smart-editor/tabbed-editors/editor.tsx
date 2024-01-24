import { ClockDashedIcon } from '@navikt/aksel-icons';
import { skipToken } from '@reduxjs/toolkit/query';
import { Plate, isCollapsed, isText } from '@udecode/plate-common';
import React, { useContext, useRef, useState } from 'react';
import { BasePoint, Path, Range } from 'slate';
import { styled } from 'styled-components';
import { SavedStatusProps } from '@app/components/saved-status/saved-status';
import { NewComment } from '@app/components/smart-editor/comments/new-comment';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { GodeFormuleringer } from '@app/components/smart-editor/gode-formuleringer/gode-formuleringer';
import { History } from '@app/components/smart-editor/history/history';
import { useCanEditDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import { Content } from '@app/components/smart-editor/tabbed-editors/content';
import { StickyRight } from '@app/components/smart-editor/tabbed-editors/sticky-right';
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
import { ISmartDocument } from '@app/types/documents/documents';

interface EditorProps {
  smartDocument: ISmartDocument;
  onChange: (value: EditorValue) => void;
  updateStatus: SavedStatusProps;
}

export const Editor = ({ smartDocument, onChange, updateStatus }: EditorProps) => {
  const { id, templateId, content } = smartDocument;
  const oppgaveId = useOppgaveId();
  const [getDocument, { isLoading }] = useLazyGetDocumentQuery();
  const { newCommentSelection } = useContext(SmartEditorContext);
  const canEdit = useCanEditDocument(templateId);
  const [showHistory, setShowHistory] = useState(false);

  if (oppgaveId === skipToken) {
    return null;
  }

  if (isLoading) {
    return (
      <EditorContainer>
        <SaksbehandlerToolbar showHistory={showHistory} setShowHistory={setShowHistory} />
        <Sheet $minHeight />
      </EditorContainer>
    );
  }

  return (
    <EditorContainer>
      <Plate<EditorValue, RichTextEditor>
        initialValue={content}
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
        <MainContainer>
          <GodeFormuleringer templateId={templateId} />

          <Content>
            <SaksbehandlerToolbar showHistory={showHistory} setShowHistory={setShowHistory} />

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

          <StickyRight id={id} />

          {showHistory ? <History oppgaveId={oppgaveId} smartDocument={smartDocument} /> : null}
        </MainContainer>

        <StatusBar {...updateStatus} />
      </Plate>
    </EditorContainer>
  );
};

const EditorWithNewCommentAndFloatingToolbar = ({ id }: { id: string }) => {
  const { templateId } = useContext(SmartEditorContext);
  const canEdit = useCanEditDocument(templateId);
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <Sheet ref={containerRef} $minHeight data-component="sheet" style={{ marginRight: 16 }}>
      <FloatingSaksbehandlerToolbar container={containerRef.current} editorId={id} />
      <SaksbehandlerTableToolbar container={containerRef.current} editorId={id} />

      <NewComment container={containerRef.current} />

      <PlateEditor id={id} readOnly={!canEdit} />
    </Sheet>
  );
};

const MainContainer = styled.div`
  display: flex;
  max-height: 100%;
  flex-shrink: 1;
  overflow: hidden;
  padding-left: 16px;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  align-items: flex-start;
  scroll-padding-top: 64px;
  overflow: hidden;
`;
