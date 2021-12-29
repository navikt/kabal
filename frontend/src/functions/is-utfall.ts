import { Utfall } from '../redux-api/klagebehandling-state-types';

export const isUtfall = (s?: string): s is Utfall => {
  if (typeof s === 'string') {
    return Object.values(Utfall).some((u) => u === s);
  }

  return false;
};
