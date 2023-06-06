import { useMemo } from 'react';
import { useUser } from '@app/simple-api-state/use-user';

type ReturnType = [false, true] | [boolean, false];

export const useHasYtelseAccess = (ytelse: string | undefined): ReturnType => {
  const { data: user, isLoading } = useUser();

  return useMemo<ReturnType>(() => {
    if (typeof ytelse === 'undefined') {
      return [false, false];
    }

    if (isLoading || typeof user === 'undefined') {
      return [false, true];
    }

    return [user.tildelteYtelser.some((y) => y === ytelse), false];
  }, [isLoading, user, ytelse]);
};
