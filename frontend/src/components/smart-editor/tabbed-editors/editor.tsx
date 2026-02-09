import { StaticDataContext } from '@app/components/app/static-data-context';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { GodeFormuleringer } from '@app/components/smart-editor/gode-formuleringer/gode-formuleringer';
import { History } from '@app/components/smart-editor/history/history';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import {
  cleanupLocalStorageBackups,
  createLocalStorageBackup,
} from '@app/components/smart-editor/tabbed-editors/backup';
import { Content } from '@app/components/smart-editor/tabbed-editors/content';
import { PositionedRight } from '@app/components/smart-editor/tabbed-editors/positioned-right';
import { StickyRight } from '@app/components/smart-editor/tabbed-editors/sticky-right';
import { VersionStatus } from '@app/components/smart-editor/tabbed-editors/version-status';
import { ENVIRONMENT } from '@app/environment';
import { DocumentErrorComponent } from '@app/error-boundary/document-error';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import { hasOwn } from '@app/functions/object';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import type { ScalingGroup } from '@app/hooks/settings/use-setting';
import { useSmartEditorSpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { pushError, pushLog } from '@app/observability';
import { KabalPlateEditor } from '@app/plate/plate-editor';
import { createCapitalisePlugin } from '@app/plate/plugins/capitalise/capitalise';
import { components, saksbehandlerPlugins } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@app/plate/sheet';
import { getScaleVar } from '@app/plate/status-bar/scale-context';
import { StatusBar } from '@app/plate/status-bar/status-bar';
import { SaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/saksbehandler-toolbar';
import { SaksbehandlerTableToolbar } from '@app/plate/toolbar/toolbars/table-toolbar';
import type { KabalValue, RichTextEditor } from '@app/plate/types';
import { reduxStore } from '@app/redux/configure-store';
import { documentsQuerySlice, useLazyGetDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { isObject } from '@grafana/faro-web-sdk';
import { ClockDashedIcon, CloudFillIcon, CloudSlashFillIcon, DocPencilIcon, FileTextIcon } from '@navikt/aksel-icons';
import { Box, HStack, Tooltip, VStack } from '@navikt/ds-react';
import type { YjsProviderConfig } from '@platejs/yjs';
import { YjsPlugin } from '@platejs/yjs/react';
import { BaseParagraphPlugin, RangeApi, TextApi } from 'platejs';
import { Plate, useEditorReadOnly, usePlateEditor } from 'platejs/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { type BasePoint, Path, Range } from 'slate';

interface EditorProps {
  smartDocument: ISmartDocumentOrAttachment;
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
      <VStack align="start" justify="space-between" height="100%" overflow="hidden">
        <SaksbehandlerToolbar />
        <Sheet minHeight />
      </VStack>
    );
  }

  return <LoadedEditor {...props} oppgave={oppgave} />;
};

interface LoadedEditorProps extends EditorProps {
  oppgave: IOppgavebehandling;
}

const LoadedEditor = ({ oppgave, smartDocument, scalingGroup }: LoadedEditorProps) => {
  const { id } = smartDocument;
  const { newCommentSelection } = useContext(SmartEditorContext);
  const { user } = useContext(StaticDataContext);
  const [isConnected, setIsConnected] = useState(false);
  const [readOnly, setReadOnly] = useState(!ENVIRONMENT.isLocal); // Start in read-only mode until we know otherwise. Must start as writable (readOnly=false) on localhost to get write access at all.

  const url = `/collaboration/behandlinger/${oppgave.id}/dokumenter/${id}`;

  const provider: YjsProviderConfig = {
    type: 'hocuspocus',
    wsOptions: {
      url,
      maxAttempts: 1,
    },
    options: {
      url,
      name: id,
      token: user.navIdent, // There must be a token defined for the server auth hook to run.
      onAuthenticated: ({ scope }) => setReadOnly(scope !== 'read-write'),
      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
      onClose: async ({ event }) => {
        if (event.code === 1000 || event.code === 1001 || event.code === 1005) {
          return;
        }

        if (event.code === 4410) {
          console.debug('Code 4410 - Document has been deleted remotely. Destroying Yjs connection.');
          pushLog('Code 4410 - Document has been deleted remotely. Destroying Yjs connection.', {
            context: { dokumentId: id, oppgaveId: oppgave.id },
          });
          setReadOnly(true);
          setIsConnected(false);
          try {
            yjs.destroy();
          } catch (e) {
            console.debug('Code 4410 - Error destroying Yjs instance', e);
            pushLog('Code 4410 - Error destroying Yjs instance', {
              context: { dokumentId: id, oppgaveId: oppgave.id },
            });

            if (e instanceof Error) {
              pushError(e, { context: { dokumentId: id, oppgaveId: oppgave.id } });
            }
          }
          return;
        }

        if (event.code === 4401 && !ENVIRONMENT.isLocal) {
          return window.location.assign('/oauth2/login');
        }

        setIsConnected(false);

        if (event.code === 4403) {
          yjs.connect(); // Reconnect immediately to regain access, with new access rights.
          return;
        }

        if (event.code === 4404) {
          console.debug('Code 4404 - Document not found. Destroying Yjs connection.');
          setReadOnly(true);
          setIsConnected(false);
          yjs.destroy();

          reduxStore.dispatch(
            documentsQuerySlice.util.updateQueryData('getDocuments', oppgave.id, (documents) =>
              documents.filter((document) => document.id !== id && document.parentId !== id),
            ),
          );
        }

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
            console.debug('Reconnecting Yjs...');
            pushLog('Reconnecting Yjs...');
            yjs.connect();
          }
        } catch (err) {
          console.error(err);

          if (err instanceof Error) {
            pushError(err, { context: { dokumentId: id, oppgaveId: oppgave.id } });
          }
        }
      },
      onSynced: () => {
        // "Normalize" away empty paragraph that is automatically created between local initialization and Yjs connection.
        const first = editor.children[0];
        const second = editor.children[1];

        if (first === undefined || second === undefined) {
          return;
        }

        if (
          first.type === BaseParagraphPlugin.key &&
          first.children.length === 1 &&
          first.children.at(0)?.text === ''
        ) {
          editor.tf.removeNodes({ at: [0] });
        }
      },
      onConnect: () => {
        setIsConnected(true);
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onAuthenticationFailed: () => {
        console.error('Authentication failed');
        setReadOnly(true);
        setIsConnected(false);
      },
      onStateless: ({ payload }) => {
        switch (payload) {
          case 'readonly':
            setReadOnly(true);
            return;
          case 'read-write':
            setReadOnly(false);
            return;
          case 'deleted':
            console.debug('Stateless deleted - Document has been deleted remotely. Destroying Yjs connection.');
            pushLog('Stateless deleted - Document has been deleted remotely. Destroying Yjs connection.', {
              context: { dokumentId: id, oppgaveId: oppgave.id },
            });
            setReadOnly(true);
            setIsConnected(false);
            try {
              yjs.destroy();
            } catch (e) {
              console.debug('Stateless deleted - Error destroying Yjs instance', e);
              pushLog('Stateless deleted - Error destroying Yjs instance', {
                context: { dokumentId: id, oppgaveId: oppgave.id },
              });

              if (e instanceof Error) {
                pushError(e, { context: { dokumentId: id, oppgaveId: oppgave.id } });
              }
            }
            return;
        }
      },
    },
  };

  const yjsPlugin = YjsPlugin.configure({ options: { providers: [provider] } });
  const plugins = [...saksbehandlerPlugins, createCapitalisePlugin(user.navIdent), yjsPlugin];

  const editor = usePlateEditor<KabalValue, (typeof plugins)[0]>({
    id,
    plugins,
    override: { components },
    skipInitialization: true,
  });

  const mounted = useMounted();
  const isInitialized = useRef(false);

  const { yjs } = editor.getApi(YjsPlugin);

  useEffect(() => {
    if (!mounted || isInitialized.current) {
      return;
    }

    yjs.init({ id, autoConnect: false });
    isInitialized.current = true;

    return () => {
      try {
        yjs.destroy();
      } catch (e) {
        console.debug('useEffect - Error destroying Yjs instance', e);
        pushLog('useEffect - Error destroying Yjs instance', { context: { dokumentId: id } });

        if (e instanceof Error) {
          pushError(e, { context: { dokumentId: id } });
        }
      }
    };
  }, [mounted, yjs, id]);

  // Set read-only mode when disconnected for 10 seconds.
  useEffect(() => {
    if (isConnected) {
      return;
    }

    const timeout = setTimeout(() => setReadOnly(true), 10_000);

    return () => clearTimeout(timeout);
  }, [isConnected]);

  const backupIdleCallbackId = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (backupIdleCallbackId.current !== null) {
        cancelIdleCallback(backupIdleCallbackId.current);
      }
    },
    [],
  );

  return (
    <VStack
      align="start"
      justify="space-between"
      height="100%"
      overflow="hidden"
      style={{ [EDITOR_SCALE_CSS_VAR.toString()]: getScaleVar(scalingGroup) }}
    >
      <Plate<RichTextEditor>
        editor={editor}
        readOnly={readOnly}
        onChange={({ value }) => {
          if (backupIdleCallbackId.current !== null) {
            cancelIdleCallback(backupIdleCallbackId.current);
          }

          backupIdleCallbackId.current = createLocalStorageBackup(oppgave.id, id, value);
        }}
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
        <PlateContext smartDocument={smartDocument} oppgave={oppgave} isConnected={isConnected} />
      </Plate>
    </VStack>
  );
};

