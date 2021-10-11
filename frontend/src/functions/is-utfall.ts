import { Utfall } from '../redux-api/oppgave-state-types';

export const isUtfall = (s?: string): s is Utfall => {
  if (typeof s === 'string') {
    return Object.keys(Utfall).includes(s);
  }

  return false;
};
