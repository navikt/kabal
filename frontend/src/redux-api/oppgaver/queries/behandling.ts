import { IApiValidationResponse } from '../../../functions/error-type-guard';
import { IOppgavebehandling } from '../../../types/oppgavebehandling/oppgavebehandling';
import {
  IMedunderskriverResponse,
  IMedunderskrivereResponse,
  IMedunderskriverflytResponse,
  ISakenGjelderResponse,
  ISaksbehandlerResponse,
} from '../../../types/oppgavebehandling/response';
import { ISaksbehandlere } from '../../../types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { OppgaveTagTypes, oppgaverApi } from '../oppgaver';

export const behandlingerQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getOppgavebehandling: builder.query<IOppgavebehandling, string>({
      query: (oppgaveId) => `/kabal-api/klagebehandlinger/${oppgaveId}/detaljer`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(
          behandlingerQuerySlice.util.updateQueryData('getSaksbehandler', oppgaveId, () => ({
            saksbehandler: data.tildeltSaksbehandler,
          }))
        );
        dispatch(
          behandlingerQuerySlice.util.updateQueryData('getMedunderskriver', oppgaveId, () => ({
            medunderskriver: data.medunderskriver,
          }))
        );
      },
      providesTags: (result) =>
        typeof result === 'undefined'
          ? [OppgaveTagTypes.OPPGAVEBEHANDLING]
          : [{ type: OppgaveTagTypes.OPPGAVEBEHANDLING, id: result?.id }],
    }),
    getMedunderskriver: builder.query<IMedunderskriverResponse, string>({
      query: (oppgaveId) => `/kabal-api/klagebehandlinger/${oppgaveId}/medunderskriver`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (typeof draft !== 'undefined') {
              draft.medunderskriver = data.medunderskriver;
            }
          })
        );
      },
    }),
    getMedunderskriverflyt: builder.query<IMedunderskriverflytResponse, string>({
      query: (oppgaveId) => `/kabal-api/klagebehandlinger/${oppgaveId}/medunderskriverflyt`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (typeof draft !== 'undefined') {
              draft.medunderskriverFlyt = data.medunderskriverFlyt;
            }
          })
        );
      },
    }),
    getSaksbehandler: builder.query<ISaksbehandlerResponse, string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/saksbehandler`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (typeof draft !== 'undefined') {
              draft.tildeltSaksbehandler = data.saksbehandler;
            }
          })
        );
      },
    }),
    getSakenGjelder: builder.query<ISakenGjelderResponse, string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/sakengjelder`,
    }),
    validate: builder.query<IApiValidationResponse, string>({
      query: (oppgaveId) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/validate`,
        validateStatus: ({ status, ok }) => ok || status === 400,
      }),
    }),
    getPotentialSaksbehandlere: builder.query<ISaksbehandlere, string>({
      query: (id) => `/kabal-api/behandlinger/${id}/potentialsaksbehandlere`,
    }),
    getPotentialMedunderskrivere: builder.query<IMedunderskrivereResponse, string>({
      query: (id) => `/kabal-api/behandlinger/${id}/potentialmedunderskrivere`,
    }),
  }),
});

// eslint-disable-next-line import/no-unused-modules
export const {
  useGetMedunderskriverflytQuery,
  useGetMedunderskriverQuery,
  useGetOppgavebehandlingQuery,
  useGetPotentialMedunderskrivereQuery,
  useGetPotentialSaksbehandlereQuery,
  useGetSakenGjelderQuery,
  useGetSaksbehandlerQuery,
  useLazyGetSakenGjelderQuery,
  useLazyGetSaksbehandlerQuery,
  useLazyValidateQuery,
} = behandlingerQuerySlice;
