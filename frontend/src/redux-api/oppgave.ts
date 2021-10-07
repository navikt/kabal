import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';
import { IKlagebehandling, MedunderskriverFlyt } from './oppgave-state-types';
import {
  IKlagebehandlingFinishedUpdate,
  IKlagebehandlingHjemlerUpdate,
  IKlagebehandlingOppdateringPayload,
  IKlagebehandlingUpdate,
  IKlagebehandlingUtfallUpdate,
  IMedunderskrivereInput,
  IMedunderskriverePayload,
  ISettMedunderskriverParams,
  ISettMedunderskriverPayload,
  ISwitchMedunderskriverflytParams,
  ISwitchMedunderskriverflytPayload,
  ITilknyttDocumentParams,
  IVedtakFullfoertPayload,
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
    updateKlagebehandling: builder.mutation<IKlagebehandlingOppdateringPayload, IKlagebehandlingUpdate>({
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
        validateStatus: ({ ok }) => ok,
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
    removeTilknyttetDocument: builder.mutation<void, ITilknyttDocumentParams>({
      query: ({ klagebehandlingId, journalpostId, dokumentInfoId }) => ({
        url: `/api/klagebehandlinger/${klagebehandlingId}/dokumenttilknytninger/${journalpostId}/${dokumentInfoId}`,
        method: 'DELETE',
        validateStatus: ({ ok }) => ok,
      }),
      onQueryStarted: async ({ klagebehandlingId, journalpostId, dokumentInfoId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.tilknyttedeDokumenter = klagebehandling.tilknyttedeDokumenter.filter(
              (d) => !(d.dokumentInfoId === dokumentInfoId && d.journalpostId === journalpostId)
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
    finishKlagebehandling: builder.mutation<IVedtakFullfoertPayload, IKlagebehandlingFinishedUpdate>({
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
    getMedunderskrivere: builder.query<IMedunderskriverePayload, IMedunderskrivereInput>({
      query: ({ id, tema }) => `/api/ansatte/${id}/medunderskrivere/${tema}`,
    }),
    updateChosenMedunderskriver: builder.mutation<ISettMedunderskriverPayload, ISettMedunderskriverParams>({
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
            klagebehandling.medunderskriverFlyt = MedunderskriverFlyt.IKKE_SENDT;
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
    switchMedunderskriverflyt: builder.mutation<ISwitchMedunderskriverflytPayload, ISwitchMedunderskriverflytParams>({
      query: ({ klagebehandlingId }) => ({
        url: `/api/klagebehandlinger/${klagebehandlingId}/send`,
        method: 'POST',
        validateStatus: ({ ok }) => ok,
      }),
      invalidatesTags: ['oppgave'],
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
  useGetMedunderskrivereQuery,
  useUpdateChosenMedunderskriverMutation,
  useSwitchMedunderskriverflytMutation,
} = klagebehandlingApi;
