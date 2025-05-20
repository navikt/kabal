import { StaticDataContext } from '@app/components/app/static-data-context';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { GodeFormuleringer } from '@app/components/smart-editor/gode-formuleringer/gode-formuleringer';
import { History } from '@app/components/smart-editor/history/history';
import { useHasWriteAccess } from '@app/components/smart-editor/hooks/use-has-write-access';
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
import { createCapitalisePlugin } from '@app/plate/plugins/capitalise/capitalise';
import { components, saksbehandlerPlugins } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@app/plate/sheet';
import { getScaleVar } from '@app/plate/status-bar/scale-context';
import { StatusBar } from '@app/plate/status-bar/status-bar';
import { FloatingSaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/floating-toolbar';
import { SaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/saksbehandler-toolbar';
import { SaksbehandlerTableToolbar } from '@app/plate/toolbar/toolbars/table-toolbar';
import type { KabalValue, RichTextEditor } from '@app/plate/types';
import { useLazyGetDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { isObject } from '@grafana/faro-web-sdk';
import { ClockDashedIcon, CloudFillIcon, CloudSlashFillIcon } from '@navikt/aksel-icons';
import { Box, HStack, Tooltip, VStack } from '@navikt/ds-react';
import { Plate, usePlateEditor } from '@platejs/core/react';
import type { YjsProviderConfig } from '@platejs/yjs';
import { YjsPlugin } from '@platejs/yjs/react';
import { BaseParagraphPlugin, RangeApi, TextApi } from 'platejs';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
        <Sheet $minHeight />
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
  const hasWriteAccess = useHasWriteAccess(smartDocument);
  const [isConnected, setIsConnected] = useState(false);

  const provider: YjsProviderConfig = {
    type: 'hocuspocus',
    options: {
      url: `/collaboration/behandlinger/${oppgave.id}/dokumenter/${id}`,
      name: id,
      onClose: async ({ event }) => {
        if (event.code === 1000 || event.code === 1001 || event.code === 1005) {
          return;
        }

        if (event.code === 4401) {
          return window.location.assign('/oauth2/login');
        }

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
            yjs.connect();
          }
        } catch (err) {
          console.error(err);
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
      onDisconnect: () => {
        setIsConnected(false);
      },
      onConnect: () => {
        setIsConnected(true);
      },
    },
  };

  const yjsPlugin = YjsPlugin.configure({ options: { providers: [provider] } });
  const plugins = [...saksbehandlerPlugins, createCapitalisePlugin(user.navIdent), yjsPlugin];

  const editor = usePlateEditor<KabalValue, (typeof plugins)[0]>({
    id,
    plugins,
    override: { components },
    skipInitialization: false, // Should be true according to Plate docs, but doesn't in platejs@49.0.4-49.0.6
  });

  const mounted = useMounted();
  const isInitialized = useRef(false);

  const { yjs } = editor.getApi(YjsPlugin);

  useLayoutEffect(() => {
    if (!mounted || isInitialized.current) {
      return;
    }

    yjs.init();
    isInitialized.current = true;

    return yjs.destroy;
  }, [mounted, yjs]);

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
        readOnly={!hasWriteAccess}
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
              <EditorWithNewCommentAndFloatingToolbar id={id} isConnected={isConnected} />
            </ErrorBoundary>
          </VStack>

          {showAnnotationsAtOrigin ? <PositionedRight /> : null}
        </Content>

        {showAnnotationsAtOrigin ? null : <StickyRight id={id} />}

        {showHistory ? <History oppgaveId={oppgave.id} smartDocument={smartDocument} /> : null}
      </HStack>

      <StatusBar>
        <Tooltip content={isConnected ? 'Tilkoblet' : 'Frakoblet'}>
          <HStack asChild wrap={false} flexShrink="0" align="center" justify="center" paddingInline="2" data-qqqq>
            <Box as="span" borderWidth="0 1 0 0" borderColor="border-default" marginInline="auto 2">
              {isConnected ? (
                <CloudFillIcon aria-hidden role="presentation" fontSize={24} color="var(--a-icon-success)" />
              ) : (
                <CloudSlashFillIcon aria-hidden role="presentation" fontSize={24} color="var(--a-icon-danger)" />
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
  isConnected: boolean;
}

const EditorWithNewCommentAndFloatingToolbar = ({ id, isConnected }: EditorWithNewCommentAndFloatingToolbarProps) => {
  const { sheetRef, hasWriteAccess } = useContext(SmartEditorContext);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const lang = useSmartEditorSpellCheckLanguage();

  useEffect(() => {
    sheetRef.current = containerElement;
  }, [containerElement, sheetRef]);

  return (
    <Sheet ref={setContainerElement} $minHeight data-component="sheet" className="mr-4">
      <FloatingSaksbehandlerToolbar container={containerElement} editorId={id} />
      <SaksbehandlerTableToolbar container={containerElement} editorId={id} />

      <KabalPlateEditor id={id} readOnly={!(hasWriteAccess && isConnected)} lang={lang} />
    </Sheet>
  );
};
