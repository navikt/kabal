import { DragAndDropContext } from '@app/components/documents/drag-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useSetParentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { Role } from '@app/types/bruker';
import { DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { HStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

export const DropZone = ({ children }: Props) => {
  const oppgaveId = useOppgaveId();
  const [setParent] = useSetParentMutation();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragEnterCount = useRef(0);
  const { draggedDocument, clearDragState } = useContext(DragAndDropContext);
  const isSaksbehandler = useIsSaksbehandler();
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);

  const isDragTarget = useMemo(
    () => (isSaksbehandler || hasOppgavestyringRole) && isDroppable(draggedDocument),
    [isSaksbehandler, hasOppgavestyringRole, draggedDocument],
  );

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      dragEnterCount.current += 1;

      setIsDragOver(isDragTarget);
    },
    [isDragTarget],
  );

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dragEnterCount.current -= 1;

    if (dragEnterCount.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      dragEnterCount.current = 0;

      setIsDragOver(false);

      if (isDragTarget && oppgaveId !== skipToken && isDroppable(draggedDocument)) {
        setParent({
          dokumentId: draggedDocument.id,
          oppgaveId,
          parentId: null,
        });
      }

      clearDragState();
    },
    [clearDragState, draggedDocument, isDragTarget, oppgaveId, setParent],
  );

  return (
    <HStack
      align="center"
      gap="2"
      width="fit-content"
      flexShrink="0"
      flexGrow="1"
      paddingInline="2 0"
      position="relative"
      data-content="Hoveddokument"
      className={`whitespace-nowrap ${isDragTarget ? 'after:flex' : 'after:hidden'} after:items-center after:justify-center after:rounded-medium after:text-stroke after:outline-dashed after:outline-2 after:outline-border-action after:content-[attr(data-content)] ${isDragOver ? 'after:bg-drop-background-hover' : 'after:bg-drop-background'} after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-medium after:font-bold after:backdrop-blur-[2px]`}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      {children}
    </HStack>
  );
};

const isDroppable = (draggedDocument: IMainDocument | null): draggedDocument is IMainDocument =>
  draggedDocument !== null &&
  draggedDocument.parentId !== null &&
  draggedDocument.type !== DocumentTypeEnum.JOURNALFOERT &&
  draggedDocument.templateId !== TemplateIdEnum.ROL_ANSWERS;
