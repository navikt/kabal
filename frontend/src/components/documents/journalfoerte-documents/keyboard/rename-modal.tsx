import { useLazyFocusedDocumentAndVedlegg } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/focused-document';
import { useCanEditDocument } from '@app/components/documents/journalfoerte-documents/use-can-edit';
import { toast } from '@app/components/toast/store';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { Keys } from '@app/keys';
import { useSetTitleMutation } from '@app/redux-api/journalposter';
import type { IArkivertDocument, IArkivertDocumentVedlegg } from '@app/types/arkiverte-documents';
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Label, Modal, TextField, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useRef, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  filteredDocuments: IArkivertDocument[];
}

export const RenameModal = ({ open, onClose, filteredDocuments }: Props) => {
  const oppgaveId = useOppgaveId();
  const canEdit = useCanEditDocument();
  const [updateTitle, { isLoading }] = useSetTitleMutation();
  const [originalTitle, setOriginalTitle] = useState('');
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const getFocusedDocumentAndVedlegg = useLazyFocusedDocumentAndVedlegg(filteredDocuments);

  useEffect(() => {
    if (open) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [open]);

  const [focusedDocument, setFocusedDocument] = useState<IArkivertDocument | undefined>(undefined);
  const [focusedVedlegg, setFocusedVedlegg] = useState<IArkivertDocumentVedlegg | undefined>(undefined);

  useEffect(() => {
    if (!open) {
      setFocusedDocument(undefined);
      setFocusedVedlegg(undefined);

      return;
    }

    const { focusedDocument, focusedVedlegg } = getFocusedDocumentAndVedlegg();

    setFocusedDocument(focusedDocument);
    setFocusedVedlegg(focusedVedlegg);
  }, [open, getFocusedDocumentAndVedlegg]);

  useEffect(() => {
    if (focusedDocument === null) {
      return;
    }

    const originalTitle = focusedVedlegg?.tittel ?? focusedDocument?.tittel ?? '';

    setOriginalTitle(originalTitle);
    setTitle(originalTitle);
  }, [focusedDocument, focusedVedlegg]);

  const onSave = async () => {
    if (oppgaveId === skipToken || focusedDocument === undefined) {
      return;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0 || trimmedTitle === originalTitle) {
      return;
    }

    const dokumentInfoId = focusedVedlegg?.dokumentInfoId ?? focusedDocument.dokumentInfoId;

    if (dokumentInfoId === undefined) {
      return;
    }

    const { journalpostId } = focusedDocument;

    try {
      const { tittel } = await updateTitle({ oppgaveId, journalpostId, dokumentInfoId, tittel: trimmedTitle }).unwrap();
      setTitle(tittel);
      modalRef.current?.close();
      toast.success(`Dokumentnavn oppdatert fra «${originalTitle}» til «${tittel}»`);
    } catch {
      setTitle(originalTitle);
      toast.error(`Kunne ikke oppdatere dokumentnavn fra «${originalTitle}» til «${title}»`);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === Keys.Enter) {
      event.preventDefault();
      // biome-ignore lint/nursery/noFloatingPromises: Safe promise.
      onSave();
      return;
    }

    if (event.key === Keys.Escape && title !== originalTitle) {
      event.preventDefault();
      setTitle(originalTitle);
      return;
    }
  };

  return (
    <Modal
      header={{ heading: 'Gi nytt navn til dokument', size: 'small', closeButton: true }}
      closeOnBackdropClick
      ref={modalRef}
      onClose={onClose}
      className="min-w-[600px]"
      onFocus={(event) => {
        // If focus came from outside the modal, focus the input.
        if (!modalRef.current?.contains(event.relatedTarget)) {
          inputRef.current?.focus();
        }
      }}
    >
      <Modal.Body>
        <HStack align="center" gap="2" marginBlock="0 4">
          <Label>Originalt navn:</Label>

          <BodyShort>"{originalTitle}"</BodyShort>
        </HStack>

        <TextField
          autoFocus
          size="small"
          label="Nytt navn"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          onKeyDown={onKeyDown}
          disabled={!canEdit || isLoading}
          ref={inputRef}
        />
      </Modal.Body>

      <Modal.Footer>
        <Tooltip placement="top" content="Lagre" keys={['Enter']}>
          <Button
            size="small"
            variant="primary"
            icon={<CheckmarkIcon aria-hidden />}
            onClick={onSave}
            loading={isLoading}
            disabled={!canEdit}
          >
            Lagre
          </Button>
        </Tooltip>

        <Tooltip placement="top" content="Avbryt" keys={['Esc']}>
          <Button
            size="small"
            variant="secondary"
            icon={<XMarkIcon aria-hidden />}
            onClick={() => modalRef.current?.close()}
            disabled={isLoading}
          >
            Avbryt
          </Button>
        </Tooltip>
      </Modal.Footer>
    </Modal>
  );
};
