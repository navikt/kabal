import { count } from '@app/functions/count';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useDeleteDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum, type IDocument, isAttachmentDocument } from '@app/types/documents/documents';
import { ArrowUndoIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useContext, useMemo, useState } from 'react';
import { ModalContext } from './modal-context';

interface Props {
  document: IDocument;
}

export const DeleteDocumentButton = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isSuccess } = useGetDocumentsQuery(oppgaveId);
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

  const isAttachment = isAttachmentDocument(document);

  const text = useMemo(() => {
    // If the document has a parent, it is an attachment.
    if (isAttachment) {
      return document.type === DocumentTypeEnum.JOURNALFOERT ? 'Fjern vedlegg' : 'Slett vedlegg';
    }

    const vedleggCount = count(data, ({ parentId }) => parentId === document.id);

    // If the document has attatchments.
    if (vedleggCount > 0) {
      return `Slett dokument og ${vedleggCount} vedlegg`;
    }

    return 'Slett dokument';
  }, [data, document.id, document.type, isAttachment]);

  if (!isSuccess) {
    return null;
  }

  if (showConfirm) {
    return (
      <HStack justify="end" gap="0 4">
        <Button
          className={BUTTON_CLASSES}
          variant="danger"
          size="small"
          disabled={isLoading}
          onClick={onDelete}
          data-testid="document-delete-confirm"
          icon={<TrashIcon aria-hidden />}
        >
          {text}
        </Button>
        <Button
          className={BUTTON_CLASSES}
          size="small"
          variant="secondary-neutral"
          onClick={() => setShowConfirm(false)}
          data-testid="document-delete-cancel"
          icon={<ArrowUndoIcon aria-hidden />}
        >
          Avbryt
        </Button>
      </HStack>
    );
  }

  return (
    <HStack justify="end" gap="0 4">
      <Button
        className={BUTTON_CLASSES}
        variant="danger"
        size="small"
        onClick={() => setShowConfirm(true)}
        data-testid="document-delete-button"
        icon={<TrashIcon aria-hidden />}
      >
        {text}
      </Button>
    </HStack>
  );
};

const BUTTON_CLASSES = 'flex w-min flex-row gap-2 whitespace-nowrap';
