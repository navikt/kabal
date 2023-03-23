import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useMemo } from 'react';
import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { useEnhetYtelser } from '@app/simple-api-state/use-enhet-ytelser';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import { useUser } from '@app/simple-api-state/use-user';
import { IYtelse } from '@app/types/kodeverk';

const EMPTY_ARRAY: IYtelse[] = [];

export const useAvailableYtelser = (): IYtelse[] => {
  const { data: ytelser } = useLatestYtelser();
  const { data: userData } = useUser();

  return useMemo<IYtelse[]>(() => {
    if (typeof userData === 'undefined' || typeof ytelser === 'undefined') {
      return EMPTY_ARRAY;
    }

    return userData.tildelteYtelser.map((ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
  }, [userData, ytelser]);
};

export const useAvailableYtelserForEnhet = (): IYtelse[] => {
  const { data: userData } = useUser();
  const { data: ytelser = [] } = useLatestYtelser();
  const { data: ytelseIds = [] } = useEnhetYtelser(userData?.ansattEnhet.id ?? skipToken);

  if (ytelseIds.length === 0 || ytelser.length === 0) {
    return EMPTY_ARRAY;
  }

  return ytelseIds.map((ytelseId) => ytelser.find(({ id }) => id === ytelseId)).filter(isNotUndefined);
};
