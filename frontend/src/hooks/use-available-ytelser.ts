import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { IYtelse, useGetKodeverkQuery } from '../redux-api/kodeverk';

export const useAvailableYtelser = (): IYtelse[] => {
  const { data: kodeverk } = useGetKodeverkQuery();
  const { data: userData } = useGetBrukerQuery();

  if (typeof userData === 'undefined' || typeof kodeverk === 'undefined') {
    return [];
  }

  return userData.valgtEnhetView.lovligeYtelser
    .map((ytelseId) => kodeverk.ytelser.find(({ id }) => id === ytelseId))
    .filter(isNotUndefined);
};
