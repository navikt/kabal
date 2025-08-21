import {
  useAttachVedleggFn,
  useOptions,
} from '@app/components/documents/journalfoerte-documents/heading/use-as-attachments';
import { getDocument } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { decrement, increment } from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { isMetaKey, Keys } from '@app/keys';
import { useDeleteDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { type IArkivertDocument, type IArkivertDocumentVedlegg, Journalstatus } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum, type JournalfoertDokument } from '@app/types/documents/documents';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import {
  Alert,
  BodyShort,
  Button,
  type ButtonProps,
  Heading,
  HStack,
  List,
  Modal,
  Tag,
  VStack,
} from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

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

  const validDocuments = documents.filter((d) => d.hasAccess && d.journalstatus !== Journalstatus.MOTTATT);
  const invalidDocuments = documents.filter((d) => d.journalstatus === Journalstatus.MOTTATT);

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
    if (validDocuments.length > 0) {
      attachToDua(duaParentId, ...validDocuments);
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
    return validDocuments.every((d) =>
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

  const isValid = invalidDocuments.length === 0;

  return (
    <Modal
      header={{
        heading: isValid ? 'Bruk som vedlegg for' : 'Kan ikke bruke som vedlegg',
        size: 'small',
        closeButton: true,
      }}
      closeOnBackdropClick
      ref={ref}
      onClose={onClose}
      onKeyDown={onKeyDown}
      className="min-w-[400px]"
    >
      {isValid ? (
        <ValidBody
          validDocumentsCount={validDocuments.length}
          allVedlegg={allDuaVedlegg}
          options={options}
          focused={focused}
          attach={attach}
          remove={remove}
          getIsAttached={getIsAttached}
        />
      ) : (
        <InvalidBody invalidDocuments={invalidDocuments} />
      )}
    </Modal>
  );
};

interface InvalidBodyProps {
  invalidDocuments: IArkivertDocument[];
}

const InvalidBody = ({ invalidDocuments }: InvalidBodyProps) => (
  <Modal.Body>
    <Alert variant="warning" size="small" className="mb-4">
      Journalposter med status{' '}
      <Tag variant="neutral" size="xsmall">
        mottatt
      </Tag>{' '}
      kan ikke brukes som vedlegg.
    </Alert>

    <Heading level="2" size="xsmall" spacing>
      Følgende dokumenter kan ikke brukes som vedlegg:
    </Heading>

    <List>
      {invalidDocuments.map((d) => (
        <List.Item key={`${d.journalpostId}-${d.dokumentInfoId}`}>
          {d.tittel}{' '}
          <Tag size="small" variant="info">
            {isoDateTimeToPretty(d.datoOpprettet)}
          </Tag>
        </List.Item>
      ))}
    </List>

    <BodyShort spacing>
      Fjern dokumentene med status{' '}
      <Tag variant="neutral" size="xsmall">
        mottatt
      </Tag>{' '}
      og prøv igjen.
    </BodyShort>
  </Modal.Body>
);

interface ValidBodyProps {
  validDocumentsCount: number;
  focusedDocument?: IArkivertDocument;
  focusedVedlegg?: IArkivertDocumentVedlegg;
  allVedlegg: JournalfoertDokument[];
  options: { id: string; tittel: string }[];
  focused: number;
  attach: (parentId: string) => void;
  remove: (parentId: string) => void;
  getIsAttached: (parentId: string) => boolean;
}

const ValidBody = ({
  validDocumentsCount,
  allVedlegg,
  options,
  focused,
  attach,
  remove,
  getIsAttached,
}: ValidBodyProps) => {
  return (
    <Modal.Body>
      <BodyShort spacing>{getDescription(validDocumentsCount)}</BodyShort>

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
