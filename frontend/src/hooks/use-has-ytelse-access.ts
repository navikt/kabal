import { useContext } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';

export const useHasYtelseAccess = (ytelse: string | undefined): boolean => {
  const { user } = useContext(StaticDataContext);

  if (ytelse === undefined) {
    return false;
  }

  return user.tildelteYtelser.some((y) => y === ytelse);
};
