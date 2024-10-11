import { StaticDataContext } from '@app/components/app/static-data-context';
import { useContext } from 'react';

export const useHasYtelseAccess = (ytelse: string | undefined): boolean => {
  const { user } = useContext(StaticDataContext);

  if (ytelse === undefined) {
    return false;
  }

  return user.tildelteYtelser.some((y) => y === ytelse);
};
