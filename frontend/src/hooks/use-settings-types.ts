import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { IKodeverkSimpleValue, OppgaveType } from '../types/kodeverk';
import { useKodeverkValue } from './use-kodeverk-value';

export const useSettingsTypes = (): IKodeverkSimpleValue<OppgaveType>[] => {
  const types = useKodeverkValue('sakstyper');
  const { data: userData } = useGetBrukerQuery();

  if (typeof userData === 'undefined' || typeof types === 'undefined') {
    return [];
  }

  const settingsTypes = userData.innstillinger.typer;

  if (settingsTypes.length === 0) {
    return types;
  }

  return settingsTypes.map((typeId) => types.find(({ id }) => id === typeId)).filter(isNotUndefined);
};
