import { createApi } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { staggeredBaseQuery } from './common';
import { IDocumentsResponse, IGetDokumenterParams } from './documents-types';
import { IKlagebehandling, MedunderskriverFlyt } from './oppgave-state-types';
import {
  IDeleteFileParams,
  IFinishKlagebehandlingInput,
  IKlagebehandlingHjemlerUpdate,
  IKlagebehandlingUtfallUpdate,
  IMedunderskriverInfoResponse,
  IMedunderskrivereInput,
  IMedunderskrivereResponse,
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
    getMedunderskrivere: builder.query<IMedunderskrivereResponse, IMedunderskrivereInput>({
      query: ({ id, tema }) => `/api/kabal-api/ansatte/${id}/medunderskrivere/${tema}`,
    }),
    getMedunderskriverInfo: builder.query<IMedunderskriverInfoResponse, string>({
      query: (klagebehandlingId) => `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/medunderskriverinfo`,
    }),
    updateChosenMedunderskriver: builder.mutation<ISettMedunderskriverResponse, ISettMedunderskriverParams>({
      query: ({ klagebehandlingId, medunderskriver }) => ({
        url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/medunderskriverident`,
        method: 'PUT',
        body: {
          medunderskriverident: medunderskriver?.ident ?? null,
        },
        validateStatus: ({ ok }) => ok,
      }),
      onQueryStarted: async ({ klagebehandlingId, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (draft) => {
            if (update.medunderskriver === null) {
              draft.medunderskriver = null;
            } else {
              draft.medunderskriver = {
                navIdent: update.medunderskriver.ident,
                navn: update.medunderskriver.navn,
              };
            }

            draft.medunderskriverFlyt = MedunderskriverFlyt.IKKE_SENDT;
          })
        );

        const infoPatchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getMedunderskriverInfo', klagebehandlingId, (draft) => {
            if (update.medunderskriver === null) {
              draft.medunderskriver = null;
            } else {
              draft.medunderskriver = {
                navIdent: update.medunderskriver.ident,
                navn: update.medunderskriver.navn,
              };
            }

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
            klagebehandlingApi.util.updateQueryData('getMedunderskriverInfo', klagebehandlingId, (draft) => {
              draft.medunderskriverFlyt = data.medunderskriverFlyt;
            })
          );
        } catch {
          patchResult.undo();
          infoPatchResult.undo();
        }
      },
      invalidatesTags: ['oppgave'],
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
      invalidatesTags: ['oppgave'],
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
  useGetMedunderskriverInfoQuery,
  useUpdateChosenMedunderskriverMutation,
  useSwitchMedunderskriverflytMutation,
  useUploadFileMutation,
  useDeleteFileMutation,
} = klagebehandlingApi;
