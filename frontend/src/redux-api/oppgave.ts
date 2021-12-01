import { createApi } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { IApiValidationResponse } from '../functions/error-type-guard';
import { staggeredBaseQuery } from './common';
import { IDocumentsResponse, IGetDokumenterParams } from './documents-types';
import { IKlagebehandling, MedunderskriverFlyt } from './oppgave-state-types';
import {
  IDeleteFileParams,
  IFinishKlagebehandlingInput,
  IKlagebehandlingHjemlerUpdate,
  IKlagebehandlingUtfallUpdate,
  IMedunderskriverResponse,
  IMedunderskrivereParams,
  IMedunderskrivereResponse,
  IMedunderskriverflytResponse,
  ISettMedunderskriverParams,
  ISettMedunderskriverResponse,
  ISwitchMedunderskriverflytParams,
  ISwitchMedunderskriverflytResponse,
  ITilknyttDocumentParams,
  ITilknyttDocumentResponse,
  IUploadFileParams,
  IUploadFileResponse,
  IVedtakFullfoertResponse,
} from './oppgave-types';

export const klagebehandlingApi = createApi({
  reducerPath: 'klagebehandlingApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['oppgave', 'dokumenter', 'tilknyttedeDokumenter'],
  endpoints: (builder) => ({
    getKlagebehandling: builder.query<IKlagebehandling, string>({
      query: (id) => `/api/kabal-api/klagebehandlinger/${id}/detaljer`,
      providesTags: ['oppgave'],
    }),
    updateUtfall: builder.mutation<{ modified: string }, IKlagebehandlingUtfallUpdate>({
      query: ({ klagebehandlingId, utfall }) => ({
        url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/resultat/utfall`,
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
        url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/resultat/hjemler`,
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
          const { data } = await queryFulfilled;
          dispatch(
            klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
              klagebehandling.modified = data.modified;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    getDokumenter: builder.query<IDocumentsResponse, IGetDokumenterParams>({
      query: ({ klagebehandlingId, pageReference, temaer }) => {
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
        return `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/arkivertedokumenter?${query}`;
      },
      providesTags: ['dokumenter'],
    }),
    getTilknyttedeDokumenter: builder.query<IDocumentsResponse, string>({
      query: (klagebehandlingId) => `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/dokumenttilknytninger`,
      providesTags: ['tilknyttedeDokumenter'],
    }),
    tilknyttDocument: builder.mutation<ITilknyttDocumentResponse, ITilknyttDocumentParams>({
      query: ({ klagebehandlingId, ...documentReference }) => ({
        url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/dokumenttilknytninger`,
        method: 'POST',
        body: documentReference,
        validateStatus: ({ ok }) => ok,
      }),
      invalidatesTags: ['tilknyttedeDokumenter'],
      onQueryStarted: async ({ klagebehandlingId, ...documentReference }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.tilknyttedeDokumenter.push(documentReference);
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
          patchResult.undo();
        }
      },
    }),
    removeTilknyttetDocument: builder.mutation<{ modified: string }, ITilknyttDocumentParams>({
      query: ({ klagebehandlingId, journalpostId, dokumentInfoId }) => ({
        url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/dokumenttilknytninger/${journalpostId}/${dokumentInfoId}`,
        method: 'DELETE',
        validateStatus: ({ ok }) => ok,
      }),
      invalidatesTags: ['tilknyttedeDokumenter'],
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
    finishKlagebehandling: builder.mutation<IVedtakFullfoertResponse, IFinishKlagebehandlingInput>({
      query: ({ klagebehandlingId }) => ({
        url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/fullfoer`,
        method: 'POST',
      }),
      invalidatesTags: ['oppgave'],
      extraOptions: {
        maxRetries: 0,
      },
      onQueryStarted: async ({ klagebehandlingId }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.modified = data.modified;
            klagebehandling.isAvsluttetAvSaksbehandler = data.isAvsluttetAvSaksbehandler;
          })
        );
      },
    }),
    getMedunderskrivere: builder.query<IMedunderskrivereResponse, IMedunderskrivereParams>({
      query: ({ navIdent, ytelseId, enhet }) =>
        `/api/kabal-api/medunderskrivere/ytelser/${ytelseId}/enheter/${enhet}/ansatte/${navIdent}`,
    }),
    getMedunderskriver: builder.query<IMedunderskriverResponse, string>({
      query: (klagebehandlingId) => `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/medunderskriver`,
    }),
    getMedunderskriverflyt: builder.query<IMedunderskriverflytResponse, string>({
      query: (klagebehandlingId) => `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/medunderskriverflyt`,
    }),
    updateChosenMedunderskriver: builder.mutation<ISettMedunderskriverResponse, ISettMedunderskriverParams>({
      query: ({ klagebehandlingId, medunderskriver }) => ({
        url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/medunderskriverident`,
        method: 'PUT',
        body: {
          medunderskriverident: medunderskriver?.navIdent ?? null,
        },
      }),
      onQueryStarted: async ({ klagebehandlingId, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (draft) => {
            draft.medunderskriver = update.medunderskriver;
            draft.medunderskriverFlyt = MedunderskriverFlyt.IKKE_SENDT;
          })
        );

        const medunderskriverPatchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getMedunderskriver', klagebehandlingId, (draft) => {
            draft.medunderskriver = update.medunderskriver;
          })
        );

        const flytPatchresult = dispatch(
          klagebehandlingApi.util.updateQueryData('getMedunderskriverflyt', klagebehandlingId, (draft) => {
            draft.medunderskriverFlyt = MedunderskriverFlyt.IKKE_SENDT;
          })
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
              klagebehandling.modified = data.modified;
              klagebehandling.medunderskriverFlyt = data.medunderskriverFlyt;
            })
          );

          dispatch(
            klagebehandlingApi.util.updateQueryData('getMedunderskriverflyt', klagebehandlingId, (draft) => {
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
    switchMedunderskriverflyt: builder.mutation<ISwitchMedunderskriverflytResponse, ISwitchMedunderskriverflytParams>({
      query: ({ klagebehandlingId }) => ({
        url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/send`,
        method: 'POST',
        validateStatus: ({ ok }) => ok,
      }),
      onQueryStarted: async ({ klagebehandlingId }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.modified = data.modified;
            klagebehandling.medunderskriverFlyt = data.medunderskriverFlyt;
          })
        );
      },
    }),
    uploadFile: builder.mutation<IUploadFileResponse, IUploadFileParams>({
      query: ({ klagebehandlingId, file }) => {
        const formData = new FormData();
        formData.append('vedlegg', file);

        return {
          url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/resultat/vedlegg`,
          method: 'POST',
          body: formData,
        };
      },
      onQueryStarted: async ({ klagebehandlingId, file }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            const opplastet = new Date().toISOString();
            klagebehandling.resultat.file = {
              name: file.name,
              size: file.size,
              opplastet,
            };
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteFile: builder.mutation<IUploadFileResponse, IDeleteFileParams>({
      query: ({ klagebehandlingId }) => ({
        url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/resultat/vedlegg`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ klagebehandlingId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.resultat.file = null;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    validate: builder.query<IApiValidationResponse, string>({
      query: (klagebehandlingId) => ({
        url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/validate`,
        validateStatus: ({ status, ok }) => ok || status === 400,
      }),
    }),
  }),
});

export const {
  useGetKlagebehandlingQuery,
  useUpdateUtfallMutation,
  useUpdateHjemlerMutation,
  useGetDokumenterQuery,
  useGetTilknyttedeDokumenterQuery,
  useTilknyttDocumentMutation,
  useRemoveTilknyttetDocumentMutation,
  useFinishKlagebehandlingMutation,
  useGetMedunderskrivereQuery,
  useGetMedunderskriverQuery,
  useGetMedunderskriverflytQuery,
  useUpdateChosenMedunderskriverMutation,
  useSwitchMedunderskriverflytMutation,
  useUploadFileMutation,
  useDeleteFileMutation,
  useValidateQuery,
  useLazyValidateQuery,
} = klagebehandlingApi;
