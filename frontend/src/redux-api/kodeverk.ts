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

export interface IKodeverk {
  hjemmel: IKodeverkVerdi[];
  type: IKodeverkVerdi[];
  utfall: IKodeverkVerdi[];
  grunn: IKodeverkVerdi[];
  grunnerPerUtfall: GrunnerPerUtfall[];
  hjemlerPerTema: IKodeverkVerdiMedHjemler[];
  tema: IKodeverkVerdi[];
  eoes: IKodeverkVerdi[];
  kvalitetsavvikUtredning: IKodeverkVerdi[];
  kvalitetsavvikOversendelsesbrev: IKodeverkVerdi[];
  kvalitetsavvikVedtak: IKodeverkVerdi[];
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
