import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { IKodeverkSimpleValue } from '../types/kodeverk';
import { useAvailableYtelser } from './use-available-ytelser';

export const useSettingsYtelser = (): IKodeverkSimpleValue[] => {
  const { data: userData } = useGetBrukerQuery();
  const ytelser = useAvailableYtelser();

  if (typeof userData === 'undefined' || typeof ytelser === 'undefined') {
    return [];
  }

  const settingsYtelser = userData.innstillinger.ytelser;

  if (settingsYtelser.length === 0) {
    return ytelser;
  }

  return settingsYtelser.map((ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
};
