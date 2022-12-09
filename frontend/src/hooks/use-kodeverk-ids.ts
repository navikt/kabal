import { useInnsendingshjemlerMap, useKodeverk, useVersionedYtelser } from '../simple-api-state/use-kodeverk';
import { SaksTypeEnum } from '../types/kodeverk';
import { useShortRegistreringshjemmelName } from './use-registreringshjemler-name';

export const useFullTemaNameFromId = (temaId?: string | null): string => {
  const { data, isLoading } = useKodeverk();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof temaId === 'string') {
    return data.tema.find(({ id }) => id === temaId)?.beskrivelse ?? temaId;
  }

  return 'Mangler';
};

export const useFullYtelseNameFromId = (ytelseId?: string | null): string => {
  const { data, isLoading } = useVersionedYtelser();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof data !== 'undefined' && typeof ytelseId === 'string') {
    return data.find(({ id }) => id === ytelseId)?.navn ?? ytelseId;
  }

  return 'Mangler';
};

export const useTypeNameFromId = (type?: SaksTypeEnum): string => {
  const { data, isLoading } = useKodeverk();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof type === 'string') {
    return data.sakstyper.find(({ id }) => id === type)?.navn ?? type;
  }

  return 'Mangler';
};

export const useRegistreringshjemmelFromId = (hjemmelId?: string | null): string => {
  const hjemmel = useShortRegistreringshjemmelName(hjemmelId);

  return typeof hjemmel === 'undefined' ? 'Laster...' : hjemmel;
};

export const useEnhetNameFromId = (enhetId?: string | null): string => {
  const { data, isLoading } = useKodeverk();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof enhetId === 'string') {
    return data.enheter.find(({ id }) => id === enhetId)?.navn ?? enhetId;
  }

  return 'Mangler';
};

export const useInnsendingshjemmelFromId = (hjemmelId?: string | null): string => {
  const { data, isLoading } = useInnsendingshjemlerMap();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof hjemmelId === 'string') {
    return data[hjemmelId] ?? hjemmelId;
  }

  return 'Mangler';
};
