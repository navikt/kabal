import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetSettingsQuery } from '../redux-api/bruker';
import { IKodeverkSimpleValue, SaksTypeEnum } from '../types/kodeverk';
import { useSakstyper } from './use-kodeverk-value';

export const useSettingsTypes = (): IKodeverkSimpleValue<SaksTypeEnum>[] => {
  const types = useSakstyper();
  const { data } = useGetSettingsQuery();

  if (typeof data === 'undefined' || typeof types === 'undefined') {
    return [];
  }

  return data.typer.map((typeId) => types.find(({ id }) => id === typeId)).filter(isNotUndefined);
};
