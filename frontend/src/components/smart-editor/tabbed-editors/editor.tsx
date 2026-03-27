import { isObject, LogLevel } from '@grafana/faro-web-sdk';
import { VStack } from '@navikt/ds-react';
import type { YjsProviderConfig } from '@platejs/yjs';
import { HocuspocusProviderWrapper } from '@platejs/yjs';
import { YjsPlugin } from '@platejs/yjs/react';
import { BaseParagraphPlugin, RangeApi, TextApi } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { type BasePoint, Path, Range } from 'slate';
import { StaticDataContext } from '@/components/app/static-data-context';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { EDITOR_SCALE_CSS_VAR } from '@/components/smart-editor/hooks/use-scale';
import { createLocalStorageBackup } from '@/components/smart-editor/tabbed-editors/backup';
import { PlateContextWrapper } from '@/components/smart-editor/tabbed-editors/plate-context';
import { useMounted } from '@/components/smart-editor/tabbed-editors/use-mounted';
import { ENVIRONMENT } from '@/environment';
import { hasOwn } from '@/functions/object';
import { parseJSON } from '@/functions/parse-json';
import { getQueryParams } from '@/headers';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import type { ScalingGroup } from '@/hooks/settings/use-setting';
import { pushError, pushLog } from '@/observability';
import { createCapitalisePlugin } from '@/plate/plugins/capitalise/capitalise';
import { components, saksbehandlerPlugins } from '@/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@/plate/sheet';
import { getScaleVar } from '@/plate/status-bar/scale-context';
import { SaksbehandlerToolbar } from '@/plate/toolbar/toolbars/saksbehandler-toolbar';
import type { KabalValue, RichTextEditor } from '@/plate/types';
import { reduxStore } from '@/redux/configure-store';
import { documentsQuerySlice, useLazyGetDocumentQuery } from '@/redux-api/oppgaver/queries/documents';
import type { ISmartDocumentOrAttachment } from '@/types/documents/documents';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';
import type { GenericObject } from '@/types/types';

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
  const [isSynced, setIsSynced] = useState(false);
  const [readOnly, setReadOnly] = useState(!ENVIRONMENT.isLocal); // Start in read-only mode until we know otherwise. Must start as writable (readOnly=false) on localhost to get write access at all.

  const url = useMemo(
    () => `/collaboration/behandlinger/${oppgave.id}/dokumenter/${id}?${getQueryParams().toString()}`,
    [oppgave.id, id],
  );

  const context = { dokumentId: id, oppgaveId: oppgave.id };

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
      onClose: async ({ event }) => {
        pushLog(`WebSocket closed with code ${event.code} and reason: ${event.reason}`, { context });

        if (event.code === 1000 || event.code === 1005) {
          return;
        }

        if (event.code === 4410) {
          console.debug('Code 4410 - Document has been deleted remotely. Destroying Yjs connection.');
          pushLog('Code 4410 - Document has been deleted remotely. Destroying Yjs connection.', { context });
          destroyAndDelete();

          return;
        }

        if (event.code === 4401 && !ENVIRONMENT.isLocal) {
          return window.location.assign('/oauth2/login');
        }

        setIsConnected(false);
        setIsSynced(false);

        // 4403: Reconnect immediately to regain access, with new access rights.
        // 1001: Pod gracefully closed the connection, likely due to a redeploy. Reconnect immediately.
        if (event.code === 4403 || event.code === 1001) {
          return yjs.connect();
        }

        if (event.code === 4404) {
          console.debug('Code 4404 - Document not found. Destroying Yjs connection.');
          pushLog('Code 4404 - Document not found. Destroying Yjs connection.', { context });
          destroyAndDelete();

          return;
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
            pushError(err, { context });
          }
        }
      },
      onSynced: () => {
        setIsSynced(true);
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
        setIsSynced(false);
      },
      onAuthenticationFailed: ({ reason }) => {
        console.error('Authentication failed', reason);
        pushLog(`Authentication failed: ${reason}`, { context });

        if (reason === 'DOCUMENT_NOT_FOUND') {
          destroyAndDelete();
        } else {
          setReadOnly(true);
          setIsConnected(false);
        }
      },
      onStateless: ({ payload }) => {
        const parsed = parseJSON<{ type: string } & GenericObject>(payload);

        if (parsed === null) {
          pushLog(`Received stateless event with invalid JSON payload: ${payload}`, { context }, LogLevel.ERROR);

          return;
        }

        const { type, ...rest } = parsed;

        switch (type) {
          case 'readonly':
            setReadOnly(true);

            break;
          case 'read-write':
            setReadOnly(false);

            break;
          case 'deleted':
            console.debug('Stateless deleted - Document has been deleted remotely. Destroying Yjs connection.', {
              ...context,
              ...rest,
            });

            pushLog('Stateless deleted - Document has been deleted remotely. Destroying Yjs connection.', {
              context: { ...context, ...rest },
            });

            destroyAndDelete();

            break;
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

  const forceDestroyProviders = useCallback(() => {
    const { _providers } = editor.getOptions(YjsPlugin);

    for (const wrapper of _providers) {
      try {
        if (wrapper instanceof HocuspocusProviderWrapper) {
          wrapper.provider.destroy();
        } else {
          wrapper.destroy();
        }
      } catch (e) {
        console.debug('Error destroying provider', e);
      }
    }
  }, [editor]);

  const destroyAndDelete = () => {
    setReadOnly(true);
    setIsConnected(false);
    setIsSynced(false);
    yjs.destroy();
    forceDestroyProviders();

    reduxStore.dispatch(
      documentsQuerySlice.util.updateQueryData('getDocuments', oppgave.id, (documents) => {
        const before = documents.map((d) => d.id).toString();
        const filtered = documents.filter((document) => document.id !== id && document.parentId !== id);
        const after = filtered.map((d) => d.id).toString();

        pushLog('Document removed from store', {
          context: { dokumentId: id, oppgaveId: oppgave.id, before, after },
        });

        return filtered;
      }),
    );
  };

  useEffect(() => {
    if (!mounted || isInitialized.current) {
      return;
    }

    yjs.init({ id, autoConnect: false });
    isInitialized.current = true;

    return () => {
      try {
        forceDestroyProviders();
      } catch (e) {
        console.debug('useEffect - Error destroying Yjs instance', e);
        pushLog('useEffect - Error destroying Yjs instance', { context: { dokumentId: id } });

        if (e instanceof Error) {
          pushError(e, { context: { dokumentId: id } });
        }
      }
    };
  }, [mounted, yjs, id, forceDestroyProviders]);

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
        <PlateContextWrapper
          smartDocument={smartDocument}
          oppgave={oppgave}
          isConnected={isConnected}
          isSynced={isSynced}
        />
      </Plate>
    </VStack>
  );
};
