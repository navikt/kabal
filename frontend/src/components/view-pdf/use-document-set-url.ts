import { getDocumentSetUrl } from '@app/domain/document-set-url';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { useMemo } from 'react';

/** Returns the document-set URL for the currently viewed PDF set, or `null` if nothing is being viewed. */
export const useDocumentSetUrl = (): string | null => {
  const { value: pdfViewed } = useDocumentsPdfViewed();

  return useMemo(() => getDocumentSetUrl(pdfViewed), [pdfViewed]);
};
