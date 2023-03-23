import { useKodeverk } from '@app/simple-api-state/use-kodeverk';
import { IKodeverkValue } from '@app/types/kodeverk';

export const useAllTemaer = (): IKodeverkValue[] => {
  const { data } = useKodeverk();

  if (typeof data === 'undefined') {
    return [];
  }

  return data.tema;
};
