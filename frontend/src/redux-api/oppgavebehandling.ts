import { createApi } from '@reduxjs/toolkit/query/react';
import { queryStringify } from '../functions/query-string';
import { IArkiverteDocumentsResponse } from '../types/arkiverte-documents';
import { MedunderskriverFlyt } from '../types/kodeverk';
import { IOppgavebehandling } from '../types/oppgavebehandling';
import {
  ICheckDocumentParams,
  IGetDokumenterParams,
  IOppgavebehandlingHjemlerUpdateParams,
  IOppgavebehandlingUtfallUpdateParams,
  ISetMedunderskriverParams,
} from '../types/oppgavebehandling-params';
import {
  IMedunderskriverResponse,
  IMedunderskriverflytResponse,
  IModifiedResponse,
  ISettMedunderskriverResponse,
  ISwitchMedunderskriverflytResponse,
  ITilknyttDocumentResponse,
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
        const query = queryStringify({
          antall: 10,
          forrigeSide: pageReference,
          temaer,
        });
        return `/${oppgaveId}/arkivertedokumenter?${query}`;
      },
      providesTags: ['dokumenter'],
    }),
    getTilknyttedeDokumenter: builder.query<IArkiverteDocumentsResponse, string>({
      query: (oppgaveId) => `/${oppgaveId}/dokumenttilknytninger`,
      providesTags: ['tilknyttedeDokumenter'],
    }),
    tilknyttDocument: builder.mutation<ITilknyttDocumentResponse, ICheckDocumentParams>({
      query: ({ oppgaveId, dokumentInfoId, journalpostId }) => ({
        url: `/${oppgaveId}/dokumenttilknytninger`,
        method: 'POST',
        body: {
          journalpostId,
          dokumentInfoId,
        },
        validateStatus: ({ ok }) => ok,
      }),
      invalidatesTags: ['tilknyttedeDokumenter'],
      onQueryStarted: async (
        { oppgaveId, journalpostId, dokumentInfoId, pageReferences, temaer },
        { dispatch, queryFulfilled }
      ) => {
        const patchResults = pageReferences.map((pageReference) =>
          dispatch(
            oppgavebehandlingApi.util.updateQueryData(
              'getArkiverteDokumenter',
              { oppgaveId, pageReference, temaer },
              (draft) => ({
                ...draft,
                dokumenter: draft.dokumenter.map((d) => {
                  if (d.journalpostId === journalpostId) {
                    if (d.dokumentInfoId === dokumentInfoId) {
                      return { ...d, valgt: true };
                    }

                    return {
                      ...d,
                      vedlegg: d.vedlegg.map((v) => {
                        if (v.dokumentInfoId === dokumentInfoId) {
                          return { ...v, valgt: true };
                        }

                        return v;
                      }),
                    };
                  }

                  return d;
                }),
              })
            )
          )
        );

        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getTilknyttedeDokumenter', oppgaveId, (draft) => {
            draft.dokumenter = draft.dokumenter.map((d) => {
              if (d.journalpostId === journalpostId) {
                if (d.dokumentInfoId === dokumentInfoId) {
                  return { ...d, valgt: true };
                }

                return {
                  ...d,
                  vedlegg: d.vedlegg.map((v) => {
                    if (v.dokumentInfoId === dokumentInfoId) {
                      return { ...v, valgt: true };
                    }

                    return v;
                  }),
                };
              }

              return d;
            });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach(({ undo }) => undo());
          patchResult.undo();
        }
      },
    }),
    removeTilknyttetDocument: builder.mutation<{ modified: string }, ICheckDocumentParams>({
      query: ({ oppgaveId, journalpostId, dokumentInfoId }) => ({
        url: `/${oppgaveId}/dokumenttilknytninger/${journalpostId}/${dokumentInfoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['tilknyttedeDokumenter'],
      onQueryStarted: async (
        { oppgaveId, journalpostId, dokumentInfoId, pageReferences, temaer },
        { dispatch, queryFulfilled }
      ) => {
        const patchResults = pageReferences.map((pageReference) =>
          dispatch(
            oppgavebehandlingApi.util.updateQueryData(
              'getArkiverteDokumenter',
              { oppgaveId, pageReference, temaer },
              (draft) => ({
                ...draft,
                dokumenter: draft.dokumenter.map((d) => {
                  if (d.journalpostId === journalpostId) {
                    if (d.dokumentInfoId === dokumentInfoId) {
                      return { ...d, valgt: false };
                    }

                    return {
                      ...d,
                      vedlegg: d.vedlegg.map((v) => {
                        if (v.dokumentInfoId === dokumentInfoId) {
                          return { ...v, valgt: false };
                        }

                        return v;
                      }),
                    };
                  }

                  return d;
                }),
              })
            )
          )
        );

        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getTilknyttedeDokumenter', oppgaveId, (draft) => {
            draft.dokumenter = draft.dokumenter
              .filter((d) => !(d.dokumentInfoId === dokumentInfoId && d.journalpostId === journalpostId))
              .map((d) => ({
                ...d,
                vedlegg: d.vedlegg.filter(
                  (v) => !(v.dokumentInfoId === dokumentInfoId && d.journalpostId === journalpostId)
                ),
              }));
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach(({ undo }) => undo());
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
  useGetMedunderskriverQuery,
  useGetMedunderskriverflytQuery,
  useUpdateChosenMedunderskriverMutation,
  useSwitchMedunderskriverflytMutation,
  useSattPaaVentMutation,
  useDeleteSattPaaVentMutation,
} = oppgavebehandlingApi;
