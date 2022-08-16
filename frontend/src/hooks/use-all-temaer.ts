import { useKodeverk } from '../simple-api-state/use-kodeverk';
import { IKodeverkValue } from '../types/kodeverk';

export const useAllTemaer = (): IKodeverkValue[] => {
  const { data } = useKodeverk();

  if (typeof data === 'undefined') {
    return [];
  }

  return data.tema;
};
