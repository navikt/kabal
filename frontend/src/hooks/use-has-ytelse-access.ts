import { useContext } from 'react';
import { UserContext } from '@app/components/app/user';

export const useHasYtelseAccess = (ytelse: string | undefined): boolean => {
  const user = useContext(UserContext);

  if (ytelse === undefined) {
    return false;
  }

  return user.tildelteYtelser.some((y) => y === ytelse);
};
