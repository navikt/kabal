import {
  convertAccessibleToRealDocumentPath,
  convertRealToAccessibleDocumentIndex,
  getLastAccessibleDocumentIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import {
  getLastIndex,
  increment,
} from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import {
  getFocusIndex,
  getIsInVedleggList,
  resetFocusIndex,
  setFocusIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useCallback } from 'react';

export const home = (): number => {
  if (getIsInVedleggList()) {
    // Focus first vedlegg or document if at already first vedlegg.
    const realPath = convertAccessibleToRealDocumentPath(getFocusIndex());

    if (realPath === null) {
      return -1;
    }

    const [documentIndex, attachmentIndex] = realPath;

    if (attachmentIndex === 0) {
      const accessibleDocumentIndex = convertRealToAccessibleDocumentIndex([documentIndex, -1]);
      return setFocusIndex(accessibleDocumentIndex);
    }

    const accessibleDocumentIndex = convertRealToAccessibleDocumentIndex([documentIndex, 0]);
    return setFocusIndex(accessibleDocumentIndex);
  }

  return resetFocusIndex();
};

export const end = (filteredDocuments: IArkivertDocument[]): number => {
  if (getIsInVedleggList()) {
    // Focus last vedlegg or next document if at already last vedlegg.
    const focusIndex = getFocusIndex();
    const realPath = convertAccessibleToRealDocumentPath(focusIndex);

    if (realPath === null) {
      return -1;
    }

    const [documentIndex, attachmentIndex] = realPath;
    const currentDocument = filteredDocuments[documentIndex];

    if (currentDocument === undefined) {
      return -1;
    }

    const lastAttachmentIndex = getLastIndex(currentDocument.vedlegg);

    if (attachmentIndex === lastAttachmentIndex) {
      const nextAccessibleDocumentIndex = increment(focusIndex, 1, getLastAccessibleDocumentIndex());
      return setFocusIndex(nextAccessibleDocumentIndex);
    }

    const accessibleDocumentIndex = convertRealToAccessibleDocumentIndex([documentIndex, lastAttachmentIndex]);
    return setFocusIndex(accessibleDocumentIndex);
  }

  return getLastAccessibleDocumentIndex();
};

export const useEnd = (filteredDocuments: IArkivertDocument[]) =>
  useCallback(() => setFocusIndex(end(filteredDocuments)), [filteredDocuments]);
