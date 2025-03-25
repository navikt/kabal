import {
  useAttachVedleggFn,
  useOptions,
} from '@app/components/documents/journalfoerte-documents/heading/use-as-attachments';
import { useLazyFocusedDocumentAndVedlegg } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/focused-document';
import { decrement, increment } from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useCanEditDocument } from '@app/components/documents/journalfoerte-documents/use-can-edit';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { Keys, isMetaKey } from '@app/keys';
import { useDeleteDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument, IArkivertDocumentVedlegg } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum, type JournalfoertDokument } from '@app/types/documents/documents';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, type ButtonProps, HStack, Modal, Tag, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext, useEffect, useRef, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  filteredDocuments: IArkivertDocument[];
}

export const AttachmentModal = ({ open, onClose, filteredDocuments }: Props) => {
  const [focused, setFocused] = useState(0);
  const oppgaveId = useOppgaveId();
  const canEdit = useCanEditDocument();
  const options = useOptions();
  const allVedlegg = useDuaVedlegg();
  const attachToDua = useAttachVedleggFn();
  const { selectedDocuments, getSelectedDocuments } = useContext(SelectContext);
  const [deleteDocument] = useDeleteDocumentMutation();
  const ref = useRef<HTMLDialogElement>(null);
  const getFocusedDocumentAndVedlegg = useLazyFocusedDocumentAndVedlegg(filteredDocuments);

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
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

  if (!open || !canEdit || attachToDua === null) {
    return null;
  }

  const attach = (parentId: string) => {
    onAttachToDua(parentId);
    ref.current?.close();
  };

  const getSelectedVedlegg = (parentId: string) => {
    if (selectedDocuments.size > 0) {
      const selectedDocuments = getSelectedDocuments();

      return allVedlegg.filter(
        (v) =>
          v.parentId === parentId &&
          selectedDocuments.some(
            (s) =>
              s.dokumentInfoId === v.journalfoertDokumentReference.dokumentInfoId &&
              s.journalpostId === v.journalfoertDokumentReference.journalpostId,
          ),
      );
    }

    const focused = getArkivertDocumentOrUndefined(focusedDocument, focusedVedlegg);

    if (focused === undefined) {
      return [];
    }

    return allVedlegg.filter(
      (v) =>
        v.parentId === parentId &&
        v.journalfoertDokumentReference.dokumentInfoId === focused.dokumentInfoId &&
        v.journalfoertDokumentReference.journalpostId === focused.journalpostId,
    );
  };

  const onAttachToDua = (duaId: string) => {
    if (attachToDua === null) {
      return;
    }

    if (selectedDocuments.size > 0) {
      attachToDua(duaId, ...getSelectedDocuments());
      return;
    }

    if (focusedDocument === undefined) {
      return;
    }

    attachToDua(duaId, getArkiverteDocument(focusedDocument, focusedVedlegg));
  };

  const remove = (parentId: string) => {
    if (oppgaveId === skipToken) {
      return;
    }

    for (const { id: dokumentId } of getSelectedVedlegg(parentId)) {
      deleteDocument({ oppgaveId, dokumentId });
    }

    ref.current?.close();
  };

  const getIsAttached = (parentId: string): boolean => {
    const selectedVedlegg = getSelectedVedlegg(parentId);

    if (selectedDocuments.size === 0) {
      const focused = getArkivertDocumentOrUndefined(focusedDocument, focusedVedlegg);

      if (focused === undefined) {
        return false;
      }

      return selectedVedlegg.some(
        (v) =>
          v.journalfoertDokumentReference.dokumentInfoId === focused.dokumentInfoId &&
          v.journalfoertDokumentReference.journalpostId === focused.journalpostId,
      );
    }

    return selectedVedlegg.length === selectedDocuments.size;
  };

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  const onKeyDown = (event: React.KeyboardEvent) => {
    const meta = isMetaKey(event);

    switch (event.key) {
      case Keys.ArrowUp:
        setFocused(meta ? 0 : (prev) => decrement(prev, 1, 0, options.length - 1));
        break;
      case Keys.ArrowDown:
        setFocused(meta ? options.length - 1 : (prev) => increment(prev, 1, options.length, 0));
        break;
      case Keys.PageUp:
        setFocused(meta ? 0 : (prev) => decrement(prev, 10, 0, options.length - 1));
        break;
      case Keys.PageDown:
        setFocused(meta ? options.length - 1 : (prev) => increment(prev, 10, options.length, 0));
        break;
      case Keys.Home:
        setFocused(0);
        break;
      case Keys.End:
        setFocused(options.length - 1);
        break;
      case Keys.V: {
        event.preventDefault();
        ref.current?.close();
        break;
      }
      case Keys.Enter: {
        const focusedOption = options[focused];

        if (focusedOption === undefined) {
          return;
        }

        const { id } = focusedOption;
        const isAttached = getIsAttached(id);

        isAttached ? remove(id) : attach(id);
        break;
      }
      default:
        break;
    }
  };

  return (
    <Modal
      header={{ heading: 'Bruk som vedlegg for', size: 'small', closeButton: true }}
      closeOnBackdropClick
      ref={ref}
      onClose={onClose}
      onKeyDown={onKeyDown}
      className="min-w-[400px]"
    >
      <Modal.Body>
        <BodyShort spacing>
          {getDescription(selectedDocuments.size, focusedDocument?.tittel ?? focusedVedlegg?.tittel ?? undefined)}
        </BodyShort>

        <VStack as="ol" marginBlock="0 4">
          {options.map(({ id, tittel }, index) => {
            const vedlegg = allVedlegg.filter((v) => v.parentId === id);
            const isAttached = getIsAttached(id);

            const focusedVariant: ButtonProps['variant'] = isAttached ? 'secondary-neutral' : 'secondary';
            const blurredVariant: ButtonProps['variant'] = isAttached ? 'tertiary-neutral' : 'tertiary';

            return (
              <li key={id}>
                <Button
                  size="small"
                  variant={focused === index ? focusedVariant : blurredVariant}
                  onClick={() => (isAttached ? remove(id) : attach(id))}
                  className="flex w-full grow justify-start text-left *:w-full"
                >
                  <HStack align="center" justify="space-between" gap="2" wrap={false}>
                    <HStack gap="1" align="center" wrap={false}>
                      {isAttached ? <TrashIcon aria-hidden /> : <PlusCircleIcon aria-hidden />}
                      <span>
                        {isAttached ? 'Fjern fra' : 'Legg til'} "{tittel}"
                      </span>
                    </HStack>

                    <Tag size="xsmall" variant={isAttached ? 'neutral' : 'info'}>
                      {vedlegg.length} vedlegg
                    </Tag>
                  </HStack>
                </Button>
              </li>
            );
          })}
        </VStack>

        <Alert variant="info" size="small" inline>
          Naviger med pil opp og ned. Velg dokument med enter.
        </Alert>
      </Modal.Body>
    </Modal>
  );
};

const getDescription = (selectionCount: number, title?: string) => {
  if (selectionCount === 0 && title !== undefined) {
    return `Bruk "${title}" som vedlegg til`;
  }

  if (selectionCount > 1) {
    return `Bruk ${selectionCount} dokumenter som vedlegg til`;
  }

  return 'Bruk valgt dokument som vedlegg til';
};

const useDuaVedlegg = (): JournalfoertDokument[] => {
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);

  return data.filter((d): d is JournalfoertDokument => d.parentId !== null && d.type === DocumentTypeEnum.JOURNALFOERT);
};

const getArkivertDocumentOrUndefined = (document?: IArkivertDocument, vedlegg?: IArkivertDocumentVedlegg) =>
  document === undefined ? undefined : getArkiverteDocument(document, vedlegg);

const getArkiverteDocument = (document: IArkivertDocument, vedlegg?: IArkivertDocumentVedlegg): IArkivertDocument =>
  vedlegg === undefined ? document : { ...document, ...vedlegg };
