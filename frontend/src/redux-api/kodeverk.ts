import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';

export interface GrunnerPerUtfall {
  utfallId: string;
  grunner: IKodeverkVerdi[];
}

export interface IKodeverkVerdi {
  id: string;
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
  type: IKodeverkVerdi[];
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

export const kodeverkApi = createApi({
  reducerPath: 'kodeverkApi',
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getKodeverk: builder.query<IKodeverk, void>({
      query: () => '/api/kabal-api/kodeverk',
    }),
  }),
});

export const { useGetKodeverkQuery } = kodeverkApi;
