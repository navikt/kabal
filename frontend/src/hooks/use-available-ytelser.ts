import { useContext, useMemo } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { isNotUndefined } from '@/functions/is-not-type-guards';
import { useEnhetYtelser } from '@/simple-api-state/use-enhet-ytelser';
import { useLatestYtelser } from '@/simple-api-state/use-kodeverk';
import type { IYtelse } from '@/types/kodeverk';

const EMPTY_ARRAY: IYtelse[] = [];

export const useAvailableYtelser = (): IYtelse[] => {
  const { data: ytelser } = useLatestYtelser();
  const { user } = useContext(StaticDataContext);

  return useMemo<IYtelse[]>(() => {
    if (typeof ytelser === 'undefined') {
      return EMPTY_ARRAY;
    }

    return user.tildelteYtelser.map((ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
  }, [user, ytelser]);
};

export const useAvailableYtelserForEnhet = (): IYtelse[] => {
  const { user } = useContext(StaticDataContext);
  const { data: ytelser = [] } = useLatestYtelser();
  const { data: ytelseIds = [] } = useEnhetYtelser(user.ansattEnhet.id);

  if (ytelseIds.length === 0 || ytelser.length === 0) {
    return EMPTY_ARRAY;
  }

  return ytelseIds.map((ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
};
