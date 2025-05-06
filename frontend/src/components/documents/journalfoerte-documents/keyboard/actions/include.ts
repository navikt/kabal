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
import { useLazyIsTilknyttetDokument } from '@app/components/documents/journalfoerte-documents/use-tilknyttede-dokumenter';
import { toast } from '@app/components/toast/store';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import {
  useRemoveAllTilknyttedeDocumentsMutation,
  useRemoveTilknyttedeDocumentsMutation,
} from '@app/redux-api/oppgaver/mutations/remove-tilknytt-document';
import { useTilknyttDocumentsMutation } from '@app/redux-api/oppgaver/mutations/tilknytt-document';
import { type IArkivertDocument, Journalstatus } from '@app/types/arkiverte-documents';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext } from 'react';

export const useToggleInclude = (filteredDocuments: IArkivertDocument[]) => {
  const oppgaveId = useOppgaveId();
  const { selectedCount, getSelectedDocuments } = useContext(SelectContext);
  const getDocument = useGetDocument(filteredDocuments);
  const [removeAllIncludedDocuments] = useRemoveAllTilknyttedeDocumentsMutation();
  const [removeIncludedDocuments] = useRemoveTilknyttedeDocumentsMutation();
  const [tilknyttDocuments] = useTilknyttDocumentsMutation();
  const isTilknyttet = useLazyIsTilknyttetDokument();

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

        const selectedAndIncluded = selectedAndIncludable.filter((d) =>
          isTilknyttet(d.journalpostId, d.dokumentInfoId),
        );

        // If all documents are selected, remove all.
        if (selectedAndIncluded.length === selectedAndIncludable.length) {
          if (
            filteredDocuments.filter((d) => isTilknyttet(d.journalpostId, d.dokumentInfoId)).length ===
            selectedAndIncludable.length
          ) {
            // Remove all documents.
            removeAllIncludedDocuments({ oppgaveId });
            toast.success(`Fjernet alle ${d(selectedAndIncludable.length)}.`);
            return;
          }

          // Remove only selected documents.
          removeIncludedDocuments({
            oppgaveId,
            documentIdList: selectedAndIncluded.map(({ journalpostId, dokumentInfoId }) => ({
              journalpostId,
              dokumentInfoId,
            })),
          });

          toast.success(`Fjernet ${d(selectedAndIncluded.length)}.`);
          return;
        }

        // If not all documents are selected, add missing.
        tilknyttDocuments({
          oppgaveId,
          documentIdList: selectedAndIncludable.map(({ journalpostId, dokumentInfoId }) => ({
            journalpostId,
            dokumentInfoId,
          })),
        });

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

        isTilknyttet(journalpostId, currentVedlegg.dokumentInfoId)
          ? removeIncludedDocuments({ oppgaveId, documentIdList: [{ journalpostId, dokumentInfoId }] })
          : tilknyttDocuments({ oppgaveId, documentIdList: [{ journalpostId, dokumentInfoId }] });

        return;
      }

      if (!focusedDocument.hasAccess) {
        return;
      }

      const { dokumentInfoId } = focusedDocument;

      isTilknyttet(journalpostId, dokumentInfoId)
        ? removeIncludedDocuments({ oppgaveId, documentIdList: [{ journalpostId, dokumentInfoId }] })
        : tilknyttDocuments({ oppgaveId, documentIdList: [{ journalpostId, dokumentInfoId }] });
    },
    [
      oppgaveId,
      getDocument,
      removeAllIncludedDocuments,
      removeIncludedDocuments,
      tilknyttDocuments,
      selectedCount,
      getSelectedDocuments,
      filteredDocuments,
      isTilknyttet,
    ],
  );
};

const d = (count: number) => (count === 1 ? 'dokument' : `${count} dokumenter`);
