import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';
import { IKlagebehandling } from './oppgave-state-types';

export const klagebehandlingApi = createApi({
  reducerPath: 'klagebehandlingApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['oppgave'],
  endpoints: (builder) => ({
    getKlagebehandling: builder.query<IKlagebehandling, string>({
      query: (id) => `/api/klagebehandlinger/${id}/detaljer`,
      providesTags: ['oppgave'],
    }),
    updateKlagebehandling: builder.mutation<string, IKlagebehandling>({
      query: (update) => ({
        url: `/api/klagebehandlinger/${update.id}/detaljer/editerbare`,
        method: 'PUT',
        body: update,
        validateStatus: ({ ok }) => ok,
      }),
      invalidatesTags: ['oppgave'],
    }),
  }),
});

export const { useGetKlagebehandlingQuery, useUpdateKlagebehandlingMutation } = klagebehandlingApi;
