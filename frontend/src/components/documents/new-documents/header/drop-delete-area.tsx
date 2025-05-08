import { DragAndDropContext } from '@app/components/documents/drag-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import { useAttachments, useParentDocument } from '@app/hooks/use-parent-document';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useDeleteDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { CreatorRole, DocumentTypeEnum } from '@app/types/documents/documents';
import { TrashIcon } from '@navikt/aksel-icons';
import { Box, HStack, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext, useRef, useState } from 'react';

export const DeleteDropArea = () => {
  const dragEnterCount = useRef(0);
  const [isDropOver, setIsDropOver] = useState(false);
  const [deleteDocument, { isLoading }] = useDeleteDocumentMutation();
  const oppgaveId = useOppgaveId();
  const { draggedDocument, clearDragState } = useContext(DragAndDropContext);
  const removeSmartDocument = useRemoveDocument();

  const parentDocument = useParentDocument(draggedDocument?.parentId ?? null);
  const { pdfOrSmartDocuments, journalfoerteDocuments } = useAttachments(
    draggedDocument?.parentId ?? draggedDocument?.id,
  );
  const containsRolAttachments =
    pdfOrSmartDocuments.some((d) => d.creator.creatorRole === CreatorRole.KABAL_ROL) ||
    journalfoerteDocuments.some((d) => d.creator.creatorRole === CreatorRole.KABAL_ROL);
  const canEdit = useCanEditDocument(draggedDocument, parentDocument);
  const isAttachment = parentDocument !== undefined;
  const isDropTarget = canEdit && (isAttachment || !containsRolAttachments);

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragEnterCount.current += 1;

      setIsDropOver(isDropTarget);
    },
    [isDropTarget],
  );

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragEnterCount.current -= 1;

    if (dragEnterCount.current === 0) {
      setIsDropOver(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      dragEnterCount.current = 0;
      setIsDropOver(false);

      if (isDropTarget && oppgaveId !== skipToken && draggedDocument !== null) {
        if (draggedDocument.type === DocumentTypeEnum.SMART) {
          removeSmartDocument(draggedDocument.id, draggedDocument);
        }
        deleteDocument({ oppgaveId, dokumentId: draggedDocument.id });
      }

      clearDragState();
    },
    [clearDragState, deleteDocument, draggedDocument, isDropTarget, oppgaveId, removeSmartDocument],
  );

  const textClasses = isDropOver ? 'text-text-on-danger' : 'text-text-default';
  const opacityClasses = isDropTarget ? 'opacity-100' : 'opacity-0';

  return (
    <Box
      asChild
      background={isDropOver ? 'surface-danger' : 'surface-danger-subtle'}
      borderRadius="medium"
      className={`${textClasses} ${opacityClasses} white-space-nowrap font-bold text-large outline-dashed outline-2 outline-surface-danger transition-[opacity,background-color] duration-200 ease-in-out`}
    >
      <HStack
        align="center"
        justify="center"
        gap="0 2"
        flexGrow="0"
        flexShrink="0"
        paddingInline="12"
        marginInline="0 2"
        height="100%"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={onDrop}
      >
        <TrashIcon aria-hidden />
        <span>Slett</span>
        {isLoading ? <Loader /> : null}
      </HStack>
    </Box>
  );
};
