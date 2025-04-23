import { decrement } from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import { getFocusIndex, setFocusIndex } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { useCallback } from 'react';

export const up = () => decrement(getFocusIndex(), 1, 0);

export const useUp = () => useCallback(() => setFocusIndex(up()), []);
