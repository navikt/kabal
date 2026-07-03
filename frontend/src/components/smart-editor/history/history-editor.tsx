import { Button, VStack } from '@navikt/ds-react';
import type { Value } from 'platejs';
import { Plate, useEditorReadOnly, usePlateEditor } from 'platejs/react';
import { memo, useEffect } from 'react';
import { entryKey } from '@/components/smart-editor/history/entry-key';
import { type HistoryEntry, HistorySource } from '@/components/smart-editor/history/types';
import { ErrorComponent } from '@/components/smart-editor-texts/error-component';
import { ErrorBoundary } from '@/error-boundary/error-boundary';
import { areDescendantsEqual } from '@/functions/are-descendants-equal';
import { useSmartEditorSpellCheckLanguage } from '@/hooks/use-smart-editor-language';
import { pushEvent } from '@/observability';
import { NavLogo } from '@/plate/nav-logo';
import { KabalPlateEditor } from '@/plate/plate-editor';
import { components, historyPlugins } from '@/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@/plate/sheet';
import { type KabalValue, type RichTextEditor, useMyPlateEditorRef } from '@/plate/types';
import type { ISmartDocumentOrAttachment } from '@/types/documents/documents';

interface Props {
  entry: HistoryEntry;
  version: KabalValue;
  smartDocument: ISmartDocumentOrAttachment;
}

export const HistoryEditor = memo(
  ({ smartDocument, version, entry }: Props) => {
    const mainEditor = useMyPlateEditorRef(smartDocument.id);
    const readOnly = useEditorReadOnly(smartDocument.id);

    const id = `${smartDocument.id}-${entryKey(entry)}`;

    const editor = usePlateEditor<KabalValue, (typeof historyPlugins)[0]>({
      id,
      plugins: historyPlugins,
      override: {
        components: components,
      },
    });

    return (
      <VStack
        position="relative"
        overflowY="auto"
        overflowX="visible"
        height="max-content"
        minWidth="210mm"
        paddingInline="space-16"
        paddingBlock="space-16 space-0"
        className="after:pb-[calc(20mm*var(--kabal-editor-scale)+100px)]" // Cannot use EDITOR_SCALE_CSS_VAR with Tailwind.
      >
        <Button
          variant="primary"
          onClick={() => {
            switch (entry.source) {
              case HistorySource.API: {
                pushEvent('restore-smart-editor-api-version', 'smart-editor', {
                  version: entry.version.toString(),
                  timestamp: entry.timestamp,
                  documentId: smartDocument.id,
                });
                break;
              }

              case HistorySource.LOCAL: {
                pushEvent('restore-smart-editor-local-version', 'smart-editor', {
                  timestamp: entry.timestamp,
                  documentId: smartDocument.id,
                });
                break;
              }
            }

            restore(mainEditor, version);
          }}
          size="small"
          disabled={readOnly}
          className="sticky top-0 z-1 mb-5 w-[210mm]"
        >
          Gjenopprett denne versjonen
        </Button>
        <ErrorBoundary errorComponent={() => <ErrorComponent textId={id} />} className="w-[210mm]">
          <Plate<RichTextEditor> editor={editor} readOnly>
            <HistoryContent id={id} version={version} />
          </Plate>
        </ErrorBoundary>
      </VStack>
    );
  },
  (prevProps, nextProps) =>
    prevProps.smartDocument.id === nextProps.smartDocument.id &&
    prevProps.entry.timestamp === nextProps.entry.timestamp &&
    entryKey(prevProps.entry) === entryKey(nextProps.entry) &&
    areDescendantsEqual(prevProps.version, nextProps.version),
);

HistoryEditor.displayName = 'HistoryEditor';

interface HistoryContentProps {
  id: string;
  version: Value;
}

const HistoryContent = ({ id, version }: HistoryContentProps) => {
  const editor = useMyPlateEditorRef(id);
  const lang = useSmartEditorSpellCheckLanguage();

  useEffect(() => restore(editor, version), [editor, version]);

  return (
    <Sheet minHeight>
      <NavLogo />

      <KabalPlateEditor id={id} lang={lang} />
    </Sheet>
  );
};

const restore = (editor: RichTextEditor, content: Value) => {
  editor.tf.withoutNormalizing(() => {
    editor.tf.withoutSaving(() => {
      editor.tf.reset({ children: true });
      editor.tf.insertNodes(content, { at: [0] });

      // Remove empty paragraph that is added automatically
      editor.tf.removeNodes({ at: [content.length] });
    });
  });
};
