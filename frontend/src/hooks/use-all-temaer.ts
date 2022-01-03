import { useGetKodeverkQuery } from '../redux-api/kodeverk';
import { IKodeverkValue } from '../types/kodeverk';

export const useAllTemaer = (): IKodeverkValue[] => {
  const { data } = useGetKodeverkQuery();

  if (typeof data === 'undefined') {
    return [];
  }

  return data.tema;
};
