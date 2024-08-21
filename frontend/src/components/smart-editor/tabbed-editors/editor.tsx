/* eslint-disable max-lines */
import { ClockDashedIcon } from '@navikt/aksel-icons';
import { skipToken } from '@reduxjs/toolkit/query';
import { relativeRangeToSlateRange } from '@slate-yjs/core';
import { Plate, isCollapsed, isText } from '@udecode/plate-common';
import { Profiler, useContext, useEffect, useState } from 'react';
import { BasePoint, Path, Range } from 'slate';
import { styled } from 'styled-components';
import { XmlText } from 'yjs';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { NewComment } from '@app/components/smart-editor/comments/new-comment';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { GodeFormuleringer } from '@app/components/smart-editor/gode-formuleringer/gode-formuleringer';
import { History } from '@app/components/smart-editor/history/history';
import { useCanEditDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import { Content } from '@app/components/smart-editor/tabbed-editors/content';
import { CursorOverlay, cursorStore, isYjsCursor } from '@app/components/smart-editor/tabbed-editors/cursors/cursors';
import { PositionedRight } from '@app/components/smart-editor/tabbed-editors/positioned-right';
import { StickyRight } from '@app/components/smart-editor/tabbed-editors/sticky-right';
import { DocumentErrorComponent } from '@app/error-boundary/document-error';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorSpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { editorMeasurements } from '@app/observability';
import { PlateEditor } from '@app/plate/plate-editor';
import { collaborationSaksbehandlerPlugins } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@app/plate/sheet';
import { StatusBar } from '@app/plate/status-bar/status-bar';
import { FloatingSaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/floating-toolbar';
import { SaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/saksbehandler-toolbar';
import { SaksbehandlerTableToolbar } from '@app/plate/toolbar/toolbars/table-toolbar';
import { EditorValue, RichTextEditor, useMyPlateEditorRef } from '@app/plate/types';
import { useGetMySignatureQuery, useGetSignatureQuery } from '@app/redux-api/bruker';
import { useLazyGetDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { ISmartDocument } from '@app/types/documents/documents';

interface EditorProps {
  smartDocument: ISmartDocument;
}

export const Editor = ({ smartDocument }: EditorProps) => {
  const { id, templateId } = smartDocument;
  const [getDocument, { isLoading }] = useLazyGetDocumentQuery();
  const { newCommentSelection, showAnnotationsAtOrigin } = useContext(SmartEditorContext);
  const { user } = useContext(StaticDataContext);
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
        initialValue={smartDocument.content}
        id={id}
        readOnly={!canEdit}
        plugins={collaborationSaksbehandlerPlugins(oppgave.id, id, smartDocument, user)}
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

        <StatusBar />
      </Plate>
    </Container>
  );
};

interface ChangeSet {
  added: number[];
  removed: number[];
  updated: number[];
}

type OnChangeFn = (changeset: ChangeSet) => void;

const EditorWithNewCommentAndFloatingToolbar = ({ id }: { id: string }) => {
  const { templateId, setSheetRef } = useContext(SmartEditorContext);
  const canEdit = useCanEditDocument(templateId);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const lang = useSmartEditorSpellCheckLanguage();

  const editor = useMyPlateEditorRef(id);

  useEffect(() => {
    const onChange: OnChangeFn = ({ added, removed, updated }) => {
      const states = editor.awareness.getStates();

      cursorStore.store.setState((draft) => {
        for (const a of added.concat(updated)) {
          const cursor = states.get(a);

          if (isYjsCursor(cursor)) {
            draft[a] = {
              ...cursor,
              selection: relativeRangeToSlateRange(
                editor.yjs.provider.document.get('content', XmlText),
                editor,
                cursor.selection,
              ),
            };
          }
        }

        for (const r of removed) {
          delete draft[r];
        }
      });
    };

    editor.awareness.on('change', onChange);

    return () => {
      editor.awareness.off('change', onChange);
    };
  }, [editor, editor.awareness]);

  useEffect(() => {
    setSheetRef(containerElement);
  }, [containerElement, setSheetRef]);

  return (
    <Sheet ref={setContainerElement} $minHeight data-component="sheet" style={{ marginRight: 16 }}>
      <FloatingSaksbehandlerToolbar container={containerElement} editorId={id} />
      <SaksbehandlerTableToolbar container={containerElement} editorId={id} />

      <NewComment container={containerElement} />

      <PlateEditor id={id} readOnly={!canEdit} lang={lang} />

      <CursorOverlay containerElement={containerElement} />
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
