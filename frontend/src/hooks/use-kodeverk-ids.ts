import { useGetKodeverkQuery } from '../redux-api/kodeverk';
import { OppgaveType } from '../redux-api/oppgavebehandling-common-types';

export const useFullTemaNameFromId = (type: OppgaveType, temaId?: string | null): string => {
  const { data, isLoading } = useGetKodeverkQuery(type);

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof temaId === 'string') {
    return data.tema.find(({ id }) => id === temaId)?.beskrivelse ?? temaId;
  }

  return 'Mangler';
};

export const useFullYtelseNameFromId = (type: OppgaveType, ytelseId?: string | null): string => {
  const { data, isLoading } = useGetKodeverkQuery(type);

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof data.ytelser !== 'undefined' && typeof ytelseId === 'string') {
    return data.ytelser.find(({ id }) => id === ytelseId)?.beskrivelse ?? ytelseId;
  }

  return 'Mangler';
};

export const useTypeFromId = (typeId?: string | null): string => {
  const { data, isLoading } = useGetKodeverkQuery(typeId);

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof typeId === 'string') {
    return data.type.find(({ id }) => id === typeId)?.navn ?? typeId;
  }

  return 'Mangler';
};

export const useHjemmelFromId = (type: OppgaveType, hjemmelId?: string | null): string => {
  const { data, isLoading } = useGetKodeverkQuery(type);

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof hjemmelId === 'string') {
    return data.hjemmel.find(({ id }) => id === hjemmelId)?.navn ?? hjemmelId;
  }

  return 'Mangler';
};
