import { Button } from '@navikt/ds-react';
import {
  Plate,
  insertNodes,
  removeNodes,
  resetEditorChildren,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import { memo, useContext, useEffect } from 'react';
import { styled } from 'styled-components';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useCanManageDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { ErrorComponent } from '@app/components/smart-editor-texts/error-component';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { useSmartEditorSpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { pushEvent } from '@app/observability';
import { PlateEditor } from '@app/plate/plate-editor';
import { saksbehandlerPlugins } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@app/plate/sheet';
import { EditorValue, RichTextEditor, useMyPlateEditorRef } from '@app/plate/types';
import { ISmartDocument } from '@app/types/documents/documents';

interface Props {
  versionId: number;
  version: EditorValue;
  smartDocument: ISmartDocument;
}

export const HistoryEditor = memo(
  ({ smartDocument, version, versionId }: Props) => {
    const mainEditor = useMyPlateEditorRef(smartDocument.id);
    const { templateId } = useContext(SmartEditorContext);
    const canManage = useCanManageDocument(templateId);

    const id = `${smartDocument.id}-${versionId}`;

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
          <Plate<EditorValue, RichTextEditor> id={id} readOnly plugins={saksbehandlerPlugins} initialValue={version}>
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
  version: EditorValue;
}

const HistoryContent = ({ id, version }: HistoryContentProps) => {
  const editor = useMyPlateEditorRef(id);
  const lang = useSmartEditorSpellCheckLanguage();

  useEffect(() => restore(editor, version), [editor, version]);

  return (
    <Sheet $minHeight>
      <PlateEditor id={id} readOnly lang={lang} />
    </Sheet>
  );
};

const restore = (editor: RichTextEditor, content: EditorValue) => {
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
  height: max-content;
  min-width: 210mm;

  &::after {
    content: '';
    padding-bottom: calc(20mm * var(${EDITOR_SCALE_CSS_VAR}) + 33px);
  }
`;

const StyledButton = styled(Button)`
  position: sticky;
  margin-bottom: 18px;
  top: 0;
  width: 210mm;
  z-index: 1;
`;

const StyledErrorBoundary = styled(ErrorBoundary)`
  width: 210mm;
`;
