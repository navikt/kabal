import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';

enum MedunderskriverFlyt {
  IKKE_SENDT,
  OVERSENDT_TIL_MEDUNDERSKRIVER,
  RETURNERT_TIL_SAKSBEHANDLER,
}
export interface IMedunderskrivereState {
  medunderskrivere: IMedunderskriver[];
  loading: boolean;
}

export interface IMedunderskriver {
  navn: string;
  ident: string;
}

export interface IMedunderskriverePayload {
  tema: string;
  medunderskrivere: IMedunderskriver[];
}

export interface IMedunderskrivereInput {
  id: string;
  tema: string;
}

export interface ISettMedunderskriverParams {
  klagebehandlingId: string;
  klagebehandlingVersjon: number;
  medunderskriverident: string;
}

export interface ISettMedunderskriverResponse {
  klagebehandlingVersjon: number;
  modified: string;
  datoSendtMedunderskriver: string;
  medunderskriverFlyt: MedunderskriverFlyt;
}

//klagebehandlinger/{id}/detaljer/medunderskriverident

export const medunderskrivereApi = createApi({
  reducerPath: 'medunderskrivereApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['medunderskrivere'],
  endpoints: (builder) => ({
    getMedunderskrivere: builder.query<IMedunderskriverePayload, IMedunderskrivereInput>({
      query: ({ id, tema }) => `/api/ansatte/${id}/medunderskrivere/${tema}`,
      providesTags: ['medunderskrivere'],
    }),
    updateChosenMedunderskriver: builder.mutation<ISettMedunderskriverResponse, ISettMedunderskriverParams>({
      query: ({ klagebehandlingId, ...body }) => ({
        url: `/api/klagebehandlinger/${klagebehandlingId}/detaljer/medunderskriverident`,
        method: 'PUT',
        body,
        validateStatus: ({ ok }) => ok,
      }),
    }),
  }),
});

export const { useGetMedunderskrivereQuery, useUpdateChosenMedunderskriverMutation } = medunderskrivereApi;
