import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useOppgaveType } from '../../../hooks/use-oppgave-type';
import { useDeleteFileMutation } from '../../../redux-api/oppgavebehandling';
import { StyledDeleteButton } from './styled-components';

interface DeleteDocumentButtonProps {
  oppgaveId: string;
}

export const DeleteDocumentButton = ({ oppgaveId }: DeleteDocumentButtonProps) => {
  const canEdit = useCanEdit();
  const type = useOppgaveType();
  const [deleteFile, { isLoading }] = useDeleteFileMutation();

  if (!canEdit) {
    return null;
  }

  return (
    <StyledDeleteButton disabled={isLoading} onClick={() => deleteFile({ oppgaveId, type })}>
      Slett
    </StyledDeleteButton>
  );
};
