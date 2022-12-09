import { UtfallEnum } from '../types/kodeverk';

export const isUtfall = (s?: string): s is UtfallEnum => {
  if (typeof s === 'string') {
    return Object.values(UtfallEnum).some((u) => u === s);
  }

  return false;
};
