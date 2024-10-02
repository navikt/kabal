import { getDuration } from '@app/helpers/duration';
import fastifyPlugin from 'fastify-plugin';

export const serverTimingsKey = Symbol('server-timings');
export const serverTimingStartsKey = Symbol('server-timing-starts');
export const serverTimingHeaders = Symbol('server-timing-headers');

interface ServerTimingStart {
  start: number;
  description?: string;
}

export interface ServerTiming {
  name: string;
  duration: number;
  description?: string;
}

export type AddServerTimingFn = (name: string, duration: number, description?: string) => void;
export type StartServerTimingFn = (name: string, description?: string) => void;
export type EndServerTimingFn = (name: string) => void;
export type TimedFn = () => Promise<void> | void;
export type MeasureServerTimingFn = (opts: { name: string; description?: string }, timedFn: TimedFn) => void;

declare module 'fastify' {
  interface FastifyReply {
    /**
     * Adds a server timing entry to the response.
     * @param name - The name of the server timing entry.
     * @param duration - The duration of the server timing entry in milliseconds.
     * @param description - (Optional) A description of the server timing entry.
     */
    readonly addServerTiming: AddServerTimingFn;

    /**
     * Starts a server timing entry with the given name.
     * @param name - The name of the server timing entry.
     * @param description - (Optional) A description of the server timing entry.
     */
    readonly startServerTiming: StartServerTimingFn;

    /**
     * Ends the server timing entry with the given name and adds it to the response.
     * @param name - The name of the server timing entry.
     */
    readonly endServerTiming: EndServerTimingFn;

    readonly measureServerTiming: MeasureServerTimingFn;

    readonly appendServerTimingHeader: (headerValue: string) => void;

    /**
     * Server timing entries that will be added to the response.
     */
    [serverTimingsKey]: ServerTiming[];
    [serverTimingStartsKey]: Map<string, ServerTimingStart>;
    /**
     * Server timing headers that will be added to the response.
     * From services that this service calls.
     */
    [serverTimingHeaders]: string[];
  }

  interface FastifyRequest {
    /**
     * The start time of the request.
     */
    startTime: number;

    /**
     * Returns the duration of the request.
     */
    readonly getResponseTime: () => number;
  }
}

export const SERVER_TIMING_HEADER = 'server-timing';

/**
 * Options for the Server Timing plugin.
 */
interface ServerTimingPluginOptions {
  /**
   * Whether to automatically add a total server timing entry to the response.
   */
  enableAutoTotal?: boolean;
}

export const SERVER_TIMING_PLUGIN_ID = 'server-timing';

/**
 * Fastify plugin that adds server timing functionality.
 *
 * Adds and exposes the following functionality to the `reply` object:
 * - `reply.addServerTiming(name, duration, description)`: Adds a server timing entry to the response.
 * - `reply.startServerTiming(name, description)`: Starts a server timing entry with the given name.
 * - `reply.endServerTiming(name)`: Ends the server timing entry with the given name and adds it to the response.
 *
 * Adds and exposes the following functionality to the `request` object:
 * - `request.startTime`: The start time of the request.
 * - `request.getResponseTime()`: Returns the duration of the request.
 */
export const serverTimingPlugin = fastifyPlugin<ServerTimingPluginOptions>(
  async (app, { enableAutoTotal = true }) => {
    app.decorateRequest('startTime', 0);
    app.decorateReply<ServerTiming[] | null>(serverTimingsKey, null);
    app.decorateReply<Map<string, ServerTimingStart> | null>(serverTimingStartsKey, null);
    app.decorateReply<string[] | null>(serverTimingHeaders, null);

    app.addHook('onRequest', (req, reply, done) => {
      reply[serverTimingsKey] = [];
      reply[serverTimingStartsKey] = new Map();
      reply[serverTimingHeaders] = [];
      req.startTime = performance.now();
      done();
    });

    app.decorateRequest('getResponseTime', function () {
      return getDuration(this.startTime);
    });

    app.decorateReply('addServerTiming', function (name: string, duration: number, description?: string) {
      this[serverTimingsKey].push({ name, duration, description });
    });

    app.decorateReply('startServerTiming', function (name: string, description?: string) {
      this[serverTimingStartsKey].set(name, { start: performance.now(), description });
    });

    app.decorateReply('endServerTiming', function (name: string) {
      const start = this[serverTimingStartsKey].get(name);

      if (start === undefined) {
        return;
      }

      const duration = getDuration(start.start);

      this[serverTimingsKey].push({ name, duration, description: start.description });
    });

    app.decorateReply('measureServerTiming', async function ({ name, description }, timedFn) {
      const start = performance.now();
      await timedFn();
      this.addServerTiming(name, getDuration(start), description);
    });

    app.decorateReply('appendServerTimingHeader', function (serverTimingHeader: string) {
      this[serverTimingHeaders].push(serverTimingHeader);
    });

    app.addHook('onSend', async (req, reply) => {
      if (enableAutoTotal) {
        reply.addServerTiming('total', req.getResponseTime(), 'Total');
      }

      const existingServerTimingHeader = reply.getHeader(SERVER_TIMING_HEADER);

      const serverTimingHeader = serverTimingsToHeaderEntries(reply[serverTimingsKey]).concat(
        reply[serverTimingHeaders],
      );

      if (typeof existingServerTimingHeader === 'string') {
        serverTimingHeader.push(...existingServerTimingHeader.split(',').map((entry) => entry.trim()));
      } else if (Array.isArray(existingServerTimingHeader)) {
        serverTimingHeader.push(...existingServerTimingHeader);
      }

      reply.header(SERVER_TIMING_HEADER, serverTimingHeader.join(', '));
    });
  },
  { fastify: '5', name: SERVER_TIMING_PLUGIN_ID },
);

const serverTimingsToHeaderEntries = (serverTimings: ServerTiming[]): string[] =>
  serverTimings.map(({ name, duration, description }) =>
    description === undefined ? `${name};dur=${duration}` : `${name};dur=${duration};desc="${description}"`,
  );
