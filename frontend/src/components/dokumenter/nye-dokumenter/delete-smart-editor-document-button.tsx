import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useOppgaveType } from '../../../hooks/use-oppgave-type';
import { useDeleteSmartEditorMutation } from '../../../redux-api/smart-editor';
import { useDeleteSmartEditorIdMutation } from '../../../redux-api/smart-editor-id';
import { StyledDeleteButton } from './styled-components';

interface Props {
  oppgaveId: string;
  smartEditorId: string;
}

export const DeleteSmartEditorDocumentButton = ({ oppgaveId, smartEditorId }: Props) => {
  const canEdit = useCanEdit();
  const type = useOppgaveType();
  const [deleteSmartEditorReference, { isLoading }] = useDeleteSmartEditorIdMutation();
  const [deleteSmartEditorContent] = useDeleteSmartEditorMutation();

  if (!canEdit) {
    return null;
  }

  return (
    <StyledDeleteButton
      disabled={isLoading}
      onClick={() => {
        deleteSmartEditorContent(smartEditorId);
        deleteSmartEditorReference({ oppgaveId, type });
      }}
    >
      Slett
    </StyledDeleteButton>
  );
};
