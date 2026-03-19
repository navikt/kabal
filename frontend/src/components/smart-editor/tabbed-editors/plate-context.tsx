import { ClockDashedIcon, CloudFillIcon, CloudSlashFillIcon, DocPencilIcon, FileTextIcon } from '@navikt/aksel-icons';
import { Box, HStack, Loader, Tooltip, VStack } from '@navikt/ds-react';
import { TextApi, type TText } from 'platejs';
import { type PlateEditor, useEditorReadOnly, useEditorRef } from 'platejs/react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { BasePoint } from 'slate';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { GodeFormuleringer } from '@/components/smart-editor/gode-formuleringer/gode-formuleringer';
import { History } from '@/components/smart-editor/history/history';
import { Content } from '@/components/smart-editor/tabbed-editors/content';
import {
  DynamicContentLoadingProvider,
  useDynamicContentLoadingCount,
} from '@/components/smart-editor/tabbed-editors/dynamic-content-loading-context';
import { useSetEditorPanelFocus } from '@/components/smart-editor/tabbed-editors/editor-panel-focus-context';
import { EditorWithNewCommentAndFloatingToolbar } from '@/components/smart-editor/tabbed-editors/editor-with-toolbar';
import { PositionedRight } from '@/components/smart-editor/tabbed-editors/positioned-right';
import { StickyRight } from '@/components/smart-editor/tabbed-editors/sticky-right';
import { VersionStatus } from '@/components/smart-editor/tabbed-editors/version-status';
import { DocumentErrorComponent } from '@/error-boundary/document-error';
import { ErrorBoundary } from '@/error-boundary/error-boundary';
import { useSmartEditorActiveDocument } from '@/hooks/settings/use-setting';
import { isEditableTextNode } from '@/plate/functions/is-editable-text';
import { StatusBar } from '@/plate/status-bar/status-bar';
import { SaksbehandlerToolbar } from '@/plate/toolbar/toolbars/saksbehandler-toolbar';
import { useLazyGetDocumentQuery } from '@/redux-api/oppgaver/queries/documents';
import type { ISmartDocumentOrAttachment } from '@/types/documents/documents';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

interface PlateContextProps {
  smartDocument: ISmartDocumentOrAttachment;
  oppgave: IOppgavebehandling;
  isConnected: boolean;
  isSynced: boolean;
}

export const PlateContextWrapper = (props: PlateContextProps) => (
  <DynamicContentLoadingProvider>
    <PlateContext {...props} />
  </DynamicContentLoadingProvider>
);

const PlateContext = ({ smartDocument, oppgave, isConnected, isSynced }: PlateContextProps) => {
  const { id, templateId } = smartDocument;
  const [getDocument, { isLoading }] = useLazyGetDocumentQuery();
  const { showAnnotationsAtOrigin, showHistory } = useContext(SmartEditorContext);
  const readOnly = useEditorReadOnly();
  const editor = useEditorRef();
  const { value: activeEditorId } = useSmartEditorActiveDocument();
  const isActive = id === activeEditorId;
  const dynamicContentLoadingCount = useDynamicContentLoadingCount();
  const isDynamicContentLoading = useIsDynamicContentLoading(isSynced, dynamicContentLoadingCount);
  const isReady = isSynced && !isDynamicContentLoading;

  const focusEditor = useCallback(() => {
    const at = editor.selection ?? getFirstEditableTextStart(editor);

    console.debug('Focusing editor with selection', { selection: editor.selection, at });

    try {
      if (at !== undefined) {
        editor.tf.focus({ at, retries: 3 });
      } else {
        editor.tf.focus({ retries: 3 });
      }
    } catch {
      // Failed to set focus at the correct position after retries.
      console.debug('Failed to focus editor.', {
        selection: editor.selection,
        firstEditableText: getFirstEditableTextStart(editor),
      });
    }
  }, [editor]);

  useSetEditorPanelFocus(isActive && isReady ? focusEditor : null);

  return (
    <>
      <HStack wrap={false} maxHeight="100%" flexShrink="1" overflowY="scroll" className="scroll-pt-16">
        <GodeFormuleringer templateId={templateId} />

        <Content>
          <VStack minWidth="210mm" className="[grid-area:content]" data-area="content" position="relative">
            <SaksbehandlerToolbar />

            {isReady ? null : <DynamicContentLoadingOverlay />}

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
        <HStack asChild wrap={false} flexShrink="0" align="center" justify="center" paddingInline="space-8">
          <Box as="span" borderWidth="0 1 0 0" borderColor="neutral" marginInline="auto space-0">
            <Tooltip content={readOnly ? 'Lesemodus' : 'Skrivemodus'}>
              {readOnly ? (
                <FileTextIcon aria-hidden role="presentation" fontSize={24} color="var(--ax-text-neutral)" />
              ) : (
                <DocPencilIcon aria-hidden role="presentation" fontSize={24} color="var(--ax-text-neutral)" />
              )}
            </Tooltip>
          </Box>
        </HStack>

        <HStack asChild wrap={false} flexShrink="0" align="center" justify="center" paddingInline="space-8">
          <Box as="span" borderWidth="0 1 0 0" borderColor="neutral" marginInline="space-0 space-8">
            <Tooltip content={isConnected ? 'Tilkoblet' : 'Frakoblet'}>
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
            </Tooltip>
          </Box>
        </HStack>

        <VersionStatus oppgaveId={oppgave.id} dokumentId={id} />
      </StatusBar>
    </>
  );
};

const DynamicContentLoadingOverlay = () => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-ax-bg-default">
    <VStack align="center" gap="space-4">
      <Loader size="xlarge" title="Laster innhold..." />
    </VStack>
  </div>
);

/** Grace period after sync to allow dynamic component effects to register their loading state. */
const GRACE_PERIOD_MS = 100;

/**
 * Returns `true` while dynamic content is loading during the initial document load.
 *
 * The hook starts returning `true` when `isSynced` becomes true (dynamic components are mounting).
 * It waits for a grace period to let component effects register, then waits for
 * `loadingCount` to reach 0. Once it returns `false`, it stays `false` permanently (settled).
 */
const useIsDynamicContentLoading = (isSynced: boolean, loadingCount: number): boolean => {
  const [settled, setSettled] = useState(false);
  const settledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (settledRef.current || !isSynced) {
      return;
    }

    if (loadingCount > 0) {
      // Components are still loading - cancel any pending settle timer.
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      return;
    }

    // loadingCount is 0 - start grace/settle timer.
    // This gives late-mounting component effects time to call registerLoading().
    timerRef.current = setTimeout(() => {
      settledRef.current = true;
      setSettled(true);
      timerRef.current = null;
    }, GRACE_PERIOD_MS);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isSynced, loadingCount]);

  // Cleanup on unmount.
  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  // Loading until settled, but only after sync has started.
  return isSynced && !settled;
};

const getFirstEditableTextStart = (editor: PlateEditor): BasePoint | undefined => {
  const first = editor.api.next<TText>({
    at: [0],
    mode: 'lowest',
    text: true,
    match: (n, p) => TextApi.isText(n) && isEditableTextNode(editor, p),
  });

  if (first === undefined) {
    return undefined;
  }

  return editor.api.start(first[1]);
};
