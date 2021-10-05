import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';
import { IKlagebehandling } from './oppgave-state-types';
import { IKlagebehandlingOppdateringResponse, IKlagebehandlingUpdate } from './oppgave-types';

export const klagebehandlingApi = createApi({
  reducerPath: 'klagebehandlingApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['oppgave'],
  endpoints: (builder) => ({
    getKlagebehandling: builder.query<IKlagebehandling, string>({
      query: (id) => `/api/klagebehandlinger/${id}/detaljer`,
      providesTags: ['oppgave'],
    }),
    updateKlagebehandling: builder.mutation<IKlagebehandlingOppdateringResponse, IKlagebehandlingUpdate>({
      query: ({ klagebehandlingId, ...body }) => ({
        url: `/api/klagebehandlinger/${klagebehandlingId}/detaljer/editerbare`,
        method: 'PUT',
        body,
        validateStatus: ({ ok }) => ok,
      }),
      onQueryStarted: async ({ klagebehandlingId, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.klagebehandlingVersjon = update.klagebehandlingVersjon + 1;
            klagebehandling.tilknyttedeDokumenter = update.tilknyttedeDokumenter;
            klagebehandling.vedtaket.hjemler = update.hjemler;
            klagebehandling.vedtaket.utfall = update.utfall;
          })
        );

        try {
          await queryFulfilled;
          // const { data } = await queryFulfilled;
          // dispatch(
          //   klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
          //     klagebehandling.klagebehandlingVersjon = data.klagebehandlingVersjon;
          //     klagebehandling.modified = data.modified;
          //   })
          // );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['oppgave'],
    }),
    // finishKlagebehandling: builder.mutation()
  }),
});

export const { useGetKlagebehandlingQuery, useUpdateKlagebehandlingMutation } = klagebehandlingApi;
