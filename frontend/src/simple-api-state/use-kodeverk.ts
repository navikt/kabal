import {
  IKabalYtelse,
  IKlageenhet,
  IKodeverk,
  IKodeverkSimpleValue,
  IKodeverkValue,
  ISakstyperToUtfall,
  IYtelse,
  UtfallEnum,
} from '@app/types/kodeverk';
import { SimpleApiState, useSimpleApiState } from './simple-api-state';

interface IHjemmelNameWithLovkilde {
  lovkilde: IKodeverkValue;
  hjemmelnavn: string;
}

type Hjemler = Record<string, string>;
type RegistreringshjemlerMap = Record<string, IHjemmelNameWithLovkilde>;

interface IFagsystem extends IKodeverkValue {
  modernized: boolean;
}

interface ILovKildeToRegistreringshjemmel extends IKodeverkValue {
  registreringshjemler: IKodeverkSimpleValue[];
}

const API_PREFIX = '/api/klage-kodeverk-api/kodeverk';

const kodeverk = new SimpleApiState<IKodeverk>(API_PREFIX);
const hjemlerMap = new SimpleApiState<Hjemler>(`${API_PREFIX}/hjemlermap`);
const registreringshjemlerMap = new SimpleApiState<RegistreringshjemlerMap>(`${API_PREFIX}/registreringshjemlermap`);

const ytelserSimple = new SimpleApiState<IKodeverkSimpleValue[]>(`${API_PREFIX}/ytelser/simple`);
const ytelserLatest = new SimpleApiState<IYtelse[]>(`${API_PREFIX}/ytelser/latest`);
const ytelserAll = new SimpleApiState<IYtelse[]>(`${API_PREFIX}/ytelser`);
const tema = new SimpleApiState<IKodeverkValue[]>(`${API_PREFIX}/tema`);
const kabalYtelserLatest = new SimpleApiState<IKabalYtelse[]>(`${API_PREFIX}/kabal/ytelser/latest`);
const klageenheter = new SimpleApiState<IKlageenhet[]>(`${API_PREFIX}/klageenheter`);
const utfall = new SimpleApiState<IKodeverkSimpleValue<UtfallEnum>[]>(`${API_PREFIX}/utfall`);
const sakstyperToUtfall = new SimpleApiState<ISakstyperToUtfall[]>(`${API_PREFIX}/sakstypertoutfall`);
const hjemler = new SimpleApiState<IKodeverkValue[]>(`${API_PREFIX}/hjemler`);
const fagsystemer = new SimpleApiState<IFagsystem[]>(`${API_PREFIX}/fagsystemer`);
const lovkildeToRegistreringshjemler = new SimpleApiState<ILovKildeToRegistreringshjemmel[]>(
  `${API_PREFIX}/lovkildetoregistreringshjemler`,
);

export const useKodeverk = () => useSimpleApiState(kodeverk);
export const useInnsendingshjemlerMap = () => useSimpleApiState(hjemlerMap);

export const useLatestYtelser = () => useSimpleApiState(ytelserLatest);
export const useKabalYtelserLatest = () => useSimpleApiState(kabalYtelserLatest);
export const useSimpleYtelser = () => useSimpleApiState(ytelserSimple);

export const useTema = () => useSimpleApiState(tema);

export const useRegistreringshjemlerMap = () => useSimpleApiState(registreringshjemlerMap);
export const useKlageenheter = () => useSimpleApiState(klageenheter);
export const useUtfall = () => useSimpleApiState(utfall);
export const useSakstyperToUtfall = () => useSimpleApiState(sakstyperToUtfall);
export const useHjemler = () => useSimpleApiState(hjemler);
export const useFagsystemer = () => useSimpleApiState(fagsystemer);
export const useYtelserAll = () => useSimpleApiState(ytelserAll);
export const useLovKildeToRegistreringshjemler = () => useSimpleApiState(lovkildeToRegistreringshjemler);
