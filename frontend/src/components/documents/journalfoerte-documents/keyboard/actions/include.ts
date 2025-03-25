import { getIsInVedleggList } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/focus';
import {
  useGetDocument,
  useGetVedlegg,
} from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
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

    if (oppgaveId === skipToken || !hasDocument) {
      return;
    }

    if (selectedCount > 0 && isSelected(focusedDocument)) {
      const selected = getSelectedDocuments().filter((d) => d.hasAccess && d.journalstatus !== Journalstatus.MOTTATT);
      const selectedAndIncluded = selected.filter((d) => d.valgt);

      // If all documents are selected, remove all.
      if (selectedAndIncluded.length === selected.length) {
        if (filteredDocuments.filter((d) => d.valgt).length === selected.length) {
          // Remove all documents.
          removeAllIncludedDocuments({ oppgaveId });
          return;
        }

        // Remove only selected documents.
        for (const { journalpostId, dokumentInfoId } of selectedAndIncluded) {
          removeIncludedDocument({ oppgaveId, journalpostId, dokumentInfoId });
        }

        return;
      }

      // If not all documents are selected, add missing.
      for (const { journalpostId, dokumentInfoId, valgt } of selected) {
        if (!valgt) {
          tilknyttDocument({ oppgaveId, journalpostId, dokumentInfoId });
        }
      }

      return;
    }

    if (focusedDocument.journalstatus === Journalstatus.MOTTATT) {
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
