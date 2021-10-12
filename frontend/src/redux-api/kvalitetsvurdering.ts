import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';
import { klagebehandlingApi } from './oppgave';

export interface IKvalitetsvurdering {
  klagebehandlingId: string;
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
    updateKvalitetsvurdering: builder.mutation<{ modified: string }, IKvalitetsvurdering>({
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

        try {
          const { data } = await queryFulfilled;
          dispatch(
            klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
              klagebehandling.modified = data.modified;
            })
          );
        } catch {
          patchResultKvalitet.undo();
        }
      },
    }),
  }),
});

export const { useGetKvalitetsvurderingQuery, useUpdateKvalitetsvurderingMutation } = kvalitetsvurderingApi;
