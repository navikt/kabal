import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetSettingsQuery } from '../redux-api/bruker';
import { IKodeverkSimpleValue, OppgaveType } from '../types/kodeverk';
import { useKodeverkValue } from './use-kodeverk-value';

export const useSettingsTypes = (): IKodeverkSimpleValue<OppgaveType>[] => {
  const types = useKodeverkValue('sakstyper');
  const { data } = useGetSettingsQuery();

  if (typeof data === 'undefined' || typeof types === 'undefined') {
    return [];
  }

  return data.typer.map((typeId) => types.find(({ id }) => id === typeId)).filter(isNotUndefined);
};
