import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { IKodeverkVerdi } from '../redux-api/kodeverk';
import { useAvailableTemaer } from './use-available-temaer';

export const useSettingsTemaer = (): IKodeverkVerdi[] => {
  const { data: userData } = useGetBrukerQuery();
  const availableTemaer = useAvailableTemaer();

  if (typeof userData === 'undefined' || availableTemaer.length === 0) {
    return [];
  }

  const settingsTemaer = userData.innstillinger.temaer;

  if (settingsTemaer.length === 0) {
    return availableTemaer;
  }

  return settingsTemaer.map((temaId) => availableTemaer.find(({ id }) => id === temaId)).filter(isNotUndefined);
};
