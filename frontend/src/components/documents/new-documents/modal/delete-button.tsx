import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useDeleteDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { ArrowUndoIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useContext, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { ModalContext } from './modal-context';

interface Props {
  document: IMainDocument;
}

export const DeleteDocumentButton = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading: documentsIsLoading } = useGetDocumentsQuery(oppgaveId);
  const [deleteDocument, { isLoading }] = useDeleteDocumentMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const remove = useRemoveDocument();
  const { close } = useContext(ModalContext);

  const onDelete = async () => {
    if (typeof oppgaveId !== 'string') {
      return;
    }

    await deleteDocument({ dokumentId: document.id, oppgaveId });
    remove(document.id, document);
    close();
  };

  const text = useMemo(() => {
    // If the document has a parent, it is an attachment.
    if (document.parentId !== null) {
      return document.type === DocumentTypeEnum.JOURNALFOERT ? 'Fjern vedlegg' : 'Slett vedlegg';
    }

    // If the document has attatchments.
    if (data !== undefined && data.some(({ parentId }) => parentId === document.id)) {
      return 'Slett dokument og vedlegg';
    }

    return 'Slett dokument';
  }, [data, document.id, document.parentId, document.type]);

  if (documentsIsLoading || typeof data === 'undefined') {
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
  column-gap: var(--a-spacing-4);
`;

const StyledButton = styled(Button)`
  display: flex;
  gap: var(--a-spacing-2);
  width: min-content;
  white-space: nowrap;
`;
