import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useDeleteFileMutation } from '../../../redux-api/oppgavebehandling';
import { StyledDeleteButton } from './styled-components';

interface DeleteDocumentButtonProps {
  oppgaveId: string;
}

export const DeleteDocumentButton = ({ oppgaveId }: DeleteDocumentButtonProps) => {
  const canEdit = useCanEdit();
  const [deleteFile, { isLoading }] = useDeleteFileMutation();

  if (!canEdit) {
    return null;
  }

  return (
    <StyledDeleteButton disabled={isLoading} onClick={() => deleteFile(oppgaveId)}>
      Slett
    </StyledDeleteButton>
  );
};
