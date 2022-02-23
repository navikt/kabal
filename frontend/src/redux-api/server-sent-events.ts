import { IS_LOCALHOST } from './common';

export enum ServerSentEventType {
  FINISHED = 'finished',
}

type ServerSentEvent = MessageEvent<string>;

type ListenerFn = (event: ServerSentEvent) => void;
type EventListenerFn = (event: Event) => void;
type EventListener = [ServerSentEventType, EventListenerFn];

export class ServerSentEventManager {
  private events: EventSource;
  private listeners: EventListener[] = [];
  private url: string;
  private lastEventId: string | null = null;

  constructor(url: string) {
    this.url = url;
    this.events = this.createEventSource();
  }

  public addEventListener(eventName: ServerSentEventType, listener: ListenerFn) {
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
        console.debug(`%cEventSource closed due to an error. Attempting to reconnect... - ${url}`, 'color: red');

        this.events = this.createEventSource();
      } else {
        console.debug(`%cEventSource error (${readyState(events.readyState)}) - ${url}`, 'color: red;');
      }
    });

    events.addEventListener('open', () => {
      console.debug(`%cEventSource connected (${readyState(events.readyState)}) - ${url}`, 'color: green;');

      this.listeners.forEach(([event, listener]) => events.addEventListener(event, listener));
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
