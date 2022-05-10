import { useGetKodeverkQuery } from '../redux-api/kodeverk';
import { OppgaveType } from '../types/kodeverk';

export const useFullTemaNameFromId = (temaId?: string | null): string => {
  const { data, isLoading } = useGetKodeverkQuery();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof temaId === 'string') {
    return data.tema.find(({ id }) => id === temaId)?.beskrivelse ?? temaId;
  }

  return 'Mangler';
};

export const useFullYtelseNameFromId = (ytelseId?: string | null): string => {
  const { data, isLoading } = useGetKodeverkQuery();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof data.ytelser !== 'undefined' && typeof ytelseId === 'string') {
    return data.ytelser.find(({ id }) => id === ytelseId)?.navn ?? ytelseId;
  }

  return 'Mangler';
};

export const useTypeNameFromId = (type?: OppgaveType): string => {
  const { data, isLoading } = useGetKodeverkQuery();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof type === 'string') {
    return data.sakstyper.find(({ id }) => id === type)?.navn ?? type;
  }

  return 'Mangler';
};

export const useHjemmelFromId = (hjemmelId?: string | null): string => {
  const { data, isLoading } = useGetKodeverkQuery();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof hjemmelId === 'string') {
    return data.hjemler.find(({ id }) => id === hjemmelId)?.navn ?? hjemmelId;
  }

  return 'Mangler';
};

export const useEnhetNameFromId = (enhetId?: string | null): string => {
  const { data, isLoading } = useGetKodeverkQuery();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof enhetId === 'string') {
    return data.enheter.find(({ id }) => id === enhetId)?.navn ?? enhetId;
  }

  return 'Mangler';
};
