import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';
import { dokumenterApi } from './dokumenter/api';
import { IKlagebehandling, MedunderskriverFlyt } from './oppgave-state-types';
import {
  IDeleteFileParams,
  IKlagebehandlingFinishedUpdate,
  IKlagebehandlingHjemlerUpdate,
  IKlagebehandlingUtfallUpdate,
  IMedunderskrivereInput,
  IMedunderskriverePayload,
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
  tagTypes: ['oppgave'],
  endpoints: (builder) => ({
    getKlagebehandling: builder.query<IKlagebehandling, string>({
      query: (id) => `/api/klagebehandlinger/${id}/detaljer`,
      providesTags: ['oppgave'],
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
    tilknyttDocument: builder.mutation<ITilknyttDocumentResponse, ITilknyttDocumentParams>({
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
        const documentPatchResult = dispatch(
          dokumenterApi.util.updateQueryData('getTilknyttedeDokumenter', klagebehandlingId, (draft) => {
            draft.antall = draft.antall + 1;
            draft.totaltAntall = draft.totaltAntall + 1;
            draft.dokumenter.push({
              ...documentReference,
              harTilgangTilArkivvariant: false,
              tema: '',
              tittel: '',
              registrert: '',
              vedlegg: [],
            });
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
          documentPatchResult.undo();
        }
      },
    }),
    removeTilknyttetDocument: builder.mutation<{ modified: string }, ITilknyttDocumentParams>({
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
    finishKlagebehandling: builder.mutation<IVedtakFullfoertResponse, IKlagebehandlingFinishedUpdate>({
      query: ({ klagebehandlingId }) => ({
        url: `/api/klagebehandlinger/${klagebehandlingId}/fullfoer`,
        method: 'POST',
      }),
      invalidatesTags: ['oppgave'],
      extraOptions: {
        maxRetries: 0,
      },
      onQueryStarted: async ({ klagebehandlingId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.resultat.ferdigstilt = new Date().toISOString();
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
              klagebehandling.resultat.ferdigstilt = data.modified;
              klagebehandling.modified = data.modified;
              klagebehandling.avsluttetAvSaksbehandler = data.modified;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    getMedunderskrivere: builder.query<IMedunderskriverePayload, IMedunderskrivereInput>({
      query: ({ id, tema }) => `/api/ansatte/${id}/medunderskrivere/${tema}`,
    }),
    updateChosenMedunderskriver: builder.mutation<ISettMedunderskriverResponse, ISettMedunderskriverParams>({
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
          const { data } = await queryFulfilled;
          dispatch(
            klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
              klagebehandling.modified = data.modified;
              klagebehandling.medunderskriverFlyt = data.medunderskriverFlyt;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    switchMedunderskriverflyt: builder.mutation<ISwitchMedunderskriverflytResponse, ISwitchMedunderskriverflytParams>({
      query: ({ klagebehandlingId }) => ({
        url: `/api/klagebehandlinger/${klagebehandlingId}/send`,
        method: 'POST',
        validateStatus: ({ ok }) => ok,
      }),
      onQueryStarted: async ({ klagebehandlingId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.medunderskriverFlyt = MedunderskriverFlyt.IKKE_SENDT;
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
        } catch {
          patchResult.undo();
        }
      },
    }),
    uploadFile: builder.mutation<IUploadFileResponse, IUploadFileParams>({
      query: ({ klagebehandlingId, file }) => {
        const formData = new FormData();
        formData.append('vedlegg', file);

        return {
          url: `/api/klagebehandlinger/${klagebehandlingId}/resultat/vedlegg`,
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
            klagebehandling.resultat.opplastet = opplastet;
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
        url: `/api/klagebehandlinger/${klagebehandlingId}/resultat/vedlegg`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ klagebehandlingId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          klagebehandlingApi.util.updateQueryData('getKlagebehandling', klagebehandlingId, (klagebehandling) => {
            klagebehandling.resultat.file = null;
            klagebehandling.resultat.opplastet = null;
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
  useTilknyttDocumentMutation,
  useRemoveTilknyttetDocumentMutation,
  useFinishKlagebehandlingMutation,
  useGetMedunderskrivereQuery,
  useUpdateChosenMedunderskriverMutation,
  useSwitchMedunderskriverflytMutation,
  useUploadFileMutation,
  useDeleteFileMutation,
} = klagebehandlingApi;