interface PlateContextProps {
  smartDocument: ISmartDocumentOrAttachment;
  oppgave: IOppgavebehandling;
  isConnected: boolean;
}

// Copy-paste from Plate docs
const useMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
};

const PlateContext = ({ smartDocument, oppgave, isConnected }: PlateContextProps) => {
  const { id, templateId } = smartDocument;
  const [getDocument, { isLoading }] = useLazyGetDocumentQuery();
  const { showAnnotationsAtOrigin, showHistory } = useContext(SmartEditorContext);
  const readOnly = useEditorReadOnly();

  return (
    <>
      <HStack wrap={false} maxHeight="100%" flexShrink="1" overflowY="scroll" className="scroll-pt-16">
        <GodeFormuleringer templateId={templateId} />

        <Content>
          <VStack minWidth="210mm" className="[grid-area:content]" data-area="content">
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
              <EditorWithNewCommentAndFloatingToolbar id={id} />
            </ErrorBoundary>
          </VStack>

          {showAnnotationsAtOrigin ? <PositionedRight /> : null}
        </Content>

        {showAnnotationsAtOrigin ? null : <StickyRight id={id} />}

        {showHistory ? <History oppgaveId={oppgave.id} smartDocument={smartDocument} /> : null}
      </HStack>
      <StatusBar>
        <Tooltip content={readOnly ? 'Lesemodus' : 'Skrivemodus'}>
          <HStack asChild wrap={false} flexShrink="0" align="center" justify="center" paddingInline="space-8">
            <Box as="span" borderWidth="0 1 0 0" borderColor="neutral" marginInline="auto space-0">
              {readOnly ? (
                <FileTextIcon aria-hidden role="presentation" fontSize={24} color="var(--ax-text-neutral)" />
              ) : (
                <DocPencilIcon aria-hidden role="presentation" fontSize={24} color="var(--ax-text-neutral)" />
              )}
            </Box>
          </HStack>
        </Tooltip>

        <Tooltip content={isConnected ? 'Tilkoblet' : 'Frakoblet'}>
          <HStack asChild wrap={false} flexShrink="0" align="center" justify="center" paddingInline="space-8">
            <Box as="span" borderWidth="0 1 0 0" borderColor="neutral" marginInline="space-0 space-8">
              {isConnected ? (
                <CloudFillIcon
                  aria-hidden
                  role="presentation"
                  fontSize={24}
                  color="var(--ax-text-success-decoration)"
                />
              ) : (
                <CloudSlashFillIcon
                  aria-hidden
                  role="presentation"
                  fontSize={24}
                  color="var(--ax-text-danger-decoration)"
                />
              )}
            </Box>
          </HStack>
        </Tooltip>

        <VersionStatus oppgaveId={oppgave.id} dokumentId={id} />
      </StatusBar>
    </>
  );
};

interface EditorWithNewCommentAndFloatingToolbarProps {
  id: string;
}

const EditorWithNewCommentAndFloatingToolbar = ({ id }: EditorWithNewCommentAndFloatingToolbarProps) => {
  const { sheetRef } = useContext(SmartEditorContext);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const lang = useSmartEditorSpellCheckLanguage();

  useEffect(() => {
    sheetRef.current = containerElement;
  }, [containerElement, sheetRef]);

  return (
    <Sheet ref={setContainerElement} minHeight data-component="sheet" className="mr-4">
      <SaksbehandlerTableToolbar container={containerElement} editorId={id} />

      <KabalPlateEditor id={id} lang={lang} contentEditable="dynamic" />
    </Sheet>
  );
};

if (typeof window !== 'undefined' && window.localStorage !== undefined) {
  cleanupLocalStorageBackups(window.localStorage);
}
