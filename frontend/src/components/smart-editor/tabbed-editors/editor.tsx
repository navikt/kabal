import { ClockDashedIcon } from '@navikt/aksel-icons';
import { skipToken } from '@reduxjs/toolkit/query';
import { Plate, isCollapsed, isText } from '@udecode/plate-common';
import React, { Profiler, useContext, useEffect, useState } from 'react';
import { BasePoint, Path, Range } from 'slate';
import { styled } from 'styled-components';
import { SavedStatusProps } from '@app/components/saved-status/saved-status';
import { NewComment } from '@app/components/smart-editor/comments/new-comment';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { GodeFormuleringer } from '@app/components/smart-editor/gode-formuleringer/gode-formuleringer';
import { History } from '@app/components/smart-editor/history/history';
import { useCanEditDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import { Content } from '@app/components/smart-editor/tabbed-editors/content';
import { PositionedRight } from '@app/components/smart-editor/tabbed-editors/positioned-right';
import { StickyRight } from '@app/components/smart-editor/tabbed-editors/sticky-right';
import { DocumentErrorComponent } from '@app/error-boundary/document-error';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorSpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { editorMeasurements } from '@app/observability';
import { PlateEditor } from '@app/plate/plate-editor';
import { saksbehandlerPlugins } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@app/plate/sheet';
import { StatusBar } from '@app/plate/status-bar/status-bar';
import { FloatingSaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/floating-toolbar';
import { SaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/saksbehandler-toolbar';
import { SaksbehandlerTableToolbar } from '@app/plate/toolbar/toolbars/table-toolbar';
import { EditorValue, RichTextEditor } from '@app/plate/types';
import { useGetMySignatureQuery, useGetSignatureQuery } from '@app/redux-api/bruker';
import { useLazyGetDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { ISmartDocument } from '@app/types/documents/documents';

interface EditorProps {
  smartDocument: ISmartDocument;
  onChange: (value: EditorValue) => void;
  updateStatus: SavedStatusProps;
}

export const Editor = ({ smartDocument, onChange, updateStatus }: EditorProps) => {
  const { id, templateId, content } = smartDocument;
  const [getDocument, { isLoading }] = useLazyGetDocumentQuery();
  const { newCommentSelection, showAnnotationsAtOrigin } = useContext(SmartEditorContext);
  const canEdit = useCanEditDocument(templateId);
  const [showHistory, setShowHistory] = useState(false);
  const { data: oppgave } = useOppgave();

  const { isLoading: medunderskriverSignatureIsLoading } = useGetSignatureQuery(
    typeof oppgave?.medunderskriver.employee?.navIdent === 'string'
      ? oppgave.medunderskriver.employee.navIdent
      : skipToken,
  );
  const { isLoading: saksbehandlerSignatureIsLoading } = useGetMySignatureQuery();

  // Ensure signatures are initially loaded before rendering the editor in order to avoid unnecessary re-renders and patches
  if (oppgave === undefined || medunderskriverSignatureIsLoading || saksbehandlerSignatureIsLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <Container>
        <SaksbehandlerToolbar showHistory={showHistory} setShowHistory={setShowHistory} />
        <Sheet $minHeight />
      </Container>
    );
  }

  return (
    <Container>
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
            <EditorContainer data-area="content">
              <SaksbehandlerToolbar showHistory={showHistory} setShowHistory={setShowHistory} />

              <ErrorBoundary
                errorComponent={() => <DocumentErrorComponent documentId={id} oppgaveId={oppgave.id} />}
                actionButton={{
                  onClick: () => getDocument({ dokumentId: id, oppgaveId: oppgave.id }, false).unwrap(),
                  loading: isLoading,
                  disabled: isLoading,
                  buttonText: 'Gjenopprett dokument',
                  buttonIcon: <ClockDashedIcon aria-hidden />,
                  variant: 'primary',
                  size: 'small',
                }}
              >
                <Profiler
                  id="render_smart_editor"
                  onRender={(_, __, actualDuration) => editorMeasurements.add(actualDuration)}
                >
                  <EditorWithNewCommentAndFloatingToolbar id={id} />
                </Profiler>
              </ErrorBoundary>
            </EditorContainer>

            {showAnnotationsAtOrigin ? <PositionedRight /> : null}
          </Content>

          {showAnnotationsAtOrigin ? null : <StickyRight id={id} />}

          {showHistory ? <History oppgaveId={oppgave.id} smartDocument={smartDocument} /> : null}
        </MainContainer>

        <StatusBar {...updateStatus} />
      </Plate>
    </Container>
  );
};

const EditorWithNewCommentAndFloatingToolbar = ({ id }: { id: string }) => {
  const { templateId, setSheetRef } = useContext(SmartEditorContext);
  const canEdit = useCanEditDocument(templateId);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const lang = useSmartEditorSpellCheckLanguage();

  useEffect(() => {
    setSheetRef(containerRef);
  }, [containerRef, setSheetRef]);

  return (
    <Sheet ref={setContainerRef} $minHeight data-component="sheet" style={{ marginRight: 16 }}>
      <FloatingSaksbehandlerToolbar container={containerRef} editorId={id} />
      <SaksbehandlerTableToolbar container={containerRef} editorId={id} />

      <NewComment container={containerRef} />

      <PlateEditor id={id} readOnly={!canEdit} lang={lang} />
    </Sheet>
  );
};

const MainContainer = styled.div`
  display: flex;
  max-height: 100%;
  flex-shrink: 1;
  overflow-y: scroll;
  scroll-padding-top: 64px;
  padding-left: 16px;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: content;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  align-items: flex-start;
  overflow: hidden;
`;
