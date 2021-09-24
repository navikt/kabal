import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { IKodeverkVerdi, useGetKodeverkQuery } from '../redux-api/kodeverk';

export const useAvailableTemaer = (): IKodeverkVerdi[] => {
  const { data: kodeverk } = useGetKodeverkQuery();
  const { data: userData } = useGetBrukerQuery();

  if (typeof userData === 'undefined' || typeof kodeverk === 'undefined') {
    return [];
  }

  return userData.valgtEnhetView.lovligeTemaer
    .map((temaId) => kodeverk.tema.find(({ id }) => id === temaId))
    .filter(isNotUndefined);
};
