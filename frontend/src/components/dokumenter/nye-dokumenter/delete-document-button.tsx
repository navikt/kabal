import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useDeleteFileMutation } from '../../../redux-api/oppgave';

interface DeleteDocumentButtonProps {
  klagebehandlingId: string;
  className?: string;
}

export const DeleteDocumentButton = ({ klagebehandlingId, className }: DeleteDocumentButtonProps) => {
  const canEdit = useCanEdit(klagebehandlingId);
  const [deleteFile, { isLoading }] = useDeleteFileMutation();

  if (!canEdit) {
    return null;
  }

  return (
    <button className={className} disabled={isLoading} onClick={() => deleteFile({ klagebehandlingId })}>
      Slett
    </button>
  );
};
