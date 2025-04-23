import {
  FIRST_ACCESSIBLE_DOCUMENT_INDEX,
  getLastAccessibleDocumentIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { getFocusIndex, setFocusIndex } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { clamp } from '@app/functions/clamp';
import { useEffect } from 'react';

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
