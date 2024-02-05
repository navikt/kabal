import { Button } from '@navikt/ds-react';
import { Plate, insertNodes, removeNodes, withoutNormalizing, withoutSavingHistory } from '@udecode/plate-common';
import React, { memo, useEffect, useMemo } from 'react';
import { styled } from 'styled-components';
import { getIsRolAnswers, getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { pushEvent } from '@app/observability';
import { PlateEditor } from '@app/plate/plate-editor';
import { saksbehandlerPlugins } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { Sheet } from '@app/plate/sheet';
import { EditorValue, RichTextEditor, useMyPlateEditorRef } from '@app/plate/types';
import { ISmartDocument } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';

interface Props {
  versionId: number;
  version: EditorValue;
  smartDocument: ISmartDocument;
}

export const HistoryEditor = memo(
  ({ smartDocument, version, versionId }: Props) => {
    const mainEditor = useMyPlateEditorRef(smartDocument.id);
    const { data: oppgave } = useOppgave();
    const isSaksbehandler = useIsSaksbehandler();
    const isRol = useIsRol();

    const rolCanRestore =
      isRol &&
      oppgave !== undefined &&
      (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
      oppgave.rol.flowState !== FlowState.SENT &&
      getIsRolAnswers(smartDocument);

    const saksbehandlerCanRestore = useMemo(() => {
      if (!isSaksbehandler || oppgave === undefined) {
        return false;
      }

      if (oppgave.medunderskriver.flowState === FlowState.SENT) {
        return false;
      }

      if (getIsRolAnswers(smartDocument)) {
        return false;
      }

      if (getIsRolQuestions(smartDocument)) {
        if (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) {
          if (oppgave.rol.flowState === FlowState.SENT) {
            return false;
          }
        }
      }

      return true;
    }, [isSaksbehandler, oppgave, smartDocument]);

    const disableRestore = !saksbehandlerCanRestore && !rolCanRestore;

    const id = `${smartDocument.id}-${versionId}`;

    return (
      <HistoryEditorContainer>
        <StyledButton
          variant="primary"
          onClick={() => {
            pushEvent(
              'restore-smart-editor-version',
              { versionId: versionId.toString(), documentId: smartDocument.id },
              'smart-editor',
            );
            restore(mainEditor, version);
          }}
          size="small"
          disabled={disableRestore}
        >
          Gjenopprett denne versjonen
        </StyledButton>
        <Plate<EditorValue, RichTextEditor> id={id} readOnly plugins={saksbehandlerPlugins} initialValue={version}>
          <HistoryContent id={id} version={version} />
        </Plate>
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
  const edior = useMyPlateEditorRef(id);

  useEffect(() => restore(edior, version), [edior, version]);

  return (
    <Sheet $minHeight>
      <PlateEditor id={id} readOnly />
    </Sheet>
  );
};

const restore = (editor: RichTextEditor, content: EditorValue) => {
  withoutNormalizing(editor, () => {
    withoutSavingHistory(editor, () => {
      for (let i = editor.children.length - 1; i >= 0; i--) {
        removeNodes(editor, { at: [i] });
      }

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
  padding-top: 16px;
  padding-right: 16px;

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
