import { useUtfall } from '@app/simple-api-state/use-kodeverk';

export const useUtfallNameOrLoading = (utfallId: string): string => {
  const { data: utfall } = useUtfall();

  return utfall?.find(({ id }) => id === utfallId)?.navn ?? 'Laster...';
};
