import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { IKodeverkVerdi } from '../redux-api/kodeverk';
import { useAvailableYtelser } from './use-available-ytelser';

export const useSettingsYtelser = (): IKodeverkVerdi[] => {
  const { data: userData } = useGetBrukerQuery();
  const availableYtelser = useAvailableYtelser();

  if (typeof userData === 'undefined' || availableYtelser.length === 0) {
    return [];
  }

  const settingsYtelser = userData.innstillinger.ytelser;

  if (settingsYtelser.length === 0) {
    return availableYtelser;
  }

  return settingsYtelser.map((ytelseId) => availableYtelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
};
