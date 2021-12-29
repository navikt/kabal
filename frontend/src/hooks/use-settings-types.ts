import { isNotUndefined } from '../functions/is-not-type-guards';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { IKodeverkVerdi, useGetKodeverkQuery } from '../redux-api/kodeverk';
import { OppgaveType } from '../redux-api/oppgavebehandling-common-types';

export const useSettingsTypes = (): IKodeverkVerdi<OppgaveType>[] => {
  const { data: kodeverk } = useGetKodeverkQuery();
  const { data: userData } = useGetBrukerQuery();

  if (typeof userData === 'undefined' || typeof kodeverk === 'undefined') {
    return [];
  }

  const settingsTypes = userData.innstillinger.typer;
  const allTyper = kodeverk.type;

  if (settingsTypes.length === 0) {
    return allTyper;
  }

  return settingsTypes.map((typeId) => allTyper.find(({ id }) => id === typeId)).filter(isNotUndefined);
};
