import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useSimpleApiState } from './simple-api-state';
import { getStateFactory } from './state-factory';

const getState = getStateFactory<string[], string>('/kabal-api/enheter');

export const useEnhetYtelser = (enhetId: string | typeof skipToken) =>
  useSimpleApiState(enhetId === skipToken ? skipToken : getState({ path: `/${enhetId}/ytelser` }));
