import { useFagsystemer } from '@/simple-api-state/use-kodeverk';

export const useFagsystemName = (fagsystem: string | undefined): string => {
  const { data } = useFagsystemer();

  if (typeof fagsystem === 'undefined' || typeof data === 'undefined') {
    return '';
  }

  return data.find(({ id }) => id === fagsystem)?.navn ?? fagsystem;
};
