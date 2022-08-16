import { KODEVERK_BASE_PATH } from '../redux-api/common';
import { IKodeverk } from '../types/kodeverk';
import { SimpleApiState, useSimpleApiState } from './simple-api-state';

const kodeverk = new SimpleApiState<IKodeverk>(`${KODEVERK_BASE_PATH}/kodeverk`);

export const useKodeverk = () => useSimpleApiState(kodeverk);
