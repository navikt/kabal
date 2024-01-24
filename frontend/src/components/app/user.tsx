import React, { createContext, useEffect, useState } from 'react';
import { AppLoader } from '@app/components/app/loader';
import { IUserData } from '@app/types/bruker';
import { user } from '@app/user';

interface Props {
  children: React.ReactNode;
}

export const UserContext = createContext<IUserData>({
  navIdent: '',
  navn: '',
  roller: [],
  enheter: [],
  ansattEnhet: { id: '', navn: '', lovligeYtelser: [] },
  tildelteYtelser: [],
});

export const UserLoader = ({ children }: Props) => {
  const [userData, setUserData] = useState<IUserData | null>(null);

  useEffect(() => {
    user.then(setUserData);
  }, []);

  if (userData === null) {
    return <AppLoader text="Laster bruker..." />;
  }

  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
};
