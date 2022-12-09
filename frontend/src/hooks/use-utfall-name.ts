import { useUtfall } from '../simple-api-state/use-kodeverk';

export const useUtfallName = (utfallId: string): string => {
  const { data: utfall } = useUtfall();

  return utfall?.find(({ id }) => id === utfallId)?.navn ?? 'Laster...';
};
