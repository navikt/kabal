import { createContext, useCallback, useEffect, useState } from 'react';
import { AppLoader } from '@app/components/app/loader';
import { countryCodes, postalCodes, user } from '@app/static-data/static-data';
import { IUserData } from '@app/types/bruker';
import { CountryCode, PostalCode } from '@app/types/common';

interface Props {
  children: React.ReactNode;
}

interface StaticData {
  user: IUserData;
  countryCodeList: CountryCode[];
  getCountryName: (countryCode: string) => string | undefined;
  postalCodeList: PostalCode[];
  getPoststed: (postnummer: string) => string | undefined;
  isPostnummer: (postnummer: string) => boolean;
}

export const StaticDataContext = createContext<StaticData>({
  user: {
    navIdent: '',
    navn: '',
    roller: [],
    enheter: [],
    ansattEnhet: { id: '', navn: '', lovligeYtelser: [] },
    tildelteYtelser: [],
  },
  countryCodeList: [],
  getCountryName: () => '',
  postalCodeList: [],
  getPoststed: () => '',
  isPostnummer: () => false,
});

export const StaticDataLoader = ({ children }: Props) => {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [countryCodeList, setCountryCodeList] = useState<CountryCode[]>([]);
  const [postalCodeList, setPostalCodeList] = useState<PostalCode[]>([]);

  useEffect(() => {
    user.then(setUserData);
    countryCodes.then((list) => setCountryCodeList(list.toSorted((a, b) => a.land.localeCompare(b.land, 'no-nb'))));
    postalCodes.then(setPostalCodeList);
  }, []);

  const getCountryName = useCallback(
    (countryCode: string) => countryCodeList.find((c) => c.landkode === countryCode)?.land,
    [countryCodeList],
  );

  const getPoststed = useCallback(
    (postnummer: string) => postalCodeList.find((p) => p.postnummer === postnummer)?.poststed,
    [postalCodeList],
  );

  const isPostnummer = useCallback(
    (postnummer: string) => postalCodeList.some((p) => p.postnummer === postnummer),
    [postalCodeList],
  );

  if (userData === null) {
    return <AppLoader text="Laster bruker..." />;
  }

  if (countryCodeList.length === 0) {
    return <AppLoader text="Laster data..." />;
  }

  return (
    <StaticDataContext.Provider
      value={{
        user: userData,
        countryCodeList,
        getCountryName,
        postalCodeList,
        getPoststed,
        isPostnummer,
      }}
    >
      {children}
    </StaticDataContext.Provider>
  );
};
