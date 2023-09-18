import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { IApiValidationResponse } from '@app/functions/error-type-guard';
import { isApiRejectionError } from '@app/types/errors';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ISakenGjelder } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { IValidationParams } from '@app/types/oppgavebehandling/params';
import {
  IMedunderskriverResponse,
  IMedunderskrivereResponse,
  IRolResponse,
  ISaksbehandlerResponse,
} from '@app/types/oppgavebehandling/response';
import { IRols, ISaksbehandlere } from '@app/types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { OppgaveTagTypes, oppgaverApi } from '../oppgaver';

export const behandlingerQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getOppgavebehandling: builder.query<IOppgavebehandling, string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/detaljer`,
      onQueryStarted: async (oppgaveId, { queryFulfilled }) => {
        try {
          await queryFulfilled;
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
          : [{ type: OppgaveTagTypes.OPPGAVEBEHANDLING, id: result.id }],
    }),
    getMedunderskriver: builder.query<IMedunderskriverResponse, string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/medunderskriver`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              if (typeof draft !== 'undefined') {
                draft.modified = data.modified;
                draft.medunderskriver.navIdent = data.navIdent;
                draft.medunderskriver.flowState = data.flowState;
              }
            }),
          );
        } catch (e) {
          const message = 'Kunne ikke hente status for medunderskriver.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    getRol: builder.query<IRolResponse, string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/rol`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              if (draft.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
                return draft;
              }

              draft.modified = data.modified;
              draft.rol.navIdent = data.navIdent;
              draft.rol.flowState = data.flowState;
            }),
          );
        } catch (e) {
          const message = 'Kunne ikke hente status for rådgivende overlege.';

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

          // dispatch(
          //   behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
          //     if (typeof draft !== 'undefined') {
          //       draft.tildeltSaksbehandlerident = data.saksbehandler?.navIdent ?? null;
          //     }
          //   }),
          // );
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
    getSakenGjelder: builder.query<ISakenGjelder, string>({
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
    validate: builder.query<IApiValidationResponse, IValidationParams>({
      query: ({ oppgaveId, type }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/validate/${type}`,
        validateStatus: ({ status, ok }) => ok || status === 400,
      }),
    }),
    getPotentialSaksbehandlere: builder.query<ISaksbehandlere, string>({
      query: (id) => `/kabal-api/behandlinger/${id}/potentialsaksbehandlere`,
    }),
    getPotentialMedunderskrivere: builder.query<IMedunderskrivereResponse, string>({
      query: (id) => `/kabal-api/behandlinger/${id}/potentialmedunderskrivere`,
    }),
    getPotentialRol: builder.query<IRols, string>({
      query: (id) => `/kabal-api/behandlinger/${id}/potentialrol`,
    }),
  }),
});

export const {
  useGetRolQuery,
  useGetMedunderskriverQuery,
  useGetOppgavebehandlingQuery,
  useGetPotentialMedunderskrivereQuery,
  useGetPotentialSaksbehandlereQuery,
  useGetSakenGjelderQuery,
  useLazyGetSakenGjelderQuery,
  useLazyGetSaksbehandlerQuery,
  useLazyValidateQuery,
  useGetPotentialRolQuery,
} = behandlingerQuerySlice;
