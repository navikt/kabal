import { UtfallEnum } from '@app/types/kodeverk';

const UTFALL = Object.values(UtfallEnum);

export const isUtfall = (s?: string): s is UtfallEnum => {
  if (typeof s === 'string') {
    return UTFALL.some((u) => u === s);
  }

  return false;
};
