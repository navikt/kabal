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

  if (isLoading || data === undefined) {
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

  if (isLoading || data === undefined || ytelseId === undefined) {
    return undefined;
  }

  return data.find(({ id }) => id === ytelseId)?.navn ?? ytelseId;
};

export const useTypeNameFromId = (type: SaksTypeEnum): string | undefined => {
  const { data, isLoading } = useSakstyper();

  if (isLoading || data === undefined) {
    return undefined;
  }

  return data.find(({ id }) => id === type)?.navn ?? type;
};

export const useEnhetNameFromIdOrLoading = (enhetId?: string | null): string => {
  const { data, isLoading } = useEnheter();

  if (isLoading || data === undefined) {
    return 'Laster...';
  }

  if (typeof enhetId === 'string') {
    return data.find(({ id }) => id === enhetId)?.navn ?? enhetId;
  }

  return 'Mangler';
};

export interface HjemmelNameAndId {
  id: string;
  name: string | undefined;
}

export const useInnsendingshjemlerFromIds = (hjemmelIdList: string[]): HjemmelNameAndId[] | undefined => {
  const { data, isLoading } = useInnsendingshjemlerMap();

  if (isLoading || data === undefined) {
    return undefined;
  }

  return hjemmelIdList.map((id) => ({ id, name: data[id] }));
};

export const useRegistreringshjemlerFromIds = (hjemmelIdList: string[]): HjemmelNameAndId[] | undefined => {
  const { data, isLoading } = useRegistreringshjemlerMap();

  if (isLoading || data === undefined) {
    return undefined;
  }

  return hjemmelIdList.map((id) => {
    const name = data[id];

    return name === undefined ? { id, name } : { id, name: `${name.lovkilde.beskrivelse} ${name.hjemmelnavn}` };
  });
};
