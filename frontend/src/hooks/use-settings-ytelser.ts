import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { IKodeverkValue } from '../types/kodeverk';
import { useKodeverkValue } from './use-kodeverk-value';

export const useSettingsYtelser = (): IKodeverkValue[] => {
  const { data: userData } = useGetBrukerQuery();
  const ytelser = useKodeverkValue('ytelser');

  if (typeof userData === 'undefined' || typeof ytelser === 'undefined') {
    return [];
  }

  const settingsYtelser = userData.innstillinger.ytelser;

  if (settingsYtelser.length === 0) {
    return ytelser;
  }

  return settingsYtelser.map((ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
};
