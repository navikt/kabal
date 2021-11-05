import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useDeleteSmartEditorMutation } from '../../../redux-api/smart-editor';
import { useDeleteSmartEditorIdMutation } from '../../../redux-api/smart-editor-id';
import { StyledDeleteButton } from './styled-components';

interface Props {
  klagebehandlingId: string;
  smartEditorId: string;
}

export const DeleteSmartEditorDocumentButton = ({ klagebehandlingId, smartEditorId }: Props) => {
  const canEdit = useCanEdit(klagebehandlingId);
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
        deleteSmartEditorReference(klagebehandlingId);
      }}
    >
      Slett
    </StyledDeleteButton>
  );
};
