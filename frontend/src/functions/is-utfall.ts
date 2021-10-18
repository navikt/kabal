import { Utfall } from '../redux-api/oppgave-state-types';

export const isUtfall = (s?: string): s is Utfall => {
  if (typeof s === 'string') {
    return Object.values(Utfall).some((u) => u === s);
  }

  return false;
};
