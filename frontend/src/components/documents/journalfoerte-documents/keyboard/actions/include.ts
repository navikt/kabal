import {
  getVedlegg,
  useGetDocument,
} from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import {
  getFocusIndex,
  getIsInVedleggList,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { isSelected } from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
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
  const { selectedCount, getSelectedDocuments } = useContext(SelectContext);
  const getDocument = useGetDocument(filteredDocuments);
  const [removeAllIncludedDocuments] = useRemoveAllTilknyttedeDocumentsMutation();
  const [removeIncludedDocument] = useRemoveTilknyttetDocumentMutation();
  const [tilknyttDocument] = useTilknyttDocumentMutation();

  return useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
    () => {
      const accessibleIndex = getFocusIndex();
      const focusedDocument = getDocument();
      const hasDocument = focusedDocument !== undefined;

      if (!hasDocument) {
        return;
      }

      if (oppgaveId === skipToken) {
        return;
      }

      if (selectedCount > 0 && isSelected(accessibleIndex)) {
        const selected = getSelectedDocuments();
        const selectedAndIncludable = selected.filter((d) => d.journalstatus !== Journalstatus.MOTTATT);

        if (selectedAndIncludable.length === 0) {
          return;
        }

        const selectedAndIncluded = selectedAndIncludable.filter((d) => d.valgt);

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
    },
    [
      oppgaveId,
      getDocument,
      removeAllIncludedDocuments,
      removeIncludedDocument,
      tilknyttDocument,
      selectedCount,
      getSelectedDocuments,
      filteredDocuments,
    ],
  );
};

const d = (count: number) => (count === 1 ? 'dokument' : `${count} dokumenter`);
