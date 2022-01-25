import { createApi } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { IApiValidationResponse } from '../functions/error-type-guard';
import { IDocumentsResponse } from '../types/documents';
import { MedunderskriverFlyt } from '../types/kodeverk';
import { IOppgavebehandling } from '../types/oppgavebehandling';
import {
  IGetDokumenterParams,
  IOppgavebehandlingBaseParams,
  IOppgavebehandlingFullfoertGosysUpdateParams,
  IOppgavebehandlingHjemlerUpdateParams,
  IOppgavebehandlingUtfallUpdateParams,
  ISetMedunderskriverParams,
  ITilknyttDocumentParams,
  IUploadFileParams,
} from '../types/oppgavebehandling-params';
import {
  IFinishedInGosysResponse,
  IMedunderskriverResponse,
  IMedunderskriverflytResponse,
  ISettMedunderskriverResponse,
  ISwitchMedunderskriverflytResponse,
  ITilknyttDocumentResponse,
  IUploadFileResponse,
  IVedtakFullfoertResponse,
} from '../types/oppgavebehandling-response';
import { ANKEBEHANDLING_URL, oppgavebehandlingApiUrl, staggeredBaseQuery } from './common';

export const oppgavebehandlingApi = createApi({
  reducerPath: 'oppgavebehandlingApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['oppgavebehandling', 'dokumenter', 'tilknyttedeDokumenter'],
  endpoints: (builder) => ({
    getOppgavebehandling: builder.query<IOppgavebehandling, IOppgavebehandlingBaseParams>({
      query: ({ type, oppgaveId }) => `${oppgavebehandlingApiUrl(type)}${oppgaveId}/detaljer`,
      providesTags: ['oppgavebehandling'],
    }),
    updateUtfall: builder.mutation<{ modified: string }, IOppgavebehandlingUtfallUpdateParams>({
      query: ({ type, oppgaveId, utfall }) => ({
        url: `${oppgavebehandlingApiUrl(type)}${oppgaveId}/resultat/utfall`,
        method: 'PUT',
        body: { utfall },
      }),
      onQueryStarted: async ({ oppgaveId, type, utfall }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
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
      query: ({ type, oppgaveId, hjemler }) => ({
        url: `${oppgavebehandlingApiUrl(type)}${oppgaveId}/resultat/hjemler`,
        method: 'PUT',
        body: { hjemler },
      }),
      onQueryStarted: async ({ oppgaveId, type, hjemler }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
            draft.resultat.hjemler = hjemler;
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
              draft.modified = data.modified;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    getDokumenter: builder.query<IDocumentsResponse, IGetDokumenterParams>({
      query: ({ type, oppgaveId, pageReference, temaer }) => {
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
        return `${oppgavebehandlingApiUrl(type)}${oppgaveId}/arkivertedokumenter?${query}`;
      },
      providesTags: ['dokumenter'],
    }),
    getTilknyttedeDokumenter: builder.query<IDocumentsResponse, IOppgavebehandlingBaseParams>({
      query: ({ oppgaveId, type }) => `${oppgavebehandlingApiUrl(type)}${oppgaveId}/dokumenttilknytninger`,
      providesTags: ['tilknyttedeDokumenter'],
    }),
    tilknyttDocument: builder.mutation<ITilknyttDocumentResponse, ITilknyttDocumentParams>({
      query: ({ oppgaveId, type, ...documentReference }) => ({
        url: `${oppgavebehandlingApiUrl(type)}${oppgaveId}/dokumenttilknytninger`,
        method: 'POST',
        body: documentReference,
        validateStatus: ({ ok }) => ok,
      }),
      invalidatesTags: ['tilknyttedeDokumenter'],
      onQueryStarted: async ({ oppgaveId, type, ...documentReference }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
            draft.tilknyttedeDokumenter.push(documentReference);
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
              draft.modified = data.modified;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    removeTilknyttetDocument: builder.mutation<{ modified: string }, ITilknyttDocumentParams>({
      query: ({ type, oppgaveId, journalpostId, dokumentInfoId }) => ({
        url: `${oppgavebehandlingApiUrl(type)}${oppgaveId}/dokumenttilknytninger/${journalpostId}/${dokumentInfoId}`,
        method: 'DELETE',
        validateStatus: ({ ok }) => ok,
      }),
      invalidatesTags: ['tilknyttedeDokumenter'],
      onQueryStarted: async ({ oppgaveId, type, journalpostId, dokumentInfoId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
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
    finishOppgavebehandling: builder.mutation<IVedtakFullfoertResponse, IOppgavebehandlingBaseParams>({
      query: ({ type, oppgaveId }) => ({
        url: `${oppgavebehandlingApiUrl(type)}${oppgaveId}/fullfoer`,
        method: 'POST',
      }),
      invalidatesTags: ['oppgavebehandling'],
      extraOptions: {
        maxRetries: 0,
      },
      onQueryStarted: async ({ oppgaveId, type }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
            draft.modified = data.modified;
            draft.isAvsluttetAvSaksbehandler = data.isAvsluttetAvSaksbehandler;
          })
        );
      },
    }),
    updateFinishedInGosys: builder.mutation<IFinishedInGosysResponse, IOppgavebehandlingFullfoertGosysUpdateParams>({
      query: ({ oppgaveId }) => ({
        url: `${ANKEBEHANDLING_URL}${oppgaveId}/fullfoertgosys`,
        method: 'POST',
      }),
      onQueryStarted: async ({ oppgaveId, type }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
            if (draft.type === type) {
              draft.fullfoertGosys = true;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
              draft.modified = data.modified;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    getMedunderskriver: builder.query<IMedunderskriverResponse, IOppgavebehandlingBaseParams>({
      query: ({ oppgaveId, type }) => `${oppgavebehandlingApiUrl(type)}${oppgaveId}/medunderskriver`,
    }),
    getMedunderskriverflyt: builder.query<IMedunderskriverflytResponse, IOppgavebehandlingBaseParams>({
      query: ({ oppgaveId, type }) => `${oppgavebehandlingApiUrl(type)}${oppgaveId}/medunderskriverflyt`,
    }),
    updateChosenMedunderskriver: builder.mutation<ISettMedunderskriverResponse, ISetMedunderskriverParams>({
      query: ({ oppgaveId, type, medunderskriver }) => ({
        url: `${oppgavebehandlingApiUrl(type)}${oppgaveId}/medunderskriverident`,
        method: 'PUT',
        body: {
          medunderskriverident: medunderskriver === null ? null : medunderskriver.navIdent,
        },
      }),
      onQueryStarted: async ({ oppgaveId, type, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
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
          oppgavebehandlingApi.util.updateQueryData('getMedunderskriver', { oppgaveId, type }, (draft) => {
            draft.medunderskriver = update.medunderskriver;
          })
        );

        const flytPatchresult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getMedunderskriverflyt', { oppgaveId, type }, (draft) => {
            draft.medunderskriverFlyt = MedunderskriverFlyt.IKKE_SENDT;
          })
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
              draft.modified = data.modified;
              draft.medunderskriverFlyt = data.medunderskriverFlyt;
            })
          );

          dispatch(
            oppgavebehandlingApi.util.updateQueryData('getMedunderskriverflyt', { oppgaveId, type }, (draft) => {
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
    switchMedunderskriverflyt: builder.mutation<ISwitchMedunderskriverflytResponse, IOppgavebehandlingBaseParams>({
      query: ({ type, oppgaveId }) => ({
        url: `${oppgavebehandlingApiUrl(type)}${oppgaveId}/send`,
        method: 'POST',
        validateStatus: ({ ok }) => ok,
      }),
      onQueryStarted: async ({ oppgaveId, type }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
            draft.modified = data.modified;
            draft.medunderskriverFlyt = data.medunderskriverFlyt;
          })
        );
      },
    }),
    uploadFile: builder.mutation<IUploadFileResponse, IUploadFileParams>({
      query: ({ type, oppgaveId, file }) => {
        const formData = new FormData();
        formData.append('vedlegg', file);

        return {
          url: `${oppgavebehandlingApiUrl(type)}${oppgaveId}/resultat/vedlegg`,
          method: 'POST',
          body: formData,
        };
      },
      onQueryStarted: async ({ oppgaveId, type, file }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
            const opplastet = new Date().toISOString();
            draft.resultat.file = {
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
    deleteFile: builder.mutation<IUploadFileResponse, IOppgavebehandlingBaseParams>({
      query: ({ type, oppgaveId }) => ({
        url: `${oppgavebehandlingApiUrl(type)}${oppgaveId}/resultat/vedlegg`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ oppgaveId, type }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', { oppgaveId, type }, (draft) => {
            draft.resultat.file = null;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    validate: builder.query<IApiValidationResponse, IOppgavebehandlingBaseParams>({
      query: ({ type, oppgaveId }) => ({
        url: `${oppgavebehandlingApiUrl(type)}${oppgaveId}/validate`,
        validateStatus: ({ status, ok }) => ok || status === 400,
      }),
    }),
  }),
});

export const {
  useGetOppgavebehandlingQuery,
  useLazyGetOppgavebehandlingQuery,
  useUpdateUtfallMutation,
  useUpdateHjemlerMutation,
  useGetDokumenterQuery,
  useGetTilknyttedeDokumenterQuery,
  useTilknyttDocumentMutation,
  useRemoveTilknyttetDocumentMutation,
  useFinishOppgavebehandlingMutation,
  useGetMedunderskriverQuery,
  useGetMedunderskriverflytQuery,
  useUpdateChosenMedunderskriverMutation,
  useSwitchMedunderskriverflytMutation,
  useUploadFileMutation,
  useDeleteFileMutation,
  useUpdateFinishedInGosysMutation,
  useValidateQuery,
  useLazyValidateQuery,
} = oppgavebehandlingApi;
