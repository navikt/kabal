import { INNSTILLINGER_BASE_PATH } from '@app/redux-api/common';
import { IUserData } from '@app/types/bruker';
import { SimpleApiState, useSimpleApiState } from './simple-api-state';

const userApi = new SimpleApiState<IUserData>(`${INNSTILLINGER_BASE_PATH}/me/brukerdata`);

export const useUser = () => useSimpleApiState(userApi);
