import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Dialog, HStack, Label, TextField, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useRef, useState } from 'react';
import { useLazyFocusedDocumentAndVedlegg } from '@/components/documents/journalfoerte-documents/keyboard/hooks/focused-document';
import { toast } from '@/components/toast/store';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { Keys } from '@/keys';
import { useSetTitleMutation } from '@/redux-api/journalposter';
import type { IArkivertDocument, IArkivertDocumentVedlegg } from '@/types/arkiverte-documents';

interface Props {
  open: boolean;
  onClose: () => void;
  filteredDocuments: IArkivertDocument[];
}

export const RenameModal = ({ open, onClose, filteredDocuments }: Props) => {
  const oppgaveId = useOppgaveId();
  const [updateTitle, { isLoading }] = useSetTitleMutation();
  const [originalTitle, setOriginalTitle] = useState('');
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const getFocusedDocumentAndVedlegg = useLazyFocusedDocumentAndVedlegg(filteredDocuments);

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
      const { tittel } = await updateTitle({
        oppgaveId,
        journalpostId,
        dokumentInfoId,
        tittel: trimmedTitle,
      }).unwrap();

      setTitle(tittel);
      onClose();
      toast.success(`Dokumentnavn oppdatert fra «${originalTitle}» til «${tittel}»`);
    } catch {
      setTitle(originalTitle);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === Keys.Enter) {
      event.preventDefault();
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
    <Dialog size="small" open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Popup className="min-w-150" initialFocusTo={inputRef}>
        <Dialog.Header>
          <Dialog.Title>Gi nytt navn til dokument</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <HStack align="center" gap="space-8" marginBlock="space-0 space-1">
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
            disabled={isLoading}
            ref={inputRef}
          />
        </Dialog.Body>
        <Dialog.Footer>
          <Tooltip placement="top" content="Lagre" keys={['Enter']}>
            <Button
              size="small"
              variant="primary"
              icon={<CheckmarkIcon aria-hidden />}
              onClick={onSave}
              loading={isLoading}
            >
              Lagre
            </Button>
          </Tooltip>

          <Tooltip placement="top" content="Avbryt" keys={['Esc']}>
            <Button
              data-color="neutral"
              size="small"
              variant="secondary"
              icon={<XMarkIcon aria-hidden />}
              onClick={onClose}
              disabled={isLoading}
            >
              Avbryt
            </Button>
          </Tooltip>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
