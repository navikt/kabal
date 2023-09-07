import { Heading, HeadingProps } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useSetParentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';

interface Props {
  children: React.ReactNode;
}

export const DropHeading = ({ children }: Props) => {
  const oppgaveId = useOppgaveId();
  const [setParent] = useSetParentMutation();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragEnterCount = useRef(0);
  const { draggedDocument, clearDragState } = useContext(DragAndDropContext);
  const isSaksbehandler = useIsSaksbehandler();

  const isDragTarget = useMemo(
    () => isSaksbehandler && isDroppable(draggedDocument),
    [isSaksbehandler, draggedDocument],
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
    <StyledHeading
      size="xsmall"
      level="2"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      $isDropTarget={isDragTarget}
      $isDragOver={isDragOver}
    >
      {children}
    </StyledHeading>
  );
};

const isDroppable = (draggedDocument: IMainDocument | null): draggedDocument is IMainDocument =>
  draggedDocument !== null &&
  draggedDocument.parentId !== null &&
  draggedDocument.type !== DocumentTypeEnum.JOURNALFOERT;

interface IDragOver extends HeadingProps {
  $isDropTarget: boolean;
  $isDragOver: boolean;
}

const InternalHeading = ({ children, ...props }: IDragOver) => <Heading {...props}>{children}</Heading>;

const StyledHeading = styled(InternalHeading)<IDragOver>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  white-space: nowrap;
  flex-shrink: 0;
  flex-grow: 1;
  padding-left: 8px;
  position: relative;

  &::after {
    display: ${({ $isDropTarget }) => ($isDropTarget ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    content: 'Slipp her for å gjøre til hoveddokument';
    border-radius: var(--a-border-radius-medium);
    outline: 2px dashed var(--a-border-action);
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
      -1px -1px white;
    backdrop-filter: blur(2px);
  }
`;
