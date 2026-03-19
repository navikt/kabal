import { useTema } from '@/simple-api-state/use-kodeverk';
import type { IKodeverkValue } from '@/types/kodeverk';

export const useAllTemaer = (): IKodeverkValue[] => {
  const { data } = useTema();

  if (typeof data === 'undefined') {
    return [];
  }

  return data;
};
