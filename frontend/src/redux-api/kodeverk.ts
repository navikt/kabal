import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';
import { OppgaveType } from './oppgavebehandling-common-types';

export interface GrunnerPerUtfall {
  utfallId: string;
  grunner: IKodeverkVerdi[];
}

export interface IKodeverkVerdi<T extends string = string> {
  id: T;
  navn: string;
  beskrivelse: string;
}

export interface IKodeverkVerdiMedHjemler {
  hjemler: IKodeverkVerdi[];
  temaId: string;
}

export interface IRegistreringshjemmel {
  id: string;
  navn: string;
}

export interface ILovKildeToRegistreringshjemmel {
  lovkilde: IKodeverkVerdi;
  registreringshjemler: IRegistreringshjemmel[];
}

export interface IYtelse extends IKodeverkVerdi {
  lovKildeToRegistreringshjemler: ILovKildeToRegistreringshjemmel[];
}

export interface IKodeverk {
  hjemmel: IKodeverkVerdi[];
  type: IKodeverkVerdi<OppgaveType>[];
  utfall: IKodeverkVerdi[];
  grunn: IKodeverkVerdi[];
  grunnerPerUtfall: GrunnerPerUtfall[];
  tema: IKodeverkVerdi[];
  eoes: IKodeverkVerdi[];
  kvalitetsavvikUtredning: IKodeverkVerdi[];
  kvalitetsavvikOversendelsesbrev: IKodeverkVerdi[];
  kvalitetsavvikVedtak: IKodeverkVerdi[];
  registreringshjemler: IKodeverkVerdi[];
  ytelser: IYtelse[];
}

const klageKodeverkUrl = '/api/kabal-api/kodeverk/';
const ankeKodeverkUrl = '/api/kabal-anke-api/kodeverk/';

const kodeverkApiUrl = (type: string | null) => {
  if (type === null || type === OppgaveType.KLAGEBEHANDLING) {
    return klageKodeverkUrl;
  }

  return ankeKodeverkUrl;
};

export const kodeverkApi = createApi({
  reducerPath: 'kodeverkApi',
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getKodeverk: builder.query<IKodeverk, string | null | void>({
      query: (type) => kodeverkApiUrl(type ?? null),
    }),
  }),
});

export const { useGetKodeverkQuery } = kodeverkApi;
