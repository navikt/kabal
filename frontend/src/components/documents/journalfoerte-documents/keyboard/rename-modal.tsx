import { useCanEdit } from '@app/components/documents/journalfoerte-documents/heading/use-as-attachments';
import { toast } from '@app/components/toast/store';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetTitleMutation } from '@app/redux-api/journalposter';
import type { IArkivertDocument, IArkivertDocumentVedlegg } from '@app/types/arkiverte-documents';
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Label, Modal, TextField } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useRef, useState } from 'react';

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
  focusedDocument?: IArkivertDocument;
  focusedVedlegg?: IArkivertDocumentVedlegg;
}

export const RenameModal = ({ ref, focusedDocument, focusedVedlegg }: Props) => {
  const oppgaveId = useOppgaveId();
  const canEdit = useCanEdit();
  const [updateTitle, { isLoading }] = useSetTitleMutation();
  const [originalTitle, setOriginalTitle] = useState('');
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusedDocument === undefined) {
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
      ref.current?.close();
      toast.success(`Dokumentnavn oppdatert fra "${originalTitle}" til "${tittel}"`);
    } catch {
      setTitle(originalTitle);
      toast.error(`Kunne ikke oppdatere dokumentnavn fra "${originalTitle}" til "${title}"`);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSave();
      return;
    }

    if (event.key === 'Escape' && title !== originalTitle) {
      event.preventDefault();
      setTitle(originalTitle);
      return;
    }
  };

  return (
    <Modal
      header={{ heading: 'Gi nytt navn til dokument', size: 'small', closeButton: true }}
      closeOnBackdropClick
      ref={ref}
      className="min-w-[400px]"
      onFocus={(event) => {
        // If focus came from outside the modal, focus the input.
        if (!ref.current?.contains(event.relatedTarget)) {
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
          htmlSize={Math.max(originalTitle.length, 60)}
          onChange={({ target }) => setTitle(target.value)}
          onKeyDown={onKeyDown}
          disabled={!canEdit || isLoading}
          ref={inputRef}
        />
      </Modal.Body>

      <Modal.Footer>
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

        <Button
          size="small"
          variant="secondary"
          icon={<XMarkIcon aria-hidden />}
          onClick={() => ref.current?.close()}
          disabled={isLoading}
        >
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
