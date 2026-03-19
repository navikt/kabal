import { useCallback } from 'react';
import { getLastAccessibleDocumentIndex } from '@/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { increment } from '@/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import { getFocusIndex, setFocusIndex } from '@/components/documents/journalfoerte-documents/keyboard/state/focus';

export const down = () => increment(getFocusIndex(), 1, getLastAccessibleDocumentIndex());

export const useDown = () => useCallback(() => setFocusIndex(down()), []);
