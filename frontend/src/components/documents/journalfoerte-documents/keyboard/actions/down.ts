import { getLastAccessibleDocumentIndex } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { increment } from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import { getFocusIndex, setFocusIndex } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { useCallback } from 'react';

export const down = () => increment(getFocusIndex(), 1, getLastAccessibleDocumentIndex());

export const useDown = () => useCallback(() => setFocusIndex(down()), []);
