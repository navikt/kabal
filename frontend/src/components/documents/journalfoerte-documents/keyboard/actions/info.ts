import { useGetDocument } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { setShowMetadata } from '@app/components/documents/journalfoerte-documents/state/show-metadata';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useCallback } from 'react';

export const useToggleInfo = (filteredDocuments: IArkivertDocument[]) => {
  const getDocument = useGetDocument(filteredDocuments);

  return useCallback(() => {
    const focusedDocument = getDocument();
    const hasDocument = focusedDocument !== undefined;

    if (!hasDocument) {
      return;
    }

    const { journalpostId } = focusedDocument;

    setShowMetadata((ids) =>
      ids.includes(journalpostId) ? ids.filter((id) => id !== journalpostId) : [...ids, journalpostId],
    );
  }, [getDocument]);
};
