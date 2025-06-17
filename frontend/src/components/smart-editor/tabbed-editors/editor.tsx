import { StaticDataContext } from '@app/components/app/static-data-context';
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
import {
  collaborationSaksbehandlerPlugins,
  components,
  getHocusPocusProvider,
} from '@app/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@app/plate/sheet';
import { getScaleVar } from '@app/plate/status-bar/scale-context';
import { StatusBar } from '@app/plate/status-bar/status-bar';
import { FloatingSaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/floating-toolbar';
import { SaksbehandlerToolbar } from '@app/plate/toolbar/toolbars/saksbehandler-toolbar';
import { SaksbehandlerTableToolbar } from '@app/plate/toolbar/toolbars/table-toolbar';
import { type KabalValue, type RichTextEditor, useMyPlateEditorRef } from '@app/plate/types';
import { useLazyGetDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { ISmartDocument } from '@app/types/documents/documents';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { isObject } from '@grafana/faro-web-sdk';
import { ClockDashedIcon, CloudFillIcon, CloudSlashFillIcon } from '@navikt/aksel-icons';
import { Box, HStack, Tooltip, VStack } from '@navikt/ds-react';
import type { YjsProviderConfig } from '@platejs/yjs';
import { YjsPlugin } from '@platejs/yjs/react';
import { RangeApi, TextApi } from '@udecode/plate';
import { Plate, usePlateEditor, usePluginOption } from '@udecode/plate-core/react';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { type BasePoint, Path, Range } from 'slate';

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
  const { id, templateId } = smartDocument;
  const { newCommentSelection } = useContext(SmartEditorContext);
  const { user } = useContext(StaticDataContext);
  const canEdit = useCanEditDocument(templateId);
  const provider = getHocusPocusProvider(oppgave.id, id, smartDocument);
  const plugins = collaborationSaksbehandlerPlugins([provider], user.navIdent);

  const editor = usePlateEditor<KabalValue, (typeof plugins)[0]>({
    id,
    plugins,
    override: {
      components,
    },
    value: smartDocument.content,
    skipInitialization: true,
  });

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
        <PlateContext smartDocument={smartDocument} oppgave={oppgave} provider={provider} />
      </Plate>
    </VStack>
  );
};

interface PlateContextProps {
  smartDocument: ISmartDocument;
  oppgave: IOppgavebehandling;
  provider: YjsProviderConfig;
}

// Copy-paste from Plate docs
const useMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
};

const PlateContext = ({ smartDocument, oppgave, provider }: PlateContextProps) => {
  const { id, templateId } = smartDocument;
  const [getDocument, { isLoading }] = useLazyGetDocumentQuery();
  const { showAnnotationsAtOrigin, showHistory } = useContext(SmartEditorContext);
  const [isConnected, setIsConnected] = useState(usePluginOption(YjsPlugin, '_isConnected'));

  const mounted = useMounted();
  const isInitialized = useRef(false);
  const editor = useMyPlateEditorRef();

  const { yjs } = editor.getApi(YjsPlugin);

  useLayoutEffect(() => {
    if (!mounted) {
      return;
    }

    console.log('Initializing Yjs');

    yjs.init();
    isInitialized.current = true;

    return yjs.destroy;
  }, [mounted, yjs]);

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
          console.log(`Reconnecting to Yjs provider ${provider.options.id}...`);

          yjs.init();
        }
      } catch (err) {
        console.error(err);
      }
    };

    provider.options.onClose = onClose;

    return () => {
      provider.options.onClose = undefined;
    };
  }, [provider, yjs]);

  useEffect(() => {
    // Disconnect happens before close. Too early to reconnect.
    const onDisconnect = () => {
      console.log(`Yjs disconnected from ${provider.options.id}`);

      return setIsConnected(false);
    };

    // Connect happens after connection is established.
    const onConnect = () => {
      console.log(`Yjs connected to ${provider.options.id}`);

      return setIsConnected(true);
    };

    provider.options.onDisconnect = onDisconnect;
    provider.options.onConnect = onConnect;

    return () => {
      provider.options.onDisconnect = undefined;
      provider.options.onConnect = undefined;
    };
  }, [provider]);

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
  const { sheetRef, canEdit } = useContext(SmartEditorContext);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const lang = useSmartEditorSpellCheckLanguage();

  useEffect(() => {
    sheetRef.current = containerElement;
  }, [containerElement, sheetRef]);

  return (
    <Sheet ref={setContainerElement} $minHeight data-component="sheet" className="mr-4">
      <FloatingSaksbehandlerToolbar container={containerElement} editorId={id} />
      <SaksbehandlerTableToolbar container={containerElement} editorId={id} />
      <KabalPlateEditor id={id} readOnly={!(canEdit && isConnected)} lang={lang} />
    </Sheet>
  );
};
