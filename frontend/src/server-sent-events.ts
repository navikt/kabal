import { ENVIRONMENT } from '@app/environment';
import { parseJSON } from '@app/functions/parse-json';
import { getQueryParams } from '@app/headers';

type ServerSentEvent = MessageEvent<string>;

type ListenerFn<T> = (event: T) => void;
type JsonListenerFn<T> = (data: T, event: ServerSentEvent) => void;
type EventListenerFn = (event: Event) => void;
type EventListener<E> = [E, EventListenerFn];

export class ServerSentEventManager<E extends string = string> {
  private events: EventSource;
  private listeners: EventListener<E>[] = [];
  private url: string;
  private lastEventId: string | null = null;

  public isConnected = false;

  constructor(url: string, initialEventId: string | null = null) {
    this.url = url;
    this.lastEventId = initialEventId;
    this.events = this.createEventSource();
  }

  public addEventListener(eventName: E, listener: ListenerFn<ServerSentEvent>) {
    const eventListener: EventListenerFn = (event) => {
      if (isServerSentEvent(event)) {
        this.lastEventId = event.lastEventId;
        listener(event);
      }
    };

    this.listeners.push([eventName, eventListener]);
    this.events?.addEventListener(eventName, eventListener);

    return () => this.removeEventListener(eventName, eventListener);
  }

  public addJsonEventListener<T>(eventName: E, listener: JsonListenerFn<T>) {
    const jsonListener: ListenerFn<ServerSentEvent> = (event) => {
      if (event.data.length === 0) {
        return;
      }

      const parsed = parseJSON<T>(event.data);

      if (parsed === null) {
        return;
      }

      return listener(parsed, event);
    };

    this.addEventListener(eventName, jsonListener);

    return () => this.removeEventListener(eventName, jsonListener);
  }

  private removeEventListener(eventName: E, listener: ListenerFn<ServerSentEvent>) {
    this.listeners = this.listeners.filter(([event, l]) => event !== eventName || l !== listener);
    this.events.removeEventListener(eventName, listener);

    return;
  }

  private removeAllEventSourceListeners() {
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
      withCredentials: ENVIRONMENT.isLocal,
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
    this.removeAllEventSourceListeners();
  }
}

const isServerSentEvent = (event: Event): event is ServerSentEvent =>
  'data' in event && typeof event.data === 'string' && 'lastEventId' in event && typeof event.lastEventId === 'string';
