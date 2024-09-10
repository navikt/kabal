import {
  useEnheter,
  useInnsendingshjemlerMap,
  useRegistreringshjemlerMap,
  useSakstyper,
  useSimpleYtelser,
  useTema,
} from '@app/simple-api-state/use-kodeverk';
import type { SaksTypeEnum } from '@app/types/kodeverk';

const useFullTemaNameFromId = (temaId: string | null): string | undefined => {
  const { data, isLoading } = useTema();

  if (isLoading || typeof data === 'undefined') {
    return undefined;
  }

  if (temaId === null) {
    return 'Mangler';
  }

  return data.find(({ id }) => id === temaId)?.beskrivelse ?? temaId;
};

export const useFullTemaNameFromIdOrLoading = (temaId: string | null): string =>
  useFullTemaNameFromId(temaId) ?? 'Laster...';

export const useFullYtelseNameFromId = (ytelseId?: string): string | undefined => {
  const { data, isLoading } = useSimpleYtelser();

  if (isLoading || typeof data === 'undefined' || ytelseId === undefined) {
    return undefined;
  }

  return data.find(({ id }) => id === ytelseId)?.navn ?? ytelseId;
};

export const useTypeNameFromId = (type: SaksTypeEnum): string | undefined => {
  const { data, isLoading } = useSakstyper();

  if (isLoading || typeof data === 'undefined') {
    return undefined;
  }

  return data.find(({ id }) => id === type)?.navn ?? type;
};

export const useEnhetNameFromIdOrLoading = (enhetId?: string | null): string => {
  const { data, isLoading } = useEnheter();

  if (isLoading || typeof data === 'undefined') {
    return 'Laster...';
  }

  if (typeof enhetId === 'string') {
    return data.find(({ id }) => id === enhetId)?.navn ?? enhetId;
  }

  return 'Mangler';
};

export const useInnsendingshjemlerFromIds = (hjemmelIdList: string[]): string[] | undefined => {
  const { data, isLoading } = useInnsendingshjemlerMap();

  if (isLoading || typeof data === 'undefined') {
    return undefined;
  }

  return hjemmelIdList.map((hjemmelId) => data[hjemmelId] ?? hjemmelId);
};

export const useRegistreringshjemlerFromIds = (hjemmelIdList: string[]): string[] | undefined => {
  const { data, isLoading } = useRegistreringshjemlerMap();

  if (isLoading || typeof data === 'undefined') {
    return undefined;
  }

  return hjemmelIdList.map((hjemmelId) => {
    const hjemmel = data[hjemmelId];

    return hjemmel === undefined ? hjemmelId : hjemmel.lovkilde.beskrivelse + ' ' + hjemmel.hjemmelnavn;
  });
};
