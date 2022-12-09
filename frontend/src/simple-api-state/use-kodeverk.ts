import { useOppgave } from '../hooks/oppgavebehandling/use-oppgave';
import {
  IKlageenhet,
  IKodeverk,
  IKodeverkSimpleValue,
  IKodeverkValue,
  ISakstyperToUtfall,
  IYtelse,
  UtfallEnum,
} from '../types/kodeverk';
import { KvalitetsvurderingVersion } from '../types/oppgavebehandling/oppgavebehandling';
import { SimpleApiState, useSimpleApiState } from './simple-api-state';

interface AllLovKilderToRegistreringshjemmel extends IKodeverkSimpleValue {
  registreringshjemler: IKodeverkSimpleValue[];
}

interface IHjemmelNameWithLovkilde {
  lovkilde: IKodeverkValue;
  hjemmelnavn: string;
}

type Hjemler = Record<string, string>;
type RegistreringshjemlerMap = Record<string, IHjemmelNameWithLovkilde>;

const API_PREFIX = '/api/klage-kodeverk-api/kodeverk';

const kodeverk = new SimpleApiState<IKodeverk>(API_PREFIX);
const hjemlerMap = new SimpleApiState<Hjemler>(`${API_PREFIX}/hjemlermap`);
const registreringshjemlerMap = new SimpleApiState<RegistreringshjemlerMap>(`${API_PREFIX}/registreringshjemlermap`);
const lovkildeToRegistreringshjemler = new SimpleApiState<AllLovKilderToRegistreringshjemmel[]>(
  `${API_PREFIX}/lovkildetoregistreringshjemler`
);
const ytelserV1 = new SimpleApiState<IYtelse[]>(`${API_PREFIX}/ytelser/v1`);
const ytelserV2 = new SimpleApiState<IYtelse[]>(`${API_PREFIX}/ytelser/v2`);
const klageenheter = new SimpleApiState<IKlageenhet[]>(`${API_PREFIX}/klageenheter`);
const utfall = new SimpleApiState<IKodeverkSimpleValue<UtfallEnum>[]>(`${API_PREFIX}/utfall`);
const sakstyperToUtfall = new SimpleApiState<ISakstyperToUtfall[]>(`${API_PREFIX}/sakstypertoutfall`);
const hjemler = new SimpleApiState<IKodeverkValue[]>(`${API_PREFIX}/hjemler`);

export const useKodeverk = () => useSimpleApiState(kodeverk);
export const useInnsendingshjemlerMap = () => useSimpleApiState(hjemlerMap);

export const useYtelser = () => useSimpleApiState(ytelserV2);

export const useVersionedYtelser = () => {
  const { data: oppgave } = useOppgave();

  return useSimpleApiState(getYtelserStore(oppgave?.kvalitetsvurderingReference.version));
};

const getYtelserStore = (version: KvalitetsvurderingVersion | undefined) => {
  switch (version) {
    case KvalitetsvurderingVersion.V1:
      return ytelserV1;
    case KvalitetsvurderingVersion.V2:
      return ytelserV2;
    default:
      return ytelserV2;
  }
};

export const useLovkildeToRegistreringshjemler = () => useSimpleApiState(lovkildeToRegistreringshjemler);
export const useRegistreringshjemlerMap = () => useSimpleApiState(registreringshjemlerMap);
export const useKlageenheter = () => useSimpleApiState(klageenheter);
export const useUtfall = () => useSimpleApiState(utfall);
export const useSakstyperToUtfall = () => useSimpleApiState(sakstyperToUtfall);
export const useHjemler = () => useSimpleApiState(hjemler);
