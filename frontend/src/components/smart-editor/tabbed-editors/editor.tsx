/* eslint-disable max-lines */
import { ClockDashedIcon, CloudFillIcon, CloudSlashFillIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import { Plate, isCollapsed, isText } from '@udecode/plate-common';
import { useContext, useEffect, useState } from 'react';
import { BasePoint, Path, Range } from 'slate';
import { styled } from 'styled-components';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { NewComment } from '@app/components/smart-editor/comments/new-comment';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { GodeFormuleringer } from '@app/components/smart-editor/gode-formuleringer/gode-formuleringer';
import { History } from '@app/components/smart-editor/history/history';
import { useCanEditDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import { Content } from '@app/components/smart-editor/tabbed-editors/content';
import { PositionedRight } from '@app/components/smart-editor/tabbed-editors/positioned-right';
import { StickyRight } from '@app/components/smart-editor/tabbed-editors/sticky-right';
import { VersionStatus } from '@app/components/smart-editor/tabbed-editors/version-status';
import { DocumentErrorComponent } from '@app/error-boundary/document-error';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import { hasOwn, isObject } from '@app/functions/object';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorSpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { PlateEditor } from '@app/plate/plate-editor';
import { collaborationSaksbehandlerPlugins } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@app/plate/sheet';
import { StatusBar } from '@app/plate/status-bar/status-bar';
import { FloatingSaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/floating-toolbar';
import { SaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/saksbehandler-toolbar';
import { SaksbehandlerTableToolbar } from '@app/plate/toolbar/toolbars/table-toolbar';
import { EditorValue, RichTextEditor, useMyPlateEditorRef } from '@app/plate/types';
import { useLazyGetDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { ISmartDocument } from '@app/types/documents/documents';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

interface EditorProps {
  smartDocument: ISmartDocument;
}

export const Editor = ({ smartDocument }: EditorProps) => {
  const { id, templateId } = smartDocument;
  const [, { isLoading }] = useLazyGetDocumentQuery();
  const { newCommentSelection } = useContext(SmartEditorContext);
  const { user } = useContext(StaticDataContext);
  const canEdit = useCanEditDocument(templateId);
  const [showHistory, setShowHistory] = useState(false);
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
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
        <PlateContext smartDocument={smartDocument} oppgave={oppgave} />
      </Plate>
    </Container>
  );
};

interface PlateContextProps extends EditorProps {
  oppgave: IOppgavebehandling;
}

const PlateContext = ({ smartDocument, oppgave }: PlateContextProps) => {
  const { id, templateId } = smartDocument;
  const [getDocument, { isLoading }] = useLazyGetDocumentQuery();
  const { showAnnotationsAtOrigin } = useContext(SmartEditorContext);
  const [showHistory, setShowHistory] = useState(false);
  const editor = useMyPlateEditorRef(id);
  const [isConnected, setIsConnected] = useState(editor.yjs.provider.isConnected);

  // const editor = useMyPlateEditorRef(id);

  // useEffect(() => {
  //   const onChange: OnChangeFn = ({ added, removed, updated }) => {
  //     const states = editor.awareness.getStates();

  //     requestAnimationFrame(() => {
  //       cursorStore.store.setState((draft) => {
  //         for (const a of [...added, ...updated]) {
  //           const cursor = states.get(a);

  //           if (isYjsCursor(cursor) && cursor.data.tabId !== TAB_UUID) {
  //             draft[a] = {
  //               ...cursor,
  //               selection: relativeRangeToSlateRange(
  //                 editor.yjs.provider.document.get('content', XmlText),
  //                 editor,
  //                 cursor.selection,
  //               ),
  //             };
  //           }
  //         }

  //         for (const r of removed) {
  //           delete draft[r];
  //         }
  //       });
  //     });
  //   };

  //   editor.awareness.on('change', onChange);

  //   return () => {
  //     editor.awareness.off('change', onChange);
  //   };
  // }, [editor, editor.awareness]);

  useEffect(() => {
    // Close happens after connect is broken. Safe to reconnect.
    const onClose = async () => {
      setIsConnected(false);

      try {
        const res = await fetch('/oauth2/session', { credentials: 'include' });

        if (!res.ok) {
          throw new Error(`API responded with error code ${res.status} for /oauth2/session`);
        }

        const data: unknown = await res.json();

        if (
          isObject(data) &&
          hasOwn(data, 'session') &&
          isObject(data.session) &&
          hasOwn(data.session, 'active') &&
          data.session.active === true
        ) {
          editor.yjs.provider.connect();
        }
      } catch (err) {
        console.error(err);
      }
    };

    editor.yjs.provider.on('close', onClose);

    return () => {
      editor.yjs.provider.off('close', onClose);
    };
  }, [editor.yjs.provider]);

  useEffect(() => {
    // Disconnect happens before close. Too early to reconnect.
    const onDisconnect = () => setIsConnected(false);

    // Connect happens after connection is established.
    const onConnect = () => setIsConnected(true);

    editor.yjs.provider.on('disconnect', onDisconnect);
    editor.yjs.provider.on('connect', onConnect);

    return () => {
      editor.yjs.provider.off('disconnect', onDisconnect);
      editor.yjs.provider.off('connect', onConnect);
    };
  }, [editor.yjs.provider]);

  return (
    <>
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
              <EditorWithNewCommentAndFloatingToolbar id={id} isConnected={isConnected} />
            </ErrorBoundary>
          </EditorContainer>

          {showAnnotationsAtOrigin ? <PositionedRight /> : null}
        </Content>

        {showAnnotationsAtOrigin ? null : <StickyRight id={id} />}

        {showHistory ? <History oppgaveId={oppgave.id} smartDocument={smartDocument} /> : null}
      </MainContainer>

      <StatusBar>
        <Tooltip content={isConnected ? 'Tilkoblet' : 'Frakoblet'}>
          <ConnectionIconContainer>
            {isConnected ? (
              <CloudFillIcon aria-hidden role="presentation" fontSize={24} color="var(--a-icon-success)" />
            ) : (
              <CloudSlashFillIcon aria-hidden role="presentation" fontSize={24} color="var(--a-icon-danger)" />
            )}
          </ConnectionIconContainer>
        </Tooltip>
        <VersionStatus oppgaveId={oppgave.id} dokumentId={id} />
      </StatusBar>
    </>
  );
};

const ConnectionIconContainer = styled.span`
  margin-left: auto;
  margin-right: var(--a-spacing-2);
  border-right: 1px solid var(--a-border-default);
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// interface ChangeSet {
//   added: number[];
//   removed: number[];
//   updated: number[];
// }

// type OnChangeFn = (changeset: ChangeSet) => void;

interface EditorWithNewCommentAndFloatingToolbarProps {
  id: string;
  isConnected: boolean;
}

const EditorWithNewCommentAndFloatingToolbar = ({ id, isConnected }: EditorWithNewCommentAndFloatingToolbarProps) => {
  const { templateId, setSheetRef } = useContext(SmartEditorContext);
  const canEdit = useCanEditDocument(templateId);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const lang = useSmartEditorSpellCheckLanguage();

  // const editor = useMyPlateEditorRef(id);

  // useEffect(() => {
  //   const onChange: OnChangeFn = ({ added, removed, updated }) => {
  //     const states = editor.awareness.getStates();

  //     requestAnimationFrame(() => {
  //       cursorStore.store.setState((draft) => {
  //         for (const a of [...added, ...updated]) {
  //           const cursor = states.get(a);

  //           if (isYjsCursor(cursor) && cursor.data.tabId !== TAB_UUID) {
  //             draft[a] = {
  //               ...cursor,
  //               selection: relativeRangeToSlateRange(
  //                 editor.yjs.provider.document.get('content', XmlText),
  //                 editor,
  //                 cursor.selection,
  //               ),
  //             };
  //           }
  //         }

  //         for (const r of removed) {
  //           delete draft[r];
  //         }
  //       });
  //     });
  //   };

  //   editor.awareness.on('change', onChange);

  //   return () => {
  //     editor.awareness.off('change', onChange);
  //   };
  // }, [editor, editor.awareness]);

  useEffect(() => {
    setSheetRef(containerElement);
  }, [containerElement, setSheetRef]);

  return (
    <Sheet ref={setContainerElement} $minHeight data-component="sheet" style={{ marginRight: 16 }}>
      <FloatingSaksbehandlerToolbar container={containerElement} editorId={id} />
      <SaksbehandlerTableToolbar container={containerElement} editorId={id} />

      <NewComment container={containerElement} />

      <PlateEditor id={id} readOnly={!canEdit || !isConnected} lang={lang} />

      {/* Not needed for now - only one person will edit at a time */}
      {/* {containerElement === null ? null : <CursorOverlay containerElement={containerElement} />} */}
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
  min-width: 210mm;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  align-items: flex-start;
  overflow: hidden;
`;
