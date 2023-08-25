/* eslint-disable max-lines */
import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { isoDateToPretty } from '@app/domain/date';
import { IApiValidationResponse } from '@app/functions/error-type-guard';
import { IMessage, messagesApi } from '@app/redux-api/messages';
import { ServerSentEventManager, ServerSentEventType } from '@app/redux-api/server-sent-events';
import { isApiRejectionError } from '@app/types/errors';
import { MedunderskriverFlyt, isMedunderskriverFlyt, isUtfallId } from '@app/types/kodeverk';
import { ISakenGjelder } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { IMedunderskrivereResponse, ISaksbehandlerResponse } from '@app/types/oppgavebehandling/response';
import { ISaksbehandlere } from '@app/types/oppgaver';
import { IS_LOCALHOST, KABAL_BEHANDLINGER_BASE_PATH } from '../../common';
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
      onCacheEntryAdded: async (oppgaveId, { updateCachedData, dispatch, cacheEntryRemoved, cacheDataLoaded }) => {
        try {
          await cacheDataLoaded;

          const events = new ServerSentEventManager(`${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/events`);

          // TODO: The API should not wrap the string in "". Change to addEventListener when fixed.
          events.addJsonEventListener<string>(ServerSentEventType.MEDUNDERSKRIVERIDENT, (medunderskriverident) => {
            updateCachedData((draft) => {
              if (typeof draft !== 'undefined' && draft.medunderskriverident !== medunderskriverident) {
                const old = draft.medunderskriverident;
                draft.medunderskriverident = medunderskriverident;
                // TODO: Use signature names, not IDs.
                toast.info(`Medunderskriver ble oppdatert fra ${old} til ${medunderskriverident}.`);
              }
            });
          });

          // TODO: Remove this function when the API is fixed.
          const correctWrongId = (wrongId: string) => {
            switch (wrongId) {
              case '1':
                return MedunderskriverFlyt.IKKE_SENDT;
              case '2':
                return MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER;
              case '3':
                return MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER;
              default:
                return null;
            }
          };

          // TODO: The API should use existing IDs as in the FE enum and not wrap the string in "". Change to addEventListener when fixed.
          events.addJsonEventListener<string>(ServerSentEventType.MEDUNDERSKRIVERFLYT_ID, (data) => {
            const medunderskriverFlyt = data === null ? null : correctWrongId(data);

            updateCachedData((draft) => {
              if (
                typeof draft !== 'undefined' &&
                medunderskriverFlyt !== null &&
                isMedunderskriverFlyt(medunderskriverFlyt) &&
                draft.medunderskriverFlyt !== medunderskriverFlyt
              ) {
                draft.medunderskriverFlyt = medunderskriverFlyt;

                switch (medunderskriverFlyt) {
                  case MedunderskriverFlyt.IKKE_SENDT:
                    toast.info('Saksbehandler har tatt tilbake saken.');
                    break;
                  case MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER:
                    toast.info('Saksbehandler har oversendt saken til medunderskriver.');
                    break;
                  case MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER:
                    toast.info('Medunderskriver har returnert saken.');
                    break;
                }
              }
            });
          });

          // TODO: The API should not wrap the string in "". Change to addEventListener when fixed.
          events.addJsonEventListener<string>(
            ServerSentEventType.MOTTATT_FOERSTEINSTANS_DATO,
            (mottattFoersteinstansDato) => {
              updateCachedData((draft) => {
                if (typeof draft !== 'undefined' && draft.mottattVedtaksinstans !== mottattFoersteinstansDato) {
                  draft.mottattVedtaksinstans = mottattFoersteinstansDato;
                  toast.info(
                    `"Mottatt vedtaksinstans" ble oppdatert til ${isoDateToPretty(mottattFoersteinstansDato)}.`,
                  );
                }
              });
            },
          );

          // TODO: The API should not wrap the string in "". Change to addEventListener when fixed.
          events.addJsonEventListener<string>(ServerSentEventType.UTFALL_ID, (utfallId) => {
            updateCachedData((draft) => {
              if (
                typeof draft !== 'undefined' &&
                draft.resultat.utfallId !== utfallId &&
                (utfallId === null || isUtfallId(utfallId))
              ) {
                draft.resultat.utfallId = utfallId;
                // TODO: Use utfall names, not IDs.
                toast.info(`"Utfall" ble oppdatert til ${utfallId}.`);
              }
            });
          });

          events.addJsonEventListener<IMessage>(ServerSentEventType.MESSAGE_ADDED, (message) => {
            dispatch(
              messagesApi.util.updateQueryData('getMessages', oppgaveId, (draft) => {
                if (typeof draft !== 'undefined' && message !== null && !draft.some((m) => m.id === message.id)) {
                  // TODO: Format toast better.
                  toast.info(`Ny melding fra ${message.author.name}.\n${message.text}`);

                  const [existingLast, ...rest] = draft;

                  if (existingLast === undefined) {
                    return [message, ...draft];
                  }

                  if (message.created > existingLast.created) {
                    return [message, ...draft];
                  }

                  return [existingLast, message, ...rest];
                }
              }),
            );
          });

          await cacheEntryRemoved;

          events.close();
        } catch (err) {
          console.error(err);
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
                draft.tildeltSaksbehandlerident = data.saksbehandler?.navIdent ?? null;
              }
            }),
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
  useGetOppgavebehandlingQuery,
  useGetPotentialMedunderskrivereQuery,
  useGetPotentialSaksbehandlereQuery,
  useGetSakenGjelderQuery,
  useLazyGetSakenGjelderQuery,
  useLazyGetSaksbehandlerQuery,
  useLazyValidateQuery,
} = behandlingerQuerySlice;
