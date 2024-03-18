import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { IApiValidationResponse } from '@app/functions/error-type-guard';
import { IS_LOCALHOST, KABAL_BEHANDLINGER_BASE_PATH } from '@app/redux-api/common';
import { handleDocumentFinishedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/document-finished';
import { handleDocumentsAddedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/documents-added';
import { handleDocumentsChangedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/documents-changed';
import { handleDocumentsRemovedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/documents-removed';
import { handleExtraUtfallEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/extra-utfall';
import { handleFeilregistreringEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/feilregistrering';
import { handleFerdigstiltEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/ferdigstilt';
import { handlefullmektigEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/fullmektig';
import {
  handleInnsendingshjemlerEvent,
  handleRegistreringshjemlerEvent,
} from '@app/redux-api/oppgaver/queries/behandling/event-handlers/hjemler';
import { handleJournalfoertDocumentModified } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/journalfoert-document-modified';
import { handleJournalpostAddedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/journalpost-added';
import { handleKlagerEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/klager';
import { handleMottattVedtaksinstansEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/mottatt-vedtaksinstans';
import { handleSattPaaVentEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/satt-paa-vent';
import { handleTildelingEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/tildeling';
import { handleUtfallEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/utfall';
import { ServerSentEventManager, ServerSentEventType } from '@app/redux-api/server-sent-events/server-sent-events';
import { user } from '@app/static-data/static-data';
import { isApiRejectionError } from '@app/types/errors';
import { ISakenGjelder } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { IValidationParams } from '@app/types/oppgavebehandling/params';
import {
  IMedunderskrivereResponse,
  ISaksbehandlerResponse,
  ITildelingEvent,
} from '@app/types/oppgavebehandling/response';
import { IRols, ISaksbehandlere } from '@app/types/oppgaver';
import { OppgaveTagTypes, oppgaverApi } from '../../oppgaver';
import { handleMedunderskriverEvent } from './event-handlers/medunderskriver';
import { handleMessageEvent } from './event-handlers/message';
import { handleRolEvent } from './event-handlers/rol';

export const behandlingerQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getOppgavebehandling: builder.query<IOppgavebehandling, string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/detaljer`,
      onQueryStarted: async (params, { queryFulfilled }) => {
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
      onCacheEntryAdded: async (oppgaveId, { cacheDataLoaded, cacheEntryRemoved, updateCachedData }) => {
        try {
          await cacheDataLoaded;

          const { navIdent } = await user;

          const events = new ServerSentEventManager(`${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/events`);

          events.addJsonEventListener(ServerSentEventType.MESSAGE, handleMessageEvent(oppgaveId, navIdent));

          const tildeling = handleTildelingEvent(oppgaveId, navIdent, updateCachedData);
          const medunderskriverListener = handleMedunderskriverEvent(oppgaveId, navIdent, updateCachedData);
          const klagerListener = handleKlagerEvent(oppgaveId, navIdent, updateCachedData);
          const fullmektigListener = handlefullmektigEvent(oppgaveId, navIdent, updateCachedData);
          const utfallListener = handleUtfallEvent(navIdent, updateCachedData);
          const extraUtfallListener = handleExtraUtfallEvent(oppgaveId, navIdent, updateCachedData);
          const mottattVedtaksinstans = handleMottattVedtaksinstansEvent(navIdent, updateCachedData);
          const registreringshjemler = handleRegistreringshjemlerEvent(navIdent, updateCachedData);
          const innsendingshjemler = handleInnsendingshjemlerEvent(navIdent, updateCachedData);
          const sattPaaVent = handleSattPaaVentEvent(oppgaveId, navIdent, updateCachedData);
          const ferdigstilt = handleFerdigstiltEvent(oppgaveId, navIdent, updateCachedData);
          const feilregistrering = handleFeilregistreringEvent(oppgaveId, navIdent, updateCachedData);

          events.addJsonEventListener(ServerSentEventType.TILDELING, tildeling);
          events.addJsonEventListener(ServerSentEventType.MEDUNDERSKRIVER, medunderskriverListener);
          events.addJsonEventListener(ServerSentEventType.ROL, handleRolEvent(oppgaveId, navIdent, updateCachedData));
          events.addJsonEventListener(ServerSentEventType.KLAGER, klagerListener);
          events.addJsonEventListener(ServerSentEventType.FULLMEKTIG, fullmektigListener);
          events.addJsonEventListener(ServerSentEventType.UTFALL, utfallListener);
          events.addJsonEventListener(ServerSentEventType.EXTRA_UTFALL, extraUtfallListener);
          events.addJsonEventListener(ServerSentEventType.MOTTATT_VEDTAKSINSTANS, mottattVedtaksinstans);
          events.addJsonEventListener(ServerSentEventType.REGISTRERINGSHJEMLER, registreringshjemler);
          events.addJsonEventListener(ServerSentEventType.INNSENDINGSHJEMLER, innsendingshjemler);
          events.addJsonEventListener(ServerSentEventType.SATT_PAA_VENT, sattPaaVent);
          events.addJsonEventListener(ServerSentEventType.FERDIGSTILT, ferdigstilt);
          events.addJsonEventListener(ServerSentEventType.FEILREGISTRERING, feilregistrering);

          // Dokumenter under arbeid
          const documentsAdded = handleDocumentsAddedEvent(oppgaveId, navIdent);
          const documentsChanged = handleDocumentsChangedEvent(oppgaveId, navIdent);
          const documentsRemoved = handleDocumentsRemovedEvent(oppgaveId, navIdent);
          const documentFinished = handleDocumentFinishedEvent(oppgaveId, navIdent);

          events.addJsonEventListener(ServerSentEventType.DOCUMENTS_ADDED, documentsAdded);
          events.addJsonEventListener(ServerSentEventType.DOCUMENTS_CHANGED, documentsChanged);
          events.addJsonEventListener(ServerSentEventType.DOCUMENTS_REMOVED, documentsRemoved);
          events.addJsonEventListener(ServerSentEventType.DOCUMENT_FINISHED, documentFinished);

          // Journalposter
          const journalpostAdded = handleJournalpostAddedEvent(oppgaveId, navIdent);
          const journalfoertDocumentModified = handleJournalfoertDocumentModified(oppgaveId, navIdent);

          events.addJsonEventListener(ServerSentEventType.JOURNALPOST_ADDED, journalpostAdded);
          events.addJsonEventListener(ServerSentEventType.JOURNALFOERT_DOCUMENT_MODIFIED, journalfoertDocumentModified);

          await cacheEntryRemoved;

          events.close();
        } catch (e) {
          console.error(e);
        }
      },
      providesTags: (result) =>
        typeof result === 'undefined'
          ? [OppgaveTagTypes.OPPGAVEBEHANDLING]
          : [{ type: OppgaveTagTypes.OPPGAVEBEHANDLING, id: result.id }],
    }),
    getSaksbehandler: builder.query<ISaksbehandlerResponse, string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/saksbehandler`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              if (typeof draft !== 'undefined') {
                draft.saksbehandler = data.saksbehandler;
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
    getFradelingReason: builder.query<ITildelingEvent | null, string>({
      query: (id) => `/kabal-api/behandlinger/${id}/fradelingreason`,
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
  useGetPotentialRolQuery,
  useGetFradelingReasonQuery,
} = behandlingerQuerySlice;
