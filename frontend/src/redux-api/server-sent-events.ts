import { parseJSON } from '../functions/parse-json';
import { IS_LOCALHOST } from './common';

export enum ServerSentEventType {
  FINISHED = 'finished',
  PATCH = 'patch',
  OPERATION = 'operation',
}

type ServerSentEvent = MessageEvent<string>;

type ListenerFn<T> = (event: T) => void;
type JsonListenerFn<T> = (data: T | null, event: ServerSentEvent) => void;
type EventListenerFn = (event: Event) => void;
type EventListener = [ServerSentEventType, EventListenerFn];

export class ServerSentEventManager {
  private events: EventSource;
  private listeners: EventListener[] = [];
  private connectionListeners: ListenerFn<boolean>[] = [];
  private url: string;
  private lastEventId: string | null = null;

  public isConnected = false;

  constructor(url: string, initialEventId: string | null = null) {
    this.url = url;
    this.lastEventId = initialEventId;
    this.events = this.createEventSource();
  }

  public addConnectionListener(listener: ListenerFn<boolean>) {
    if (!this.connectionListeners.includes(listener)) {
      this.connectionListeners.push(listener);
    }

    listener(this.isConnected);
  }

  public addEventListener(eventName: ServerSentEventType, listener: ListenerFn<ServerSentEvent>) {
    const eventListener: EventListenerFn = (event) => {
      if (isServerSentEvent(event)) {
        this.lastEventId = event.lastEventId;
        console.debug(`Setting lastEventId to ${this.lastEventId}`);
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
        return listener(null, event);
      }

      const parsed = parseJSON<T>(event.data);
      listener(parsed, event);
    });

    return this;
  }

  private removeAllEventListeners() {
    if (typeof this.events !== 'undefined') {
      this.listeners.forEach(([event, listener]) => this.events.removeEventListener(event, listener));
    }
  }

  private createEventSource(): EventSource {
    const url = this.lastEventId === null ? this.url : `${this.url}?lastEventId=${this.lastEventId}`;

    const events = new EventSource(url, {
      withCredentials: IS_LOCALHOST,
    });

    console.debug(`%cEventSource created (${readyState(events.readyState)}) - ${url}`, 'color: orange;');

    events.addEventListener('error', () => {
      if (events.readyState === EventSource.CLOSED) {
        this.isConnected = false;
        this.connectionListeners.forEach((listener) => listener(this.isConnected));

        console.debug(`%cEventSource closed due to an error. Attempting to reconnect... - ${url}`, 'color: red');

        setTimeout(() => {
          this.events = this.createEventSource();
        }, 3000);
      } else {
        console.debug(`%cEventSource error (${readyState(events.readyState)}) - ${url}`, 'color: red;');
      }
    });

    events.addEventListener('open', () => {
      console.debug(`%cEventSource connected (${readyState(events.readyState)}) - ${url}`, 'color: green;');

      this.listeners.forEach(([event, listener]) => events.addEventListener(event, listener));
      this.isConnected = true;
      this.connectionListeners.forEach((listener) => listener(this.isConnected));
    });

    return events;
  }

  public close() {
    this.events?.close();
    this.removeAllEventListeners();
  }
}

const isServerSentEvent = (event: Event): event is ServerSentEvent => typeof event['data'] !== 'undefined';

const readyState = (state: number) => {
  switch (state) {
    case EventSource.CONNECTING:
      return 'CONNECTING';
    case EventSource.OPEN:
      return 'OPEN';
    case EventSource.CLOSED:
      return 'CLOSED';
    default:
      return 'UNKNOWN';
  }
};
