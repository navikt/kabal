import { useCallback } from 'react';
import { decrement } from '@/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import { getFocusIndex, setFocusIndex } from '@/components/documents/journalfoerte-documents/keyboard/state/focus';

export const up = () => decrement(getFocusIndex(), 1, 0);

export const useUp = () => useCallback(() => setFocusIndex(up()), []);
