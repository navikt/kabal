import {
  useGetDocument,
  useGetVedlegg,
} from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { getIsInVedleggList } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { toast } from '@app/components/toast/store';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import {
  useRemoveAllTilknyttedeDocumentsMutation,
  useRemoveTilknyttetDocumentMutation,
} from '@app/redux-api/oppgaver/mutations/remove-tilknytt-document';
import { useTilknyttDocumentMutation } from '@app/redux-api/oppgaver/mutations/tilknytt-document';
import { type IArkivertDocument, Journalstatus } from '@app/types/arkiverte-documents';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext } from 'react';

export const useToggleInclude = (filteredDocuments: IArkivertDocument[]) => {
  const oppgaveId = useOppgaveId();
  const { isSelected, selectedCount, getSelectedDocuments } = useContext(SelectContext);
  const getDocument = useGetDocument(filteredDocuments);
  const getVedlegg = useGetVedlegg();
  const [removeAllIncludedDocuments] = useRemoveAllTilknyttedeDocumentsMutation();
  const [removeIncludedDocument] = useRemoveTilknyttetDocumentMutation();
  const [tilknyttDocument] = useTilknyttDocumentMutation();

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  return useCallback(() => {
    const focusedDocument = getDocument();
    const hasDocument = focusedDocument !== undefined;

    if (!hasDocument) {
      toast.error('Kan ikke inkludere dokument.');
      return;
    }

    if (oppgaveId === skipToken) {
      return;
    }

    if (selectedCount > 0 && isSelected(focusedDocument)) {
      const selected = getSelectedDocuments();
      const selectedAndIncludable = selected.filter((d) => d.journalstatus !== Journalstatus.MOTTATT);
      const selectedAndIncluded = selectedAndIncludable.filter((d) => d.valgt);

      const diff = selected.length - selectedAndIncludable.length;
      if (diff > 0) {
        toast.error(`Kan ikke inkludere ${d(diff)} med status "mottatt".`);
      }

      // If all documents are selected, remove all.
      if (selectedAndIncluded.length === selectedAndIncludable.length) {
        if (filteredDocuments.filter((d) => d.valgt).length === selectedAndIncludable.length) {
          // Remove all documents.
          removeAllIncludedDocuments({ oppgaveId });
          toast.success(`Fjernet alle ${d(selectedAndIncludable.length)}.`);
          return;
        }

        // Remove only selected documents.
        for (const { journalpostId, dokumentInfoId } of selectedAndIncluded) {
          removeIncludedDocument({ oppgaveId, journalpostId, dokumentInfoId });
        }

        toast.success(`Fjernet ${d(selectedAndIncluded.length)}.`);
        return;
      }

      // If not all documents are selected, add missing.
      for (const { journalpostId, dokumentInfoId, valgt } of selectedAndIncludable) {
        if (!valgt) {
          tilknyttDocument({ oppgaveId, journalpostId, dokumentInfoId });
        }
      }

      if (selectedAndIncludable.length > 0) {
        toast.success(`Inkluderte ${d(selectedAndIncludable.length)}.`);
      }
      return;
    }

    if (focusedDocument.journalstatus === Journalstatus.MOTTATT) {
      toast.error('Kan ikke inkludere dokument med status "mottatt".');
      return;
    }

    const { journalpostId } = focusedDocument;

    const currentVedlegg = getIsInVedleggList() ? getVedlegg(focusedDocument) : undefined;

    if (currentVedlegg !== undefined) {
      const { dokumentInfoId } = currentVedlegg;

      if (!currentVedlegg.hasAccess) {
        return;
      }

      currentVedlegg.valgt
        ? removeIncludedDocument({ oppgaveId, journalpostId, dokumentInfoId })
        : tilknyttDocument({ oppgaveId, journalpostId, dokumentInfoId });

      return;
    }

    if (!focusedDocument.hasAccess) {
      return;
    }

    const { dokumentInfoId } = focusedDocument;

    focusedDocument.valgt
      ? removeIncludedDocument({ oppgaveId, journalpostId, dokumentInfoId })
      : tilknyttDocument({ oppgaveId, journalpostId, dokumentInfoId });
  }, [
    oppgaveId,
    getDocument,
    getVedlegg,
    removeAllIncludedDocuments,
    removeIncludedDocument,
    tilknyttDocument,
    selectedCount,
    isSelected,
    getSelectedDocuments,
    filteredDocuments,
  ]);
};

const d = (count: number) => (count === 1 ? 'dokument' : `${count} dokumenter`);
