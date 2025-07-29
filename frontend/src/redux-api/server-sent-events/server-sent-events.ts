import { parseJSON } from '@app/functions/parse-json';
import { getQueryParams } from '@app/headers';
import { IS_LOCALHOST } from '../common';

export enum ServerSentEventType {
  // Dokumenter under arbeid
  DOCUMENT_FINISHED = 'DOCUMENT_FINISHED',
  DOCUMENTS_ADDED = 'DOCUMENTS_ADDED',
  DOCUMENTS_REMOVED = 'DOCUMENTS_REMOVED',
  DOCUMENTS_CHANGED = 'DOCUMENTS_CHANGED',

  /** Smartdokumenter */
  SMART_DOCUMENT_LANGUAGE = 'SMART_DOCUMENT_LANGUAGE',
  // New version created
  SMART_DOCUMENT_VERSIONED = 'SMART_DOCUMENT_VERSIONED',
  // New comment or reply
  SMART_DOCUMENT_COMMENT_ADDED = 'SMART_DOCUMENT_COMMENT_ADDED',
  // Comment or reply removed
  SMART_DOCUMENT_COMMENT_REMOVED = 'SMART_DOCUMENT_COMMENT_REMOVED',
  // Comment or reply changed
  SMART_DOCUMENT_COMMENT_CHANGED = 'SMART_DOCUMENT_COMMENT_CHANGED',

  // Journalførte dokumenter
  JOURNALFOERT_DOCUMENT_MODIFIED = 'JOURNALFOERT_DOCUMENT_MODIFIED',
  JOURNALPOST_ADDED = 'JOURNALPOST_ADDED',
  INCLUDED_DOCUMENTS_ADDED = 'INCLUDED_DOCUMENTS_ADDED',
  INCLUDED_DOCUMENTS_REMOVED = 'INCLUDED_DOCUMENTS_REMOVED',
  INCLUDED_DOCUMENTS_CLEARED = 'INCLUDED_DOCUMENTS_CLEARED',

  // Behandlingsdetaljer
  TILDELING = 'TILDELING',
  ROL = 'ROL',
  MEDUNDERSKRIVER = 'MEDUNDERSKRIVER',
  KLAGER = 'KLAGER',
  FULLMEKTIG = 'FULLMEKTIG',
  GOSYSOPPGAVE = 'GOSYSOPPGAVE',
  /** Added or changed */
  MESSAGE = 'MESSAGE',
  UTFALL = 'UTFALL',
  EXTRA_UTFALL = 'EXTRA_UTFALL',
  REGISTRERINGSHJEMLER = 'REGISTRERINGSHJEMLER',
  INNSENDINGSHJEMLER = 'INNSENDINGSHJEMLER',
  MOTTATT_VEDTAKSINSTANS = 'MOTTATT_VEDTAKSINSTANS',
  SATT_PAA_VENT = 'SATT_PAA_VENT',
  FERDIGSTILT = 'FERDIGSTILT',
  FEILREGISTRERING = 'FEILREGISTRERING',
  TILBAKEKREVING = 'TILBAKEKREVING',
  VARSLET_FRIST = 'VARSLET_FRIST',
}

type ServerSentEvent = MessageEvent<string>;

type ListenerFn<T> = (event: T) => void;
type JsonListenerFn<T> = (data: T, event: ServerSentEvent) => void;
type EventListenerFn = (event: Event) => void;
type EventListener = [ServerSentEventType, EventListenerFn];

export class ServerSentEventManager {
  private events: EventSource;
  private listeners: EventListener[] = [];
  private url: string;
  private lastEventId: string | null = null;

  public isConnected = false;

  constructor(url: string, initialEventId: string | null = null) {
    this.url = url;
    this.lastEventId = initialEventId;
    this.events = this.createEventSource();
  }

  public addEventListener(eventName: ServerSentEventType, listener: ListenerFn<ServerSentEvent>) {
    const eventListener: EventListenerFn = (event) => {
      if (isServerSentEvent(event)) {
        this.lastEventId = event.lastEventId;
        listener(event);
      }
    };

    this.listeners.push([eventName, eventListener]);
    this.events?.addEventListener(eventName, eventListener);

    return this;
  }

  public addJsonEventListener<T>(eventName: ServerSentEventType, listener: JsonListenerFn<T>) {
    this.addEventListener(eventName, (event) => {
      if (event.data.length === 0) {
        return;
      }

      const parsed = parseJSON<T>(event.data);

      if (parsed === null) {
        return;
      }

      return listener(parsed, event);
    });

    return this;
  }

  private removeAllEventListeners() {
    if (this.events !== undefined) {
      for (const [event, listener] of this.listeners) {
        this.events.removeEventListener(event, listener);
      }
    }
  }

  private createEventSource(): EventSource {
    const params = getQueryParams();

    if (this.lastEventId !== null) {
      params.set('lastEventId', this.lastEventId);
    }

    const url = `${this.url}?${params.toString()}`;

    const events = new EventSource(url, {
      withCredentials: IS_LOCALHOST,
    });

    events.addEventListener('error', () => {
      if (events.readyState !== EventSource.CLOSED) {
        return;
      }

      this.isConnected = false;

      setTimeout(() => {
        this.events = this.createEventSource();
      }, 3000);
    });

    events.addEventListener('open', () => {
      for (const [event, listener] of this.listeners) {
        events.addEventListener(event, listener);
      }
      this.isConnected = true;
    });

    return events;
  }

  public close() {
    this.events?.close();
    this.removeAllEventListeners();
  }
}

const isServerSentEvent = (event: Event): event is ServerSentEvent =>
  'data' in event && typeof event.data === 'string' && 'lastEventId' in event && typeof event.lastEventId === 'string';
