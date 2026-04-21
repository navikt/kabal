import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, type ButtonProps, HStack, Modal, Tag, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  useAttachVedleggFn,
  useOptions,
} from '@/components/documents/journalfoerte-documents/heading/use-as-attachments';
import { getDocument } from '@/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { decrement, increment } from '@/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import { SelectContext } from '@/components/documents/journalfoerte-documents/select-context/select-context';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { isMetaKey, Keys } from '@/keys';
import { useDeleteDocumentMutation } from '@/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument, IArkivertDocumentVedlegg } from '@/types/arkiverte-documents';
import { DocumentTypeEnum, type JournalfoertDokument } from '@/types/documents/documents';

interface Props {
  open: boolean;
  onClose: () => void;
  filteredDocuments: IArkivertDocument[];
}

export const AttachmentModal = ({ open, onClose, filteredDocuments }: Props) => {
  const [focused, setFocused] = useState(0);
  const oppgaveId = useOppgaveId();
  const { getSelectedDocuments } = useContext(SelectContext);
  const selectedDocuments = getSelectedDocuments();
  const options = useOptions(selectedDocuments);
  const allDuaVedlegg = useDuaVedlegg();
  const attachToDua = useAttachVedleggFn();
  const [deleteDocument] = useDeleteDocumentMutation();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [open]);

  const getDocuments = useCallback(() => {
    if (selectedDocuments.length === 0) {
      const focused = getDocument(filteredDocuments);
      return focused === undefined ? [] : [focused];
    }

    return selectedDocuments;
  }, [filteredDocuments, selectedDocuments]);

  const documents = useMemo(() => (open ? getDocuments() : []), [open, getDocuments]);

  if (!open || attachToDua === null) {
    return null;
  }

  const attach = (duaParentId: string) => {
    onAttachToDua(duaParentId);
    ref.current?.close();
  };

  const getDuaVedlegg = (duaParentId: string) => {
    return allDuaVedlegg.filter(
      (v) =>
        v.parentId === duaParentId &&
        documents.some(
          (s) =>
            s.dokumentInfoId === v.journalfoertDokumentReference.dokumentInfoId &&
            s.journalpostId === v.journalfoertDokumentReference.journalpostId,
        ),
    );
  };

  const onAttachToDua = (duaParentId: string) => {
    if (documents.length > 0) {
      attachToDua(duaParentId, ...documents);
    }
  };

  const remove = (duaParentId: string) => {
    if (oppgaveId === skipToken) {
      return;
    }

    for (const { id } of getDuaVedlegg(duaParentId)) {
      deleteDocument({ oppgaveId, dokumentId: id });
    }

    ref.current?.close();
  };

  /**
   * Checks if all selected documents are attached to the given parent DUA.
   */
  const getIsAttached = (duaParentId: string): boolean => {
    return documents.every((d) =>
      allDuaVedlegg.some(
        (v) =>
          v.parentId === duaParentId &&
          v.journalfoertDokumentReference.journalpostId === d.journalpostId &&
          v.journalfoertDokumentReference.dokumentInfoId === d.dokumentInfoId,
      ),
    );
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const meta = isMetaKey(event);

    switch (event.key) {
      case Keys.ArrowUp:
        setFocused(meta ? 0 : (prev) => decrement(prev, 1, 0, options.length - 1));
        break;
      case Keys.ArrowDown:
        setFocused(meta ? options.length - 1 : (prev) => increment(prev, 1, options.length, 0));
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
      header={{
        heading: 'Bruk som vedlegg for',
        size: 'small',
        closeButton: true,
      }}
      closeOnBackdropClick
      ref={ref}
      onClose={onClose}
      onKeyDown={onKeyDown}
      className="min-w-[400px]"
    >
      <Body
        documentsCount={documents.length}
        allVedlegg={allDuaVedlegg}
        options={options}
        focused={focused}
        attach={attach}
        remove={remove}
        getIsAttached={getIsAttached}
      />
    </Modal>
  );
};

interface BodyProps {
  documentsCount: number;
  focusedDocument?: IArkivertDocument;
  focusedVedlegg?: IArkivertDocumentVedlegg;
  allVedlegg: JournalfoertDokument[];
  options: { id: string; tittel: string }[];
  focused: number;
  attach: (parentId: string) => void;
  remove: (parentId: string) => void;
  getIsAttached: (parentId: string) => boolean;
}

const Body = ({ documentsCount, allVedlegg, options, focused, attach, remove, getIsAttached }: BodyProps) => {
  return (
    <Modal.Body>
      <BodyShort spacing>{getDescription(documentsCount)}</BodyShort>

      <VStack as="ol" marginBlock="space-0 space-1">
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
                <HStack align="center" justify="space-between" gap="space-8" wrap={false}>
                  <HStack gap="space-4" align="center" wrap={false}>
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
  );
};

const getDescription = (selectionCount: number) => {
  if (selectionCount === 0) {
    return 'Ingen dokumenter valgt';
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
