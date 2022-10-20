import { useKodeverk } from '../simple-api-state/use-kodeverk';
import { OppgaveType } from '../types/kodeverk';
import { useRegistreringshjemmelName } from './use-registreringshjemler';

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
  const { data, isLoading } = useKodeverk();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof data.ytelser !== 'undefined' && typeof ytelseId === 'string') {
    return data.ytelser.find(({ id }) => id === ytelseId)?.navn ?? ytelseId;
  }

  return 'Mangler';
};

export const useTypeNameFromId = (type?: OppgaveType): string => {
  const { data, isLoading } = useKodeverk();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof type === 'string') {
    return data.sakstyper.find(({ id }) => id === type)?.navn ?? type;
  }

  return 'Mangler';
};

export const useHjemmelFromId = (hjemmelId?: string | null): string => {
  const hjemmel = useRegistreringshjemmelName(hjemmelId);

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
