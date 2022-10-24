import { useRegistreringshjemlerMap } from '../simple-api-state/use-kodeverk';

export const useShortRegistreringshjemmelName = (hjemmelId?: string | null): string => {
  const { data = {} } = useRegistreringshjemlerMap();

  if (typeof hjemmelId !== 'string') {
    return 'Mangler';
  }

  const hjemmel = data[hjemmelId];

  if (typeof hjemmel !== 'undefined') {
    return `${hjemmel.lovkilde.beskrivelse} ${hjemmel.hjemmelnavn}`;
  }

  return hjemmelId;
};
