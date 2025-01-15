import { StaticDataContext } from '@app/components/app/static-data-context';
import { NewComment } from '@app/components/smart-editor/comments/new-comment';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { GodeFormuleringer } from '@app/components/smart-editor/gode-formuleringer/gode-formuleringer';
import { History } from '@app/components/smart-editor/history/history';
import { useCanEditDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { Content } from '@app/components/smart-editor/tabbed-editors/content';
import { PositionedRight } from '@app/components/smart-editor/tabbed-editors/positioned-right';
import { StickyRight } from '@app/components/smart-editor/tabbed-editors/sticky-right';
import { VersionStatus } from '@app/components/smart-editor/tabbed-editors/version-status';
import { DocumentErrorComponent } from '@app/error-boundary/document-error';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import { hasOwn } from '@app/functions/object';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import type { ScalingGroup } from '@app/hooks/settings/use-setting';
import { useSmartEditorSpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { KabalPlateEditor } from '@app/plate/plate-editor';
import { collaborationSaksbehandlerPlugins, components } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@app/plate/sheet';
import { getScaleVar } from '@app/plate/status-bar/scale-context';
import { StatusBar } from '@app/plate/status-bar/status-bar';
import { FloatingSaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/floating-toolbar';
import { SaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/saksbehandler-toolbar';
import { SaksbehandlerTableToolbar } from '@app/plate/toolbar/toolbars/table-toolbar';
import type { KabalValue, RichTextEditor } from '@app/plate/types';
import { useLazyGetDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { ISmartDocument } from '@app/types/documents/documents';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { isObject } from '@grafana/faro-web-sdk';
import { ClockDashedIcon, CloudFillIcon, CloudSlashFillIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import { RangeApi, TextApi } from '@udecode/plate';
import { Plate, useEditorRef, usePlateEditor } from '@udecode/plate-core/react';
import { YjsPlugin } from '@udecode/plate-yjs/react';
import { useContext, useEffect, useState } from 'react';
import { type BasePoint, Path, Range } from 'slate';
import { styled } from 'styled-components';

interface EditorProps {
  smartDocument: ISmartDocument;
  scalingGroup: ScalingGroup;
}

export const Editor = (props: EditorProps) => {
  const [, { isLoading }] = useLazyGetDocumentQuery();

  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
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

  return <LoadedEditor {...props} oppgave={oppgave} />;
};

interface LoadedEditorProps extends EditorProps {
  oppgave: IOppgavebehandling;
}

const LoadedEditor = ({ oppgave, smartDocument, scalingGroup }: LoadedEditorProps) => {
  const { id, templateId } = smartDocument;
  const { newCommentSelection } = useContext(SmartEditorContext);
  const { user } = useContext(StaticDataContext);
  const canEdit = useCanEditDocument(templateId);
  const plugins = collaborationSaksbehandlerPlugins(oppgave.id, id, smartDocument, user);

  const editor = usePlateEditor<KabalValue, (typeof plugins)[0]>({
    id,
    plugins,
    override: {
      components,
    },
    value: structuredClone(smartDocument.content),
  });

  return (
    <Container style={{ [EDITOR_SCALE_CSS_VAR.toString()]: getScaleVar(scalingGroup) }}>
      <Plate<RichTextEditor>
        editor={editor}
        readOnly={!canEdit}
        decorate={({ entry }) => {
          const [node, path] = entry;
          if (newCommentSelection === null || RangeApi.isCollapsed(newCommentSelection) || !TextApi.isText(node)) {
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

interface PlateContextProps {
  smartDocument: ISmartDocument;
  oppgave: IOppgavebehandling;
}

const PlateContext = ({ smartDocument, oppgave }: PlateContextProps) => {
  const { id, templateId } = smartDocument;
  const [getDocument, { isLoading }] = useLazyGetDocumentQuery();
  const { showAnnotationsAtOrigin, showHistory } = useContext(SmartEditorContext);
  const editor = useEditorRef(id);
  const options = editor.getOptions(YjsPlugin);
  const [isConnected, setIsConnected] = useState(options.provider.isConnected);

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
  //                 options.provider.document.get('content', XmlText),
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
          options.provider.connect();
        }
      } catch (err) {
        console.error(err);
      }
    };

    options.provider.on('close', onClose);

    return () => {
      options.provider.off('close', onClose);
    };
  }, [options.provider]);

  useEffect(() => {
    // Disconnect happens before close. Too early to reconnect.
    const onDisconnect = () => setIsConnected(false);

    // Connect happens after connection is established.
    const onConnect = () => setIsConnected(true);

    options.provider.on('disconnect', onDisconnect);
    options.provider.on('connect', onConnect);

    return () => {
      options.provider.off('disconnect', onDisconnect);
      options.provider.off('connect', onConnect);
    };
  }, [options.provider]);

  return (
    <>
      <MainContainer>
        <GodeFormuleringer templateId={templateId} />

        <Content>
          <EditorContainer data-area="content">
            <SaksbehandlerToolbar />

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
  const { sheetRef, canEdit } = useContext(SmartEditorContext);
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
  //                 options.provider.document.get('content', XmlText),
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
    sheetRef.current = containerElement;
  }, [containerElement, sheetRef]);

  return (
    <Sheet ref={setContainerElement} $minHeight data-component="sheet" style={{ marginRight: 16 }}>
      <FloatingSaksbehandlerToolbar container={containerElement} editorId={id} />
      <SaksbehandlerTableToolbar container={containerElement} editorId={id} />

      <NewComment container={containerElement} />

      <KabalPlateEditor id={id} readOnly={!(canEdit && isConnected)} lang={lang} />

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
  scroll-padding-top: var(--a-spacing-16);
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
