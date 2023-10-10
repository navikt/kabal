import { SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { useUtfall } from '@app/simple-api-state/use-kodeverk';
import { IKodeverkSimpleValue, UtfallEnum } from '@app/types/kodeverk';

export const useUtfallNameOrLoading = (utfallIdSet: string): string => {
  const { data: utfall } = useUtfall();

  if (utfallIdSet.length === 0) {
    return 'Alle utfall';
  }

  if (utfall === undefined) {
    return 'Laster...';
  }

  return utfallIdSet
    .split(SET_DELIMITER)
    .map((id) => getUtfallName(id, utfall))
    .join(' + ');
};

const getUtfallName = (utfallId: string, utfall: IKodeverkSimpleValue<UtfallEnum>[]): string => {
  const found = utfall.find(({ id }) => id === utfallId);

  return found === undefined ? utfallId : found.navn;
};
