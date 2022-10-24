import { KODEVERK_BASE_PATH } from '../redux-api/common';
import { IKodeverk, IKodeverkSimpleValue, IKodeverkValue } from '../types/kodeverk';
import { SimpleApiState, useSimpleApiState } from './simple-api-state';

interface AllLovKilderToRegistreringshjemmel extends IKodeverkSimpleValue {
  registreringshjemler: IKodeverkSimpleValue[];
}

interface IHjemmelNameWithLovkilde {
  lovkilde: IKodeverkValue;
  hjemmelnavn: string;
}

type Hjemler = Record<string, string>;
type Registreringshjemler = Record<string, IHjemmelNameWithLovkilde>;

const kodeverk = new SimpleApiState<IKodeverk>(`${KODEVERK_BASE_PATH}/kodeverk`);
const lovkildeToRegistreringshjemler = new SimpleApiState<AllLovKilderToRegistreringshjemmel[]>(
  `${KODEVERK_BASE_PATH}/kodeverk/lovkildetoregistreringshjemler`
);
const registreringshjemlerMap = new SimpleApiState<Registreringshjemler>(
  `${KODEVERK_BASE_PATH}/kodeverk/registreringshjemlermap`
);
const hjemlerMap = new SimpleApiState<Hjemler>(`${KODEVERK_BASE_PATH}/kodeverk/hjemlermap`);

export const useKodeverk = () => useSimpleApiState(kodeverk);
export const useLovkildeToRegistreringshjemler = () => useSimpleApiState(lovkildeToRegistreringshjemler);
export const useRegistreringshjemlerMap = () => useSimpleApiState(registreringshjemlerMap);
export const useInnsendingshjemlerMap = () => useSimpleApiState(hjemlerMap);
