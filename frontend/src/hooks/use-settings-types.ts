import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { useGetSettingsQuery } from '@app/redux-api/bruker';
import { IKodeverkSimpleValue, SaksTypeEnum } from '@app/types/kodeverk';
import { useSakstyper } from './use-kodeverk-value';

export const useSettingsTypes = (): IKodeverkSimpleValue<SaksTypeEnum>[] => {
  const types = useSakstyper();
  const { data } = useGetSettingsQuery();

  if (typeof data === 'undefined' || typeof types === 'undefined') {
    return [];
  }

  return data.typer.map((typeId) => types.find(({ id }) => id === typeId)).filter(isNotUndefined);
};
