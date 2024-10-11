import { StaticDataContext } from '@app/components/app/static-data-context';
import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { useEnhetYtelser } from '@app/simple-api-state/use-enhet-ytelser';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import type { IYtelse } from '@app/types/kodeverk';
import { useContext, useMemo } from 'react';

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
