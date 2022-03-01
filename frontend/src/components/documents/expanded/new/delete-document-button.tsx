import { Cancel, Delete } from '@navikt/ds-icons';
import { Knapp } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useDeleteDocumentMutation } from '../../../../redux-api/documents';
import { IMainDocument } from '../../../../types/documents';

interface Props {
  document: IMainDocument;
}

export const DeleteDocumentButton = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const canEdit = useCanEdit();
  const [deleteDocument, { isLoading }] = useDeleteDocumentMutation();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!canEdit) {
    return null;
  }

  if (showConfirm) {
    return (
      <>
        <StyledButton
          type="standard"
          kompakt
          onClick={() => setShowConfirm(false)}
          data-testid="document-delete-cancel"
        >
          <Cancel />
          Avbryt
        </StyledButton>
        <StyledButton
          type="fare"
          kompakt
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
    <StyledButton type="fare" kompakt onClick={() => setShowConfirm(true)} data-testid="document-delete-button">
      <Delete />
      Slett
    </StyledButton>
  );
};

const StyledButton = styled(Knapp)`
  display: flex;
  gap: 8px;
  width: 100%;
`;
