import { ArrowUndoIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useDeleteDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IMainDocument } from '@app/types/documents/documents';

interface Props {
  document: IMainDocument;
}

export const DeleteDocumentButton = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const canEdit = useCanEdit();
  const { data, isLoading: documentsIsLoading } = useGetDocumentsQuery(oppgaveId);
  const [deleteDocument, { isLoading }] = useDeleteDocumentMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const remove = useRemoveDocument();

  const onDelete = () => {
    if (typeof oppgaveId !== 'string') {
      return;
    }

    remove(document.id, document);
    deleteDocument({ dokumentId: document.id, oppgaveId });
  };

  const text = useMemo(() => {
    // If the document has a parent, it is an attachment.
    if (document.parentId !== null) {
      return 'Slett vedlegg';
    }

    // If the document has attatchments.
    if (data !== undefined && data.some(({ parentId }) => parentId === document.id)) {
      return 'Slett dokument og vedlegg';
    }

    return 'Slett dokument';
  }, [data, document.id, document.parentId]);

  if (!canEdit || documentsIsLoading || typeof data === 'undefined') {
    return null;
  }

  if (showConfirm) {
    return (
      <Container>
        <StyledButton
          variant="danger"
          size="small"
          disabled={isLoading}
          onClick={onDelete}
          data-testid="document-delete-confirm"
          icon={<TrashIcon aria-hidden />}
        >
          {text}
        </StyledButton>
        <StyledButton
          size="small"
          variant="secondary"
          onClick={() => setShowConfirm(false)}
          data-testid="document-delete-cancel"
          icon={<ArrowUndoIcon aria-hidden />}
        >
          Avbryt
        </StyledButton>
      </Container>
    );
  }

  return (
    <Container>
      <StyledButton
        variant="danger"
        size="small"
        onClick={() => setShowConfirm(true)}
        data-testid="document-delete-button"
        icon={<TrashIcon aria-hidden />}
      >
        {text}
      </StyledButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  column-gap: 16px;
`;

const StyledButton = styled(Button)`
  display: flex;
  gap: 8px;
  width: min-content;
  white-space: nowrap;
`;
