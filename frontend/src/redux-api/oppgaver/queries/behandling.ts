import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { IApiValidationResponse } from '@app/functions/error-type-guard';
import { isApiRejectionError } from '@app/types/errors';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import {
  IMedunderskriverResponse,
  IMedunderskrivereResponse,
  IMedunderskriverflytResponse,
  ISakenGjelderResponse,
  ISaksbehandlerResponse,
} from '@app/types/oppgavebehandling/response';
import { ISaksbehandlere } from '@app/types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { OppgaveTagTypes, oppgaverApi } from '../oppgaver';

export const behandlingerQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getOppgavebehandling: builder.query<IOppgavebehandling, string>({
      query: (oppgaveId) => `/kabal-api/klagebehandlinger/${oppgaveId}/detaljer`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        try {
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
        } catch (e) {
          const message = 'Kunne ikke hente oppgavebehandling.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
      providesTags: (result) =>
        typeof result === 'undefined'
          ? [OppgaveTagTypes.OPPGAVEBEHANDLING]
          : [{ type: OppgaveTagTypes.OPPGAVEBEHANDLING, id: result?.id }],
    }),
    getMedunderskriver: builder.query<IMedunderskriverResponse, string>({
      query: (oppgaveId) => `/kabal-api/klagebehandlinger/${oppgaveId}/medunderskriver`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              if (typeof draft !== 'undefined') {
                draft.medunderskriver = data.medunderskriver;
              }
            })
          );
        } catch (e) {
          const message = 'Kunne ikke hente medunderskriver.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    getMedunderskriverflyt: builder.query<IMedunderskriverflytResponse, string>({
      query: (oppgaveId) => `/kabal-api/klagebehandlinger/${oppgaveId}/medunderskriverflyt`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              if (typeof draft !== 'undefined') {
                draft.medunderskriverFlyt = data.medunderskriverFlyt;
              }
            })
          );
        } catch (e) {
          const message = 'Kunne ikke hente medunderskriverflyt.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    getSaksbehandler: builder.query<ISaksbehandlerResponse, string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/saksbehandler`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              if (typeof draft !== 'undefined') {
                draft.tildeltSaksbehandler = data.saksbehandler;
              }
            })
          );
        } catch (e) {
          const message = 'Kunne ikke hente saksbehandler.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    getSakenGjelder: builder.query<ISakenGjelderResponse, string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/sakengjelder`,
      onQueryStarted: async (oppgaveId, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (e) {
          const message = 'Kunne ikke hente saken gjelder.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
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
