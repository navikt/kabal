import { getDocumentSetId, getDocumentSetUrl } from '@app/domain/document-set-url';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { useMemo } from 'react';

interface DocumentSet {
  url: string;
  id: string;
}

/** Returns the document-set URL for the currently viewed PDF set, or `null` if nothing is being viewed. */
export const useDocumentSet = (): DocumentSet | null => {
  const { value: pdfViewed } = useDocumentsPdfViewed();

  return useMemo(() => {
    const id = getDocumentSetId(pdfViewed);
    const url = getDocumentSetUrl(pdfViewed);

    if (id === null || url === null) {
      return null;
    }

    return { id, url };
  }, [pdfViewed]);
};
