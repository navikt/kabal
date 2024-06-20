import { INNSTILLINGER_BASE_PATH, KABAL_API_BASE_PATH } from '@app/redux-api/common';
import { loadStaticData } from '@app/static-data/loader';
import { IUserData, Role } from '@app/types/bruker';
import { CountryCode, PostalCode } from '@app/types/common';

// TODO: Remove
export const user = loadStaticData<IUserData>(`${INNSTILLINGER_BASE_PATH}/me/brukerdata`, 'brukerdata').then(
  (data) => ({
    ...data,
    roller: [...data.roller, Role.KABAL_SVARBREVREDIGERING],
  }),
);
export const countryCodes = loadStaticData<CountryCode[]>(`${KABAL_API_BASE_PATH}/landinfo`, 'landliste');
export const postalCodes = loadStaticData<PostalCode[]>(`${KABAL_API_BASE_PATH}/postinfo`, 'postnummerliste');
