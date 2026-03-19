import { INNSTILLINGER_BASE_PATH, KABAL_API_BASE_PATH } from '@/redux-api/common';
import { loadStaticData } from '@/static-data/loader';
import type { IUserData } from '@/types/bruker';
import type { CountryCode, PostalCode } from '@/types/common';

export const user = loadStaticData<IUserData>(`${INNSTILLINGER_BASE_PATH}/me/brukerdata`, 'brukerdata');
export const countryCodes = loadStaticData<CountryCode[]>(`${KABAL_API_BASE_PATH}/landinfo`, 'landliste');
export const postalCodes = loadStaticData<PostalCode[]>(`${KABAL_API_BASE_PATH}/postinfo`, 'postnummerliste');
