import { ErrorComponent } from '@app/components/smart-editor-texts/error-component';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { useSmartEditorSpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { pushEvent } from '@app/observability';
import { KabalPlateEditor } from '@app/plate/plate-editor';
import { components, saksbehandlerPlugins } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@app/plate/sheet';
import { type KabalValue, type RichTextEditor, useMyPlateEditorRef } from '@app/plate/types';
import type { ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import { Button, VStack } from '@navikt/ds-react';
import { Plate, useEditorReadOnly, usePlateEditor } from '@platejs/core/react';
import type { Value } from 'platejs';
import { memo, useEffect } from 'react';

interface Props {
  versionId: number;
  version: KabalValue;
  smartDocument: ISmartDocumentOrAttachment;
}

export const HistoryEditor = memo(
  ({ smartDocument, version, versionId }: Props) => {
    const mainEditor = useMyPlateEditorRef(smartDocument.id);
    const readOnly = useEditorReadOnly(smartDocument.id);

    const id = `${smartDocument.id}-${versionId}`;

    const editor = usePlateEditor<KabalValue, (typeof saksbehandlerPlugins)[0]>({
      id,
      plugins: saksbehandlerPlugins,
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
        paddingBlock="space-16 0"
        className="after:pb-[calc(20mm*var(--kabal-editor-scale)+100px)]"
      >
        <Button
          variant="primary"
          onClick={() => {
            pushEvent('restore-smart-editor-version', 'smart-editor', {
              versionId: versionId.toString(),
              documentId: smartDocument.id,
            });
            restore(mainEditor, version);
          }}
          size="small"
          disabled={readOnly}
          className="sticky top-0 z-1 mb-5 w-[210mm]"
        >
          Gjenopprett denne versjonen
        </Button>
        <ErrorBoundary errorComponent={() => <ErrorComponent textId={id} />} className="w-[210mm]">
          <Plate<RichTextEditor> editor={editor}>
            <HistoryContent id={id} version={version} />
          </Plate>
        </ErrorBoundary>
      </VStack>
    );
  },
  (prevProps, nextProps) =>
    prevProps.versionId === nextProps.versionId &&
    prevProps.smartDocument.id === nextProps.smartDocument.id &&
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
      <KabalPlateEditor id={id} readOnly lang={lang} />
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
