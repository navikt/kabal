import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useDeleteFileMutation } from '../../../redux-api/oppgave';
import { StyledDeleteButton } from './styled-components';

interface DeleteDocumentButtonProps {
  klagebehandlingId: string;
}

export const DeleteDocumentButton = ({ klagebehandlingId }: DeleteDocumentButtonProps) => {
  const canEdit = useCanEdit();
  const [deleteFile, { isLoading }] = useDeleteFileMutation();

  if (!canEdit) {
    return null;
  }

  return (
    <StyledDeleteButton disabled={isLoading} onClick={() => deleteFile({ klagebehandlingId })}>
      Slett
    </StyledDeleteButton>
  );
};
