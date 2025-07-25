import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import type { IApiValidationResponse } from '@app/functions/error-type-guard';
import { IS_LOCALHOST, KABAL_BEHANDLINGER_BASE_PATH } from '@app/redux-api/common';
import { OppgaveTagTypes, oppgaverApi } from '@app/redux-api/oppgaver/oppgaver';
import { handleDocumentFinishedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/document-finished';
import { handleDocumentsAddedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/documents-added';
import { handleDocumentsChangedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/documents-changed';
import { handleDocumentsRemovedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/documents-removed';
import { handleExtraUtfallEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/extra-utfall';
import { handleFeilregistreringEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/feilregistrering';
import { handleFerdigstiltEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/ferdigstilt';
import { handlefullmektigEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/fullmektig';
import { handleGosysOppgaveEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/gosys-oppgave';
import {
  handleInnsendingshjemlerEvent,
  handleRegistreringshjemlerEvent,
} from '@app/redux-api/oppgaver/queries/behandling/event-handlers/hjemler';
import {
  handleIncludedDocumentsAdded,
  handleIncludedDocumentsCleared,
  handleIncludedDocumentsRemoved,
} from '@app/redux-api/oppgaver/queries/behandling/event-handlers/included-documents-changed';
import { handleJournalfoertDocumentModified } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/journalfoert-document-modified';
import { handleJournalpostAddedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/journalpost-added';
import { handleKlagerEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/klager';
import { handleMedunderskriverEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/medunderskriver';
import { handleMessageEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/message';
import { handleMottattVedtaksinstansEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/mottatt-vedtaksinstans';
import { handleRolEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/rol';
import { handleSattPaaVentEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/satt-paa-vent';
import { handleSmartDocumentCommentAddedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/smart-document/comment-added';
import { handleSmartDocumentCommentChangedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/smart-document/comment-changed';
import { handleSmartDocumentCommentRemovedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/smart-document/comment-removed';
import { handleSmartDocumentLanguageChangedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/smart-document/language-changed';
import { handleSmartDocumentVersionedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/smart-document/versioned';
import { handleTilbakekrevingEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/tilbakekreving';
import { handleTildelingEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/tildeling';
import { handleUtfallEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/utfall';
import { handleVarsletFristEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/varslet-frist';
import { ServerSentEventManager, ServerSentEventType } from '@app/redux-api/server-sent-events/server-sent-events';
import { user } from '@app/static-data/static-data';
import { isApiRejectionError } from '@app/types/errors';
import type { ISakenGjelder } from '@app/types/oppgave-common';
import type {
  BehandlingGosysOppgave,
  IOppgavebehandling,
  ListGosysOppgave,
} from '@app/types/oppgavebehandling/oppgavebehandling';
import type { IValidationParams } from '@app/types/oppgavebehandling/params';
import type {
  IMedunderskrivereResponse,
  ISaksbehandlerResponse,
  ITildelingEvent,
} from '@app/types/oppgavebehandling/response';
import type { IRols, ISaksbehandlere } from '@app/types/oppgaver';

export const behandlingerQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getOppgavebehandling: builder.query<IOppgavebehandling, string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/detaljer`,
      onQueryStarted: async (_, { queryFulfilled }) => {
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
          const tilbakekreving = handleTilbakekrevingEvent(navIdent, updateCachedData);
          const gosysOppgaveListener = handleGosysOppgaveEvent(oppgaveId, navIdent, updateCachedData);
          const varsletFrist = handleVarsletFristEvent(navIdent, updateCachedData);

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
          events.addJsonEventListener(ServerSentEventType.TILBAKEKREVING, tilbakekreving);
          events.addJsonEventListener(ServerSentEventType.GOSYSOPPGAVE, gosysOppgaveListener);
          events.addJsonEventListener(ServerSentEventType.VARSLET_FRIST, varsletFrist);

          // Dokumenter under arbeid
          const documentsAdded = handleDocumentsAddedEvent(oppgaveId, navIdent);
          const documentsChanged = handleDocumentsChangedEvent(oppgaveId, navIdent);
          const documentsRemoved = handleDocumentsRemovedEvent(oppgaveId, navIdent);
          const documentFinished = handleDocumentFinishedEvent(oppgaveId, navIdent);

          events.addJsonEventListener(ServerSentEventType.DOCUMENTS_ADDED, documentsAdded);
          events.addJsonEventListener(ServerSentEventType.DOCUMENTS_CHANGED, documentsChanged);
          events.addJsonEventListener(ServerSentEventType.DOCUMENTS_REMOVED, documentsRemoved);
          events.addJsonEventListener(ServerSentEventType.DOCUMENT_FINISHED, documentFinished);

          // Smart documents
          const smartDocumentVersioned = handleSmartDocumentVersionedEvent(oppgaveId);
          const smartDocumentLanguage = handleSmartDocumentLanguageChangedEvent(oppgaveId, navIdent);
          const smartDocumentCommentAdded = handleSmartDocumentCommentAddedEvent(oppgaveId, navIdent);
          const smartDocumentCommentRemoved = handleSmartDocumentCommentRemovedEvent(oppgaveId);
          const smartDocumentCommentChanged = handleSmartDocumentCommentChangedEvent(oppgaveId, navIdent);

          events.addJsonEventListener(ServerSentEventType.SMART_DOCUMENT_VERSIONED, smartDocumentVersioned);
          events.addJsonEventListener(ServerSentEventType.SMART_DOCUMENT_LANGUAGE, smartDocumentLanguage);
          events.addJsonEventListener(ServerSentEventType.SMART_DOCUMENT_COMMENT_ADDED, smartDocumentCommentAdded);
          events.addJsonEventListener(ServerSentEventType.SMART_DOCUMENT_COMMENT_REMOVED, smartDocumentCommentRemoved);
          events.addJsonEventListener(ServerSentEventType.SMART_DOCUMENT_COMMENT_CHANGED, smartDocumentCommentChanged);

          // Journalposter
          const journalpostAdded = handleJournalpostAddedEvent(oppgaveId, navIdent);
          const journalfoertDocumentModified = handleJournalfoertDocumentModified(oppgaveId, navIdent);
          const includedDocumentsAdded = handleIncludedDocumentsAdded(oppgaveId, navIdent);
          const includedDocumentsRemoved = handleIncludedDocumentsRemoved(oppgaveId, navIdent);
          const includedDocumentsCleared = handleIncludedDocumentsCleared(oppgaveId, navIdent);

          events.addJsonEventListener(ServerSentEventType.JOURNALPOST_ADDED, journalpostAdded);
          events.addJsonEventListener(ServerSentEventType.JOURNALFOERT_DOCUMENT_MODIFIED, journalfoertDocumentModified);
          events.addJsonEventListener(ServerSentEventType.INCLUDED_DOCUMENTS_ADDED, includedDocumentsAdded);
          events.addJsonEventListener(ServerSentEventType.INCLUDED_DOCUMENTS_REMOVED, includedDocumentsRemoved);
          events.addJsonEventListener(ServerSentEventType.INCLUDED_DOCUMENTS_CLEARED, includedDocumentsCleared);

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
      onQueryStarted: async (_, { queryFulfilled }) => {
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
    getGosysOppgaveList: builder.query<ListGosysOppgave[], string>({
      query: (id) => ({ url: `/kabal-api/behandlinger/${id}/gosysoppgaver` }),
    }),
    getGosysOppgave: builder.query<BehandlingGosysOppgave, string>({
      query: (id) => ({ url: `/kabal-api/behandlinger/${id}/gosysoppgave` }),
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
  useGetGosysOppgaveListQuery,
  useGetGosysOppgaveQuery,
} = behandlingerQuerySlice;
