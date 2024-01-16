import { useContext, useMemo } from 'react';
import { UserContext } from '@app/components/app/user';
import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { useEnhetYtelser } from '@app/simple-api-state/use-enhet-ytelser';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import { IYtelse } from '@app/types/kodeverk';

const EMPTY_ARRAY: IYtelse[] = [];

export const useAvailableYtelser = (): IYtelse[] => {
  const { data: ytelser } = useLatestYtelser();
  const user = useContext(UserContext);

  return useMemo<IYtelse[]>(() => {
    if (typeof ytelser === 'undefined') {
      return EMPTY_ARRAY;
    }

    return user.tildelteYtelser.map((ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
  }, [user, ytelser]);
};

export const useAvailableYtelserForEnhet = (): IYtelse[] => {
  const user = useContext(UserContext);
  const { data: ytelser = [] } = useLatestYtelser();
  const { data: ytelseIds = [] } = useEnhetYtelser(user.ansattEnhet.id);

  if (ytelseIds.length === 0 || ytelser.length === 0) {
    return EMPTY_ARRAY;
  }

  return ytelseIds.map((ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
};
