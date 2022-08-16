import { useKodeverkValue } from './use-kodeverk-value';

export const useUtfallName = (utfallId: string): string => {
  const utfall = useKodeverkValue('utfall');

  return utfall?.find(({ id }) => id === utfallId)?.navn ?? 'Laster...';
};
