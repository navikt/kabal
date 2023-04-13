import { UtfallEnum } from '@app/types/kodeverk';

export const isUtfall = (s?: string): s is UtfallEnum => {
  if (typeof s === 'string') {
    return Object.values(UtfallEnum).some((u) => u === s);
  }

  return false;
};

export const isUtfallOrNone = (s?: string): s is UtfallEnum | 'NONE' => {
  if (typeof s === 'string') {
    return s === 'NONE' || Object.values(UtfallEnum).some((u) => u === s);
  }

  return false;
};
