import { useGetKodeverkQuery } from '../redux-api/kodeverk';

export const useTemaFromId = (temaId?: string | null): string => {
  const { data, isLoading } = useGetKodeverkQuery();
  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }
  if (data.tema && typeof temaId === 'string') {
    return data.tema.find(({ id }) => id == temaId)?.navn ?? temaId;
  }
  return 'Mangler';
};

export const useTypeFromId = (typeId?: string | null): string => {
  const { data, isLoading } = useGetKodeverkQuery();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (data.type && typeof typeId === 'string') {
    return data.type.find(({ id }) => id == typeId)?.navn ?? typeId;
  }
  return 'Mangler';
};

export const useHjemmelFromId = (hjemmelId?: string | null): string => {
  const { data, isLoading } = useGetKodeverkQuery();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (data.hjemmel && typeof hjemmelId === 'string') {
    return data.type.find(({ id }) => id == hjemmelId)?.navn ?? hjemmelId;
  }
  return 'Mangler';
};
