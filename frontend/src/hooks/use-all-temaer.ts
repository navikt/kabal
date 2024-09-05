import { useTema } from '@app/simple-api-state/use-kodeverk';
import { IKodeverkValue } from '@app/types/kodeverk';

export const useAllTemaer = (): IKodeverkValue[] => {
  const { data } = useTema();

  if (typeof data === 'undefined') {
    return [];
  }

  return data;
};
