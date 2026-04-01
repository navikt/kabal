import type { behandlingerQuerySlice } from '@/redux-api/oppgaver/queries/behandling/behandling';

type Slice = typeof behandlingerQuerySlice;

let _slice: Slice | null = null;

export const setBehandlingerQuerySlice = (slice: Slice) => {
  _slice = slice;
};

export const getBehandlingerQuerySlice = (): Slice => {
  if (_slice === null) {
    throw new Error(
      'behandlingerQuerySlice not initialized. Ensure setBehandlingerQuerySlice is called in behandling.ts.',
    );
  }

  return _slice;
};
