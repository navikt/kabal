import { type Context, context, type Link, propagation, type Span, trace } from '@opentelemetry/api';
import { ENVIRONMENT } from '@/environment';
import { parseJSON } from '@/functions/parse-json';
import { getQueryParams } from '@/headers';
import { pushLog } from '@/observability';
import { tracer } from '@/tracing/tracer';

export interface TracedEvent {
  traceparent: string | null;
}

type ServerSentEvent = MessageEvent<string>;

type ListenerFn<T> = (event: T) => unknown | Promise<unknown>;
type JsonListenerFn<T> = (data: T, event: ServerSentEvent) => unknown | Promise<unknown>;
type EventListenerFn = (event: Event) => void;
type EventListener<E> = [E, EventListenerFn];

/**
 * If the parsed SSE data contains a `traceparent` string, extract a W3C trace
 * context from it and run `fn` inside that context so that any OTel spans
 * created during handling become children of the server-side trace.
 *
 * When a `link` is provided it is attached to the span, creating a cross-trace
 * reference (e.g. from the event-origin trace to the SSE connection trace).
 *
 * When `traceparent` is absent or null the callback runs in the current
 * (typically root) context — the same behaviour as before.
 */
const runInSseTraceContext = async (
  spanName: string,
  traceparent: string | null,
  link: Link | null,
  fn: () => unknown | Promise<unknown>,
): Promise<unknown> => {
  if (traceparent === null) {
    return fn();
  }

  const carrier: Record<string, string> = { traceparent };
  const extractedContext = propagation.extract(context.active(), carrier);
  const links = link !== null ? [link] : [];

  return context.with(extractedContext, () =>
    tracer.startActiveSpan(spanName, { links }, async (span) => {
      try {
        await fn();
      } catch (error) {
        span.recordException(error instanceof Error ? error : new Error(String(error)));
        throw error;
      } finally {
        span.end();
      }
    }),
  );
};

export class ServerSentEventManager<E extends string = string> {
  private events: EventSource;
  private listeners: EventListener<E>[] = [];
  private name: string;
  private url: string;
  private lastEventId: string | null = null;
  private metadata: Record<string, string> = {};
  private managerSpan: Span;
  private managerContext: Context;
  private connectionTraceparent: string | null;
  private connectionSpan: Span | null = null;
  public isConnected = false;

  private constructor(
    name: string,
    url: string,
    initialEventId: string | null = null,
    metadata: Record<string, string> = {},
  ) {
    this.name = name;
    this.url = url;
    this.lastEventId = initialEventId;
    this.metadata = metadata;

    this.managerSpan = tracer.startSpan(`sse.${this.name}.manager`, {
      attributes: { url: this.url, initial_event_id: initialEventId ?? undefined, ...this.metadata },
    });
    this.managerContext = trace.setSpan(context.active(), this.managerSpan);

    const carrier: Record<string, string> = {};
    propagation.inject(this.managerContext, carrier);
    this.connectionTraceparent = carrier.traceparent ?? null;

    this.events = this.createEventSource();
  }

  private startConnectionSpan(): void {
    this.connectionSpan?.end();
    this.connectionSpan = tracer.startSpan(
      `sse.${this.name}.connection`,
      {
        attributes: {
          url: this.url,
          ...this.metadata,
          ...(this.lastEventId !== null ? { last_event_id: this.lastEventId } : {}),
        },
      },
      this.managerContext,
    );
  }

  private endConnectionSpan(): void {
    this.connectionSpan?.end();
    this.connectionSpan = null;
  }

  private addEventListener(eventName: E, listener: ListenerFn<ServerSentEvent>) {
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

  public addJsonEventListener<T extends TracedEvent>(eventName: E, listener: JsonListenerFn<T>, log = false) {
    const jsonListener: ListenerFn<ServerSentEvent> = (event) => {
      if (log) {
        pushLog('Received event', { context: { eventName, ...this.metadata } });
      }

      if (event.data.length === 0) {
        return;
      }

      const parsed = parseJSON<T>(event.data);

      if (parsed === null) {
        return;
      }

      const eventTraceparent = parsed.traceparent;
      const connectionLink =
        eventTraceparent !== null && this.connectionSpan !== null
          ? { context: this.connectionSpan.spanContext() }
          : null;

      return runInSseTraceContext(
        `sse.${this.name}.${eventName.toLowerCase()}`,
        eventTraceparent ?? this.connectionTraceparent,
        connectionLink,
        () => listener(parsed, event),
      );
    };

    return this.addEventListener(eventName, jsonListener);
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
    this.startConnectionSpan();

    const params = getQueryParams();

    if (this.lastEventId !== null) {
      params.set('lastEventId', this.lastEventId);
    }

    if (this.connectionTraceparent !== null) {
      params.set('traceparent', this.connectionTraceparent);
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
      this.endConnectionSpan();

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
    const entry = instances.get(this.url);

    if (entry !== undefined && entry.refCount > 1) {
      entry.refCount--;

      return;
    }

    instances.delete(this.url);

    this.endConnectionSpan();
    this.managerSpan.end();
    this.events?.close();
    this.removeAllEventSourceListeners();
  }

  public static get<E extends string = string>(
    name: string,
    url: string,
    initialEventId: string | null = null,
    metadata: Record<string, string> = {},
  ): ServerSentEventManager<E> {
    const existing = instances.get(url);

    if (existing !== undefined) {
      existing.refCount++;

      return existing.manager as ServerSentEventManager<E>;
    }

    const manager = new ServerSentEventManager<E>(name, url, initialEventId, metadata);
    instances.set(url, { manager, refCount: 1 });

    return manager;
  }
}

const isServerSentEvent = (event: Event): event is ServerSentEvent =>
  'data' in event && typeof event.data === 'string' && 'lastEventId' in event && typeof event.lastEventId === 'string';

interface InstanceEntry {
  manager: ServerSentEventManager;
  refCount: number;
}

const instances = new Map<string, InstanceEntry>();
