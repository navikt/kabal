import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';
import { klagebehandlingApi } from './oppgave';
import { MedunderskriverFlyt } from './oppgave-state-types';

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
  medunderskriverident: string | null;
}

export interface ISettMedunderskriverResponse {
  klagebehandlingVersjon: number;
  modified: string;
  datoSendtMedunderskriver: string;
  medunderskriverFlyt: MedunderskriverFlyt;
}

export interface ISwitchMedunderskriverflytParams {
  klagebehandlingId: string;
}
export interface ISwitchMedunderskriverflytResponse {
  medunderskriverFlyt: string;
  modified: string;
}

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
        url: `/api/klagebehandlinger/${klagebehandlingId}/medunderskriverident`,
        method: 'PUT',
        body,
        validateStatus: ({ ok }) => ok,
      }),
      onQueryStarted: async ({ klagebehandlingId, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.medunderskriverident = update.medunderskriverident;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    switchMedunderskriverflyt: builder.mutation<ISwitchMedunderskriverflytResponse, ISwitchMedunderskriverflytParams>({
      query: ({ klagebehandlingId }) => ({
        url: `/api/klagebehandlinger/${klagebehandlingId}/send`,
        method: 'POST',
        validateStatus: ({ ok }) => ok,
      }),
      // onQueryStarted: async ({ klagebehandlingId }, { dispatch, queryFulfilled }) => {
      //   const patchResultMedunderskriver = dispatch(
      //     medunderskrivereApi.util.updateQueryData
      //   );
      // }
    }),
  }),
});

export const {
  useGetMedunderskrivereQuery,
  useUpdateChosenMedunderskriverMutation,
  useSwitchMedunderskriverflytMutation,
} = medunderskrivereApi;
