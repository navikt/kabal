import { Utfall } from '../types/kodeverk';

export const isUtfall = (s?: string): s is Utfall => {
  if (typeof s === 'string') {
    return Object.values(Utfall).some((u) => u === s);
  }

  return false;
};
