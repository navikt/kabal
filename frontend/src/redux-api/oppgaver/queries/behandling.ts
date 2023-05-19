import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { migrateLegacyPart } from '@app/domain/legacy-part-migration';
import { getFullName } from '@app/domain/name';
import { IApiValidationResponse } from '@app/functions/error-type-guard';
import { isApiRejectionError } from '@app/types/errors';
import { SexEnum } from '@app/types/kodeverk';
import { LegacyOppgavebehandling, LegacySakenGjelderResponse } from '@app/types/legacy';
import { ISakenGjelder } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import {
  IMedunderskriverResponse,
  IMedunderskrivereResponse,
  IMedunderskriverflytResponse,
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
      transformResponse: (behandling: LegacyOppgavebehandling | IOppgavebehandling): IOppgavebehandling => {
        if ('id' in behandling.klager && 'id' in behandling.sakenGjelder) {
          return behandling as IOppgavebehandling;
        }

        const { klager, prosessfullmektig, sakenGjelder } = behandling as LegacyOppgavebehandling;

        return {
          ...behandling,
          klager: migrateLegacyPart(klager),
          prosessfullmektig: prosessfullmektig === null ? null : migrateLegacyPart(prosessfullmektig),
          sakenGjelder: {
            id: sakenGjelder.person?.foedselsnummer ?? sakenGjelder.virksomhet?.virksomhetsnummer ?? '',
            name: getFullName(sakenGjelder.person?.navn) ?? sakenGjelder.virksomhet?.navn,
            sex: sakenGjelder.person?.kjoenn ?? SexEnum.UNKNOWN,
          },
        };
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
      transformResponse: (response: LegacySakenGjelderResponse | ISakenGjelder) => {
        if ('id' in response && 'name' in response && 'sex' in response) {
          return response;
        }

        return {
          id: response.sakenGjelder.fnr,
          name: response.sakenGjelder.navn,
          sex: SexEnum.UNKNOWN, // Old API response is missing this field.
        };
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

export const {
  useGetMedunderskriverflytQuery,
  useGetMedunderskriverQuery,
  useGetOppgavebehandlingQuery,
  useGetPotentialMedunderskrivereQuery,
  useGetPotentialSaksbehandlereQuery,
  useGetSakenGjelderQuery,
  useLazyGetSakenGjelderQuery,
  useLazyGetSaksbehandlerQuery,
  useLazyValidateQuery,
} = behandlingerQuerySlice;
