import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';
import { klagebehandlingApi } from './oppgave';
import { IKlagebehandlingOppdateringResponse } from './oppgave-types';

export interface IKvalitetsvurdering {
  klagebehandlingId: string;
  // klagebehandlingVersjon: number;
  kvalitetOversendelsesbrevBra?: boolean;
  kvalitetsavvikOversendelsesbrev: string[];
  kommentarOversendelsesbrev?: string;
  kvalitetUtredningBra?: boolean;
  kvalitetsavvikUtredning: string[];
  kommentarUtredning: string;
  kvalitetVedtakBra?: boolean;
  kvalitetsavvikVedtak: string[];
  kommentarVedtak?: string;
  avvikStorKonsekvens?: boolean;
  brukSomEksempelIOpplaering?: boolean;
}

export const kvalitetsvurderingApi = createApi({
  reducerPath: 'kvalitetsvurderingApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['kvalitetsvurdering'],
  endpoints: (builder) => ({
    getKvalitetsvurdering: builder.query<IKvalitetsvurdering, string>({
      query: (id) => `/api/klagebehandlinger/${id}/kvalitetsvurdering`,
      providesTags: ['kvalitetsvurdering'],
    }),
    updateKvalitetsvurdering: builder.mutation<IKlagebehandlingOppdateringResponse, IKvalitetsvurdering>({
      query: ({ klagebehandlingId, ...kvalitetsVurdering }) => ({
        url: `/api/klagebehandlinger/${klagebehandlingId}/kvalitetsvurdering/editerbare`,
        method: 'PUT',
        body: kvalitetsVurdering,
        validateStatus: ({ ok }) => ok,
      }),
      onQueryStarted: async ({ klagebehandlingId, ...kvalitetsVurdering }, { dispatch, queryFulfilled }) => {
        const patchResultKvalitet = dispatch(
          kvalitetsvurderingApi.util.updateQueryData('getKvalitetsvurdering', klagebehandlingId, (draft) => {
            draft.kvalitetOversendelsesbrevBra = kvalitetsVurdering.kvalitetOversendelsesbrevBra;
            draft.kvalitetsavvikOversendelsesbrev = kvalitetsVurdering.kvalitetsavvikOversendelsesbrev;
            draft.kommentarOversendelsesbrev = kvalitetsVurdering.kommentarOversendelsesbrev;
            draft.kvalitetUtredningBra = kvalitetsVurdering.kvalitetUtredningBra;
            draft.kvalitetsavvikUtredning = kvalitetsVurdering.kvalitetsavvikUtredning;
            draft.kommentarUtredning = kvalitetsVurdering.kommentarUtredning;
            draft.kvalitetVedtakBra = kvalitetsVurdering.kvalitetVedtakBra;
            draft.kvalitetsavvikVedtak = kvalitetsVurdering.kvalitetsavvikVedtak;
            draft.kommentarVedtak = kvalitetsVurdering.kommentarVedtak;
            draft.avvikStorKonsekvens = kvalitetsVurdering.avvikStorKonsekvens;
            draft.brukSomEksempelIOpplaering = kvalitetsVurdering.brukSomEksempelIOpplaering;
          })
        );

        // const patchresultKlagebehandling = dispatch(
        //   klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
        //     klagebehandling.klagebehandlingVersjon = kvalitetsVurdering.klagebehandlingVersjon + 1;
        //   })
        // );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
              // klagebehandling.klagebehandlingVersjon = data.klagebehandlingVersjon;
              klagebehandling.modified = data.modified;
            })
          );
        } catch {
          patchResultKvalitet.undo();
          // patchresultKlagebehandling.undo();
        }
      },
      invalidatesTags: ['kvalitetsvurdering'],
    }),
  }),
});

export const { useGetKvalitetsvurderingQuery, useUpdateKvalitetsvurderingMutation } = kvalitetsvurderingApi;
