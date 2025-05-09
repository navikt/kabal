import { DragAndDropContext } from '@app/components/documents/drag-context';
import { DeleteDropArea } from '@app/components/documents/new-documents/header/delete-drop-area';
import { DropZone } from '@app/components/documents/new-documents/shared/drop-zone';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetParentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { Role } from '@app/types/bruker';
import { DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { ArrowUpIcon, ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { HStack, Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext } from 'react';

interface Props {
  headingId: string;
}

export const NewDocumentsHeader = ({ headingId }: Props) => {
  const errorMessage = useValidationError('underArbeid');
  const [isExpanded] = useIsExpanded();
  const oppgaveId = useOppgaveId();
  const [setParent] = useSetParentMutation();
  const { draggedDocument, clearDragState } = useContext(DragAndDropContext);
  const isSaksbehandler = useIsSaksbehandler();
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const isDropTarget = (isSaksbehandler || hasOppgavestyringRole) && isDroppable(draggedDocument);

  const onDrop = useCallback(() => {
    if (isDropTarget && oppgaveId !== skipToken) {
      setParent({
        dokumentId: draggedDocument.id,
        oppgaveId,
        parentId: null,
      });
    }

    clearDragState();
  }, [clearDragState, draggedDocument, isDropTarget, oppgaveId, setParent]);

  return (
    <HStack
      as="header"
      justify="space-between"
      align="center"
      gap="2"
      paddingBlock="0 2"
      flexGrow="1"
      wrap={false}
      className="border-border-divider border-b"
    >
      <DropZone
        onDrop={onDrop}
        icon={<ArrowUpIcon aria-hidden />}
        label="Hoveddokument"
        active={isDropTarget}
        className="grow"
      >
        <Heading size="xsmall" level="2" id={headingId}>
          Dokumenter under arbeid
        </Heading>
        {typeof errorMessage === 'string' ? (
          <ExclamationmarkTriangleIcon title={errorMessage} className="text-text-danger" />
        ) : null}
      </DropZone>
      {isExpanded ? <DeleteDropArea /> : null}
    </HStack>
  );
};

const isDroppable = (draggedDocument: IMainDocument | null): draggedDocument is IMainDocument =>
  draggedDocument !== null &&
  draggedDocument.parentId !== null &&
  draggedDocument.type !== DocumentTypeEnum.JOURNALFOERT &&
  draggedDocument.templateId !== TemplateIdEnum.ROL_ANSWERS;
