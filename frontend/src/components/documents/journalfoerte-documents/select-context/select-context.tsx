import { convertAccessibleToRealDocumentPaths } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { useSelectionRangesState } from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
import { getId } from '@app/components/documents/journalfoerte-documents/select-context/helpers';
import { rangesToIndexes } from '@app/components/documents/journalfoerte-documents/select-context/range-utils';
import type {
  ISelectContext,
  SelectedMap,
} from '@app/components/documents/journalfoerte-documents/select-context/types';
import { findDocument } from '@app/domain/find-document';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { createContext, useCallback, useMemo } from 'react';

export const SelectContext = createContext<ISelectContext>({
  selectedDocuments: new Map(),
  selectableCount: 0,
  lastSelectedDocument: null,
  getSelectedDocuments: () => [],
});

interface Props {
  children: React.ReactNode;
  filteredDocumentsList: IArkivertDocument[];
  allDocumentsList: IArkivertDocument[];
}

export const SelectContextElement = ({ children, filteredDocumentsList, allDocumentsList }: Props) => {
  const ranges = useSelectionRangesState();

  const selectedDocuments = useMemo(() => {
    const accessibleDocumentIndexes = rangesToIndexes(ranges);
    const documentPaths = convertAccessibleToRealDocumentPaths(accessibleDocumentIndexes);

    return documentPaths.reduce<SelectedMap>((map, path) => {
      const [documentIndex, attachmentIndex] = path;
      const document = filteredDocumentsList[documentIndex];

      if (document === undefined) {
        return map;
      }

      if (attachmentIndex === -1) {
        const documentId: IJournalfoertDokumentId = {
          journalpostId: document.journalpostId,
          dokumentInfoId: document.dokumentInfoId,
        };

        map.set(getId(documentId), documentId);
      }

      const attachment = document.vedlegg[attachmentIndex];
      if (attachment === undefined) {
        return map;
      }

      const attachmentId: IJournalfoertDokumentId = {
        journalpostId: document.journalpostId,
        dokumentInfoId: attachment.dokumentInfoId,
      };

      map.set(getId(attachmentId), attachmentId);

      return map;
    }, new Map());
  }, [filteredDocumentsList, ranges]);

  /**
   * Returns the selected documents and attachments as a flat list. All as IArkivertDocument. Attachments are merged with the main document.
   */
  const getSelectedDocuments = useCallback(() => {
    if (selectedDocuments.size === 0) {
      return [];
    }

    const selectedDocumentsArray: IArkivertDocument[] = new Array<IArkivertDocument>(selectedDocuments.size);

    let index = 0;
    for (const [, { journalpostId, dokumentInfoId }] of selectedDocuments) {
      const doc = findDocument(journalpostId, dokumentInfoId, allDocumentsList);

      if (doc !== undefined) {
        selectedDocumentsArray[index] = doc;
        index++;
      }
    }

    return selectedDocumentsArray;
  }, [allDocumentsList, selectedDocuments]);

  return (
    <SelectContext.Provider
      value={{
        selectedDocuments,
        selectableCount: filteredDocumentsList.length,
        lastSelectedDocument: null,
        getSelectedDocuments,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};
