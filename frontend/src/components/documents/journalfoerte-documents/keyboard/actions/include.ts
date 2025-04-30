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
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import { type IArkivertDocument, Journalstatus } from '@app/types/arkiverte-documents';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext } from 'react';

export const useToggleInclude = (filteredDocuments: IArkivertDocument[]) => {
  const oppgaveId = useOppgaveId();
  const { selectedDocuments, getSelectedDocuments } = useContext(SelectContext);
  const getDocument = useGetDocument(filteredDocuments);
  const [removeAllIncludedDocuments] = useRemoveAllTilknyttedeDocumentsMutation();
  const [removeIncludedDocuments] = useRemoveTilknyttedeDocumentsMutation();
  const [tilknyttDocuments] = useTilknyttDocumentsMutation();
  const isTilknyttet = useLazyIsTilknyttetDokument();
  const { data: allDocuments } = useGetArkiverteDokumenterQuery(oppgaveId);

  const getAllIncludedDocumentCount = useCallback(
    () =>
      allDocuments?.dokumenter.reduce((count, d) => {
        if (!d.hasAccess || d.journalstatus === Journalstatus.MOTTATT) {
          return count;
        }

        const vedleggCount = d.vedlegg.filter(
          (v) => v.hasAccess && isTilknyttet(d.journalpostId, v.dokumentInfoId),
        ).length;

        if (isTilknyttet(d.journalpostId, d.dokumentInfoId)) {
          return count + 1 + vedleggCount;
        }

        return count + vedleggCount;
      }, 0),
    [isTilknyttet, allDocuments?.dokumenter],
  );

  return useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
    async () => {
      const accessibleIndex = getFocusIndex();
      const focusedDocument = getDocument();
      const hasDocument = focusedDocument !== undefined;

      if (!hasDocument) {
        return;
      }

      if (oppgaveId === skipToken) {
        return;
      }

      if (selectedDocuments.size > 0 && isSelected(accessibleIndex)) {
        const selected = getSelectedDocuments();
        const selectedAndIncludable = selected.filter((d) => d.journalstatus !== Journalstatus.MOTTATT);

        if (selectedAndIncludable.length === 0) {
          return;
        }

        const selectedAndIncluded = selectedAndIncludable.filter((d) =>
          isTilknyttet(d.journalpostId, d.dokumentInfoId),
        );

        // If all included documents are selected, and all selected are included, remove all.
        if (
          selectedAndIncluded.length > 0 &&
          selectedAndIncludable.length === selectedAndIncluded.length && // All includable selected are included.
          selectedAndIncluded.length === getAllIncludedDocumentCount() // All selected are all the included documents.
        ) {
          // Remove all documents.
          try {
            await removeAllIncludedDocuments({ oppgaveId }).unwrap();
            toast.success(`Ekskluderte ${d(selectedAndIncluded.length)}. Ingen dokumenter er nå inkluderte.`);
          } catch {
            toast.error(`Kunne ikke ekskludere ${d(selectedAndIncluded.length)}.`);
          }
          return;
        }

        // If all selected documents are included, remove them.
        if (selectedAndIncluded.length === selectedAndIncludable.length) {
          try {
            const documentIdList = selectedAndIncluded.map(({ journalpostId, dokumentInfoId }) => ({
              journalpostId,
              dokumentInfoId,
            }));
            await removeIncludedDocuments({ oppgaveId, documentIdList }).unwrap();
            toast.success(`Ekskluderte ${d(selectedAndIncluded.length)}.`);
          } catch {
            toast.error(`Kunne ikke ekskludere ${d(selectedAndIncluded.length)}.`);
          }

          return;
        }

        // If not all documents are included, include missing.
        if (selectedAndIncludable.length > 0) {
          try {
            const documentIdList = selectedAndIncludable.map(({ journalpostId, dokumentInfoId }) => ({
              journalpostId,
              dokumentInfoId,
            }));
            await tilknyttDocuments({ oppgaveId, documentIdList }).unwrap();
            toast.success(`Inkluderte ${d(selectedAndIncludable.length)}.`);
          } catch {
            toast.error(`Kunne ikke inkludere ${d(selectedAndIncludable.length)}.`);
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
      selectedDocuments.size,
      getSelectedDocuments,
      isTilknyttet,
      getAllIncludedDocumentCount,
    ],
  );
};

const d = (count: number) => (count === 1 ? 'dokument' : `${count} dokumenter`);
