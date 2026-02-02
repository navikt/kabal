import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useDeleteDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum, type IDocument, isAttachmentDocument } from '@app/types/documents/documents';
import { ArrowUndoIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useContext, useMemo, useState } from 'react';
import { ModalContext } from './modal-context';

interface Props extends React.RefAttributes<HTMLDivElement> {
  document: IDocument;
  disabled?: boolean;
}

export const DeleteDocumentButton = ({ document, disabled = false, ...rest }: Props) => {
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

    if (data === undefined) {
      return 'Slett dokument';
    }

    const journalførteVedlegg: Set<string> = new Set(); // Do not count duplicates.
    let otherVedleggCount = 0;

    for (const doc of data) {
      if (doc.parentId !== document.id) {
        continue;
      }

      if (doc.type === DocumentTypeEnum.JOURNALFOERT) {
        journalførteVedlegg.add(doc.journalfoertDokumentReference.dokumentInfoId);
      } else {
        otherVedleggCount++;
      }
    }

    if (journalførteVedlegg.size === 0 && otherVedleggCount === 0) {
      return 'Slett dokument';
    }

    const totalCount = journalførteVedlegg.size + otherVedleggCount;

    return `Slett dokument og ${totalCount === 1 ? 'ett unikt' : `${totalCount} unike`} vedlegg`;
  }, [data, document.id, document.type, isAttachment]);

  if (!isSuccess) {
    return null;
  }

  if (showConfirm) {
    return (
      <HStack justify="end" gap="space-0 space-16" {...rest}>
        <Button
          data-color="danger"
          className={BUTTON_CLASSES}
          variant="primary"
          size="small"
          loading={isLoading}
          disabled={disabled}
          onClick={onDelete}
          data-testid="document-delete-confirm"
          icon={<TrashIcon aria-hidden />}
        >
          {text}
        </Button>
        <Button
          data-color="neutral"
          className={BUTTON_CLASSES}
          size="small"
          variant="secondary"
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
    <HStack justify="end" gap="space-0 space-16" {...rest}>
      <Button
        data-color="danger"
        className={BUTTON_CLASSES}
        variant="primary"
        size="small"
        onClick={() => setShowConfirm(true)}
        data-testid="document-delete-button"
        icon={<TrashIcon aria-hidden />}
        disabled={disabled}
      >
        {text}
      </Button>
    </HStack>
  );
};

const BUTTON_CLASSES = 'flex w-min flex-row gap-2 whitespace-nowrap';
