import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';
import { IKlagebehandling } from './oppgave-state-types';
import {
  IKlagebehandlingFinishedUpdate,
  IKlagebehandlingHjemlerUpdate,
  IKlagebehandlingOppdateringResponse,
  IKlagebehandlingUpdate,
  IKlagebehandlingUtfallUpdate,
  IRemoveTilknyttetDocumentParams,
  ITilknyttDocumentParams,
  IVedtakFullfoertResponse,
} from './oppgave-types';

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
            klagebehandling.resultat.hjemler = update.hjemler;
            klagebehandling.resultat.utfall = update.utfall;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['oppgave'],
    }),
    updateUtfall: builder.mutation<{ modified: string }, IKlagebehandlingUtfallUpdate>({
      query: ({ klagebehandlingId, utfall }) => ({
        url: `/api/klagebehandlinger/${klagebehandlingId}/resultat/utfall`,
        method: 'PUT',
        body: { utfall },
      }),
      onQueryStarted: async ({ klagebehandlingId, utfall }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.resultat.utfall = utfall;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateHjemler: builder.mutation<{ modified: string }, IKlagebehandlingHjemlerUpdate>({
      query: ({ klagebehandlingId, hjemler }) => ({
        url: `/api/klagebehandlinger/${klagebehandlingId}/resultat/hjemler`,
        method: 'PUT',
        body: { hjemler },
      }),
      onQueryStarted: async ({ klagebehandlingId, hjemler }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.resultat.hjemler = hjemler;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    tilknyttDocument: builder.mutation<void, ITilknyttDocumentParams>({
      query: ({ klagebehandlingId, ...documentReference }) => ({
        url: `/api/klagebehandlinger/${klagebehandlingId}/dokumenttilknytninger`,
        method: 'POST',
        body: documentReference,
      }),
      onQueryStarted: async ({ klagebehandlingId, ...documentReference }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.tilknyttedeDokumenter.push(documentReference);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    removeTilknyttetDocument: builder.mutation<void, IRemoveTilknyttetDocumentParams>({
      query: ({ klagebehandlingId, dokumentInfoId }) => ({
        url: `/api/klagebehandlinger/${klagebehandlingId}/dokumenttilknytninger/${dokumentInfoId}`,
        method: 'POST',
      }),
      onQueryStarted: async ({ klagebehandlingId, dokumentInfoId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.tilknyttedeDokumenter = klagebehandling.tilknyttedeDokumenter.filter(
              (d) => !(d.dokumentInfoId === dokumentInfoId)
            );
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    finishKlagebehandling: builder.mutation<IVedtakFullfoertResponse, IKlagebehandlingFinishedUpdate>({
      query: ({ klagebehandlingId, ...body }) => ({
        url: `/api/klagebehandlinger/${klagebehandlingId}/resultat/fullfoer`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ klagebehandlingId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.avsluttetAvSaksbehandler = new Date().toLocaleDateString();
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetKlagebehandlingQuery,
  useUpdateKlagebehandlingMutation,
  useUpdateUtfallMutation,
  useUpdateHjemlerMutation,
  useTilknyttDocumentMutation,
  useRemoveTilknyttetDocumentMutation,
  useFinishKlagebehandlingMutation,
} = klagebehandlingApi;
