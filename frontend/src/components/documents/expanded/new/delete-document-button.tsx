import { Cancel, Delete } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useDeleteDocumentMutation, useGetDocumentsQuery } from '../../../../redux-api/documents';
import { IMainDocument } from '../../../../types/documents';

interface Props {
  document: IMainDocument;
}

export const DeleteDocumentButton = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const canEdit = useCanEdit();
  const { data, isLoading: documentsIsLoading } = useGetDocumentsQuery({ oppgaveId });
  const [deleteDocument, { isLoading }] = useDeleteDocumentMutation();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!canEdit || documentsIsLoading || typeof data === 'undefined') {
    return null;
  }

  const hasAttachments = data.some(({ parent }) => parent === document.id);

  if (hasAttachments) {
    return null;
  }

  if (showConfirm) {
    return (
      <>
        <StyledButton
          size="small"
          variant="secondary"
          onClick={() => setShowConfirm(false)}
          data-testid="document-delete-cancel"
        >
          <Cancel />
          Avbryt
        </StyledButton>
        <StyledButton
          variant="danger"
          size="small"
          disabled={isLoading}
          onClick={() => deleteDocument({ dokumentId: document.id, oppgaveId })}
          data-testid="document-delete-confirm"
        >
          <Delete />
          Slett
        </StyledButton>
      </>
    );
  }

  return (
    <StyledButton
      variant="danger"
      size="small"
      onClick={() => setShowConfirm(true)}
      data-testid="document-delete-button"
    >
      <Delete />
      Slett
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  display: flex;
  gap: 8px;
  width: 100%;
`;
