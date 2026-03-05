import { useSimpleApiState } from '@app/simple-api-state/simple-api-state';
import { getStateFactory } from '@app/simple-api-state/state-factory';
import { skipToken } from '@reduxjs/toolkit/query';

const getState = getStateFactory<string[], string>('/kabal-api/enheter');

export const useEnhetYtelser = (enhetId: string | typeof skipToken) =>
  useSimpleApiState(enhetId === skipToken ? skipToken : getState({ path: `/${enhetId}/ytelser` }));
