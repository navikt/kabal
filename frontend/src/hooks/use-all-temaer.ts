import { IKodeverkVerdi, useGetKodeverkQuery } from '../redux-api/kodeverk';

export const useAllTemaer = (): IKodeverkVerdi[] => {
  const { data } = useGetKodeverkQuery();

  if (typeof data === 'undefined') {
    return [];
  }

  return data.tema;
};
