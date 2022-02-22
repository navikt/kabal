import { createApi } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { IApiValidationResponse } from '../functions/error-type-guard';
import { IArkiverteDocumentsResponse } from '../types/arkiverte-documents';
import { MedunderskriverFlyt, OppgaveType } from '../types/kodeverk';
import { IOppgavebehandling } from '../types/oppgavebehandling';
import {
  IGetDokumenterParams,
  IOppgavebehandlingHjemlerUpdateParams,
  IOppgavebehandlingUtfallUpdateParams,
  ISetMedunderskriverParams,
  ITilknyttDocumentParams,
} from '../types/oppgavebehandling-params';
import {
  IMedunderskriverResponse,
  IMedunderskriverflytResponse,
  IModifiedResponse,
  ISettMedunderskriverResponse,
  ISwitchMedunderskriverflytResponse,
  ITilknyttDocumentResponse,
  IVedtakFullfoertResponse,
} from '../types/oppgavebehandling-response';
import { KABAL_OPPGAVEBEHANDLING_BASE_QUERY } from './common';
import { oppgaverApi } from './oppgaver';

export const oppgavebehandlingApi = createApi({
  reducerPath: 'oppgavebehandlingApi',
  baseQuery: KABAL_OPPGAVEBEHANDLING_BASE_QUERY,
  tagTypes: ['oppgavebehandling', 'dokumenter', 'tilknyttedeDokumenter'],
  endpoints: (builder) => ({
    getOppgavebehandling: builder.query<IOppgavebehandling, string>({
      query: (oppgaveId) => `/${oppgaveId}/detaljer`,
      providesTags: ['oppgavebehandling'],
    }),
    updateUtfall: builder.mutation<{ modified: string }, IOppgavebehandlingUtfallUpdateParams>({
      query: ({ oppgaveId, utfall }) => ({
        url: `/${oppgaveId}/resultat/utfall`,
        method: 'PUT',
        body: { utfall },
      }),
      onQueryStarted: async ({ oppgaveId, utfall }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.resultat.utfall = utfall;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateHjemler: builder.mutation<{ modified: string }, IOppgavebehandlingHjemlerUpdateParams>({
      query: ({ oppgaveId, hjemler }) => ({
        url: `/${oppgaveId}/resultat/hjemler`,
        method: 'PUT',
        body: { hjemler },
      }),
      onQueryStarted: async ({ oppgaveId, hjemler }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.resultat.hjemler = hjemler;
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = data.modified;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    getArkiverteDokumenter: builder.query<IArkiverteDocumentsResponse, IGetDokumenterParams>({
      query: ({ oppgaveId, pageReference, temaer }) => {
        const query = qs.stringify(
          {
            antall: 10,
            forrigeSide: pageReference,
            temaer,
          },
          {
            skipNulls: true,
            arrayFormat: 'comma',
          }
        );
        return `/${oppgaveId}/arkivertedokumenter?${query}`;
      },
      providesTags: ['dokumenter'],
    }),
    getTilknyttedeDokumenter: builder.query<IArkiverteDocumentsResponse, string>({
      query: (oppgaveId) => `/${oppgaveId}/dokumenttilknytninger`,
      providesTags: ['tilknyttedeDokumenter'],
    }),
    tilknyttDocument: builder.mutation<ITilknyttDocumentResponse, ITilknyttDocumentParams>({
      query: ({ oppgaveId, ...documentReference }) => ({
        url: `/${oppgaveId}/dokumenttilknytninger`,
        method: 'POST',
        body: documentReference,
        validateStatus: ({ ok }) => ok,
      }),
      invalidatesTags: ['tilknyttedeDokumenter'],
      onQueryStarted: async ({ oppgaveId, ...documentReference }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.tilknyttedeDokumenter.push(documentReference);
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = data.modified;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    removeTilknyttetDocument: builder.mutation<{ modified: string }, ITilknyttDocumentParams>({
      query: ({ oppgaveId, journalpostId, dokumentInfoId }) => ({
        url: `/${oppgaveId}/dokumenttilknytninger/${journalpostId}/${dokumentInfoId}`,
        method: 'DELETE',
        validateStatus: ({ ok }) => ok,
      }),
      invalidatesTags: ['tilknyttedeDokumenter'],
      onQueryStarted: async ({ oppgaveId, journalpostId, dokumentInfoId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.tilknyttedeDokumenter = draft.tilknyttedeDokumenter.filter(
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
    finishOppgavebehandling: builder.mutation<IVedtakFullfoertResponse, string>({
      query: (oppgaveId) => ({
        url: `/${oppgaveId}/fullfoer`,
        method: 'POST',
      }),
      invalidatesTags: ['oppgavebehandling'],
      extraOptions: {
        maxRetries: 0,
      },
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.modified = data.modified;
            draft.isAvsluttetAvSaksbehandler = data.isAvsluttetAvSaksbehandler;
          })
        );
      },
    }),
    updateFinishedInGosys: builder.mutation<IModifiedResponse, string>({
      query: (oppgaveId) => ({
        url: `/${oppgaveId}/fullfoertgosys`,
        method: 'POST',
      }),
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (draft.type === OppgaveType.ANKE) {
              draft.fullfoertGosys = true;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = data.modified;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    getMedunderskriver: builder.query<IMedunderskriverResponse, string>({
      query: (oppgaveId) => `/${oppgaveId}/medunderskriver`,
    }),
    getMedunderskriverflyt: builder.query<IMedunderskriverflytResponse, string>({
      query: (oppgaveId) => `/${oppgaveId}/medunderskriverflyt`,
    }),
    updateChosenMedunderskriver: builder.mutation<ISettMedunderskriverResponse, ISetMedunderskriverParams>({
      query: ({ oppgaveId, medunderskriver }) => ({
        url: `/${oppgaveId}/medunderskriverident`,
        method: 'PUT',
        body: {
          medunderskriverident: medunderskriver === null ? null : medunderskriver.navIdent,
        },
      }),
      onQueryStarted: async ({ oppgaveId, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (update.medunderskriver === null) {
              draft.medunderskriver = null;
            } else {
              draft.medunderskriver = {
                navIdent: update.medunderskriver.navIdent,
                navn: update.medunderskriver.navn,
              };
            }

            draft.medunderskriverFlyt = MedunderskriverFlyt.IKKE_SENDT;
          })
        );

        const medunderskriverPatchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getMedunderskriver', oppgaveId, (draft) => {
            draft.medunderskriver = update.medunderskriver;
          })
        );

        const flytPatchresult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getMedunderskriverflyt', oppgaveId, (draft) => {
            draft.medunderskriverFlyt = MedunderskriverFlyt.IKKE_SENDT;
          })
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = data.modified;
              draft.medunderskriverFlyt = data.medunderskriverFlyt;
            })
          );

          dispatch(
            oppgavebehandlingApi.util.updateQueryData('getMedunderskriverflyt', oppgaveId, (draft) => {
              draft.medunderskriverFlyt = data.medunderskriverFlyt;
            })
          );
        } catch {
          patchResult.undo();
          medunderskriverPatchResult.undo();
          flytPatchresult.undo();
        }
      },
    }),
    switchMedunderskriverflyt: builder.mutation<ISwitchMedunderskriverflytResponse, string>({
      query: (oppgaveId) => ({
        url: `/${oppgaveId}/send`,
        method: 'POST',
        validateStatus: ({ ok }) => ok,
      }),
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.modified = data.modified;
            draft.medunderskriverFlyt = data.medunderskriverFlyt;
          })
        );
      },
    }),
    validate: builder.query<IApiValidationResponse, string>({
      query: (oppgaveId) => ({
        url: `/${oppgaveId}/validate`,
        validateStatus: ({ status, ok }) => ok || status === 400,
      }),
    }),
    sattPaaVent: builder.mutation<IModifiedResponse, string>({
      query: (oppgaveId) => ({
        url: `${oppgaveId}/sattpaavent`,
        method: 'POST',
      }),
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.sattPaaVent = new Date().toISOString();
          })
        );

        try {
          await queryFulfilled;
          dispatch(oppgaverApi.util.invalidateTags(['ventende-oppgaver', 'tildelte-oppgaver']));
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteSattPaaVent: builder.mutation<IModifiedResponse, string>({
      query: (oppgaveId) => ({
        url: `/${oppgaveId}/sattpaavent`,
        method: 'DELETE',
      }),
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.sattPaaVent = null;
          })
        );

        try {
          await queryFulfilled;
          dispatch(oppgaverApi.util.invalidateTags(['ventende-oppgaver', 'tildelte-oppgaver']));
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetOppgavebehandlingQuery,
  useLazyGetOppgavebehandlingQuery,
  useUpdateUtfallMutation,
  useUpdateHjemlerMutation,
  useGetArkiverteDokumenterQuery,
  useGetTilknyttedeDokumenterQuery,
  useTilknyttDocumentMutation,
  useRemoveTilknyttetDocumentMutation,
  useFinishOppgavebehandlingMutation,
  useGetMedunderskriverQuery,
  useGetMedunderskriverflytQuery,
  useUpdateChosenMedunderskriverMutation,
  useSwitchMedunderskriverflytMutation,
  useUpdateFinishedInGosysMutation,
  useValidateQuery,
  useLazyValidateQuery,
  useSattPaaVentMutation,
  useDeleteSattPaaVentMutation,
} = oppgavebehandlingApi;
