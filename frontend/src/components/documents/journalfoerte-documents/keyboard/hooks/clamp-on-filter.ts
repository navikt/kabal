import { useEffect } from 'react';
import {
  FIRST_ACCESSIBLE_DOCUMENT_INDEX,
  getLastAccessibleDocumentIndex,
} from '@/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { getFocusIndex, setFocusIndex } from '@/components/documents/journalfoerte-documents/keyboard/state/focus';
import { clamp } from '@/functions/clamp';

export const useClampOnFilter = () =>
  useEffect(() => {
    const accessibleDocumentIndex = getFocusIndex();

    if (
      accessibleDocumentIndex === FIRST_ACCESSIBLE_DOCUMENT_INDEX ||
      accessibleDocumentIndex < getLastAccessibleDocumentIndex()
    ) {
      return;
    }

    const clampedAccessibleDocumentIndex = clamp(
      accessibleDocumentIndex,
      FIRST_ACCESSIBLE_DOCUMENT_INDEX,
      getLastAccessibleDocumentIndex(),
    );

    setFocusIndex(clampedAccessibleDocumentIndex);
  }, []);
