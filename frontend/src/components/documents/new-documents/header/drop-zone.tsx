import { DragAndDropContext } from '@app/components/documents/drag-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useSetParentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { Role } from '@app/types/bruker';
import { DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';

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
    <StyledDropZone
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      $isDropTarget={isDragTarget}
      $isDragOver={isDragOver}
    >
      {children}
    </StyledDropZone>
  );
};

const isDroppable = (draggedDocument: IMainDocument | null): draggedDocument is IMainDocument =>
  draggedDocument !== null &&
  draggedDocument.parentId !== null &&
  draggedDocument.type !== DocumentTypeEnum.JOURNALFOERT &&
  draggedDocument.templateId !== TemplateIdEnum.ROL_ANSWERS;

interface IDragOver {
  $isDropTarget: boolean;
  $isDragOver: boolean;
}

const StyledDropZone = styled.div<IDragOver>`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-2);
  width: fit-content;
  white-space: nowrap;
  flex-shrink: 0;
  flex-grow: 1;
  padding-left: var(--a-spacing-2);
  position: relative;

  &::after {
    display: ${({ $isDropTarget }) => ($isDropTarget ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    content: 'Hoveddokument';
    border-radius: var(--a-border-radius-medium);
    outline: var(--a-spacing-05) dashed var(--a-border-action);
    font-size: 18px;
    font-weight: bold;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ $isDragOver }) => ($isDragOver ? 'rgba(153, 195, 255, 0.5)' : 'rgba(230, 240, 255, 0.5)')};
    text-shadow:
      1px 1px white,
      -1px -1px var(--a-bg-default);
    backdrop-filter: blur(var(--a-spacing-05));
  }
`;
