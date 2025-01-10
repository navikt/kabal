import { ErrorComponent } from '@app/components/smart-editor-texts/error-component';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useCanManageDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { useSmartEditorSpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { pushEvent } from '@app/observability';
import { KabalPlateEditor } from '@app/plate/plate-editor';
import { components, saksbehandlerPlugins } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@app/plate/sheet';
import { type KabalValue, type RichTextEditor, useMyPlateEditorRef } from '@app/plate/types';
import type { ISmartDocument } from '@app/types/documents/documents';
import { Button } from '@navikt/ds-react';
import {
  type Value,
  insertNodes,
  removeNodes,
  resetEditorChildren,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import { Plate, usePlateEditor } from '@udecode/plate-core/react';
import { memo, useContext, useEffect } from 'react';
import { styled } from 'styled-components';

interface Props {
  versionId: number;
  version: KabalValue;
  smartDocument: ISmartDocument;
}

export const HistoryEditor = memo(
  ({ smartDocument, version, versionId }: Props) => {
    const mainEditor = useMyPlateEditorRef(smartDocument.id);
    const { templateId } = useContext(SmartEditorContext);
    const canManage = useCanManageDocument(templateId, smartDocument.creator.employee.navIdent);

    const id = `${smartDocument.id}-${versionId}`;

    const editor = usePlateEditor<KabalValue, (typeof saksbehandlerPlugins)[0]>({
      id,
      plugins: saksbehandlerPlugins,
      override: {
        components: components,
      },
    });

    return (
      <HistoryEditorContainer>
        <StyledButton
          variant="primary"
          onClick={() => {
            pushEvent('restore-smart-editor-version', 'smart-editor', {
              versionId: versionId.toString(),
              documentId: smartDocument.id,
            });
            restore(mainEditor, version);
          }}
          size="small"
          disabled={!canManage}
        >
          Gjenopprett denne versjonen
        </StyledButton>
        <StyledErrorBoundary errorComponent={() => <ErrorComponent textId={id} />}>
          <Plate<RichTextEditor> editor={editor}>
            <HistoryContent id={id} version={version} />
          </Plate>
        </StyledErrorBoundary>
      </HistoryEditorContainer>
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
    <Sheet $minHeight>
      <KabalPlateEditor id={id} readOnly lang={lang} />
    </Sheet>
  );
};

const restore = (editor: RichTextEditor, content: Value) => {
  withoutNormalizing(editor, () => {
    withoutSavingHistory(editor, () => {
      resetEditorChildren(editor);
      insertNodes(editor, content, { at: [0] });

      // Remove empty paragraph that is added automatically
      removeNodes(editor, { at: [content.length] });
    });
  });
};

const HistoryEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  overflow-x: visible;
  padding-top: var(--a-spacing-4);
  padding-right: var(--a-spacing-4);
  padding-left: var(--a-spacing-4);
  height: max-content;
  min-width: 210mm;

  &::after {
    content: '';
    padding-bottom: calc(20mm * var(${EDITOR_SCALE_CSS_VAR}) + 100px);
  }
`;

const StyledButton = styled(Button)`
  position: sticky;
  margin-bottom: var(--a-spacing-5);
  top: 0;
  width: 210mm;
  z-index: 1;
`;

const StyledErrorBoundary = styled(ErrorBoundary)`
  width: 210mm;
`;
