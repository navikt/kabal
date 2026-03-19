import { skipToken } from '@reduxjs/toolkit/query';
import { useSimpleApiState } from '@/simple-api-state/simple-api-state';
import { getStateFactory } from '@/simple-api-state/state-factory';

const getState = getStateFactory<string[], string>('/kabal-api/enheter');

export const useEnhetYtelser = (enhetId: string | typeof skipToken) =>
  useSimpleApiState(enhetId === skipToken ? skipToken : getState({ path: `/${enhetId}/ytelser` }));
