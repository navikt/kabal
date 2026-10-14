import { setTimeout as sleep } from 'node:timers/promises';
import type { FastifyInstance } from 'fastify';
import { getLogger } from '@/logger';

const log = getLogger('shutdown');

const LOG_PREFIX = 'Preparing to shut down';

// Nais adds a 5s preStop sleep by default, so SIGTERM arrives after the pod has been removed from the endpoints.
// The preStop sleep counts towards the 30s termination grace period.
// preStop (5s) + close (10s) + Kafka close (max 10s) leaves ~5s for shutting down tracing.
// Wonderwall is a native sidecar and is only stopped after this process exits.
const CLOSE_TIMEOUT_MS = 10_000;

enum CloseResult {
  CLOSED = 0,
  TIMEOUT = 1,
}

/** Whether the process is in the middle of a graceful shutdown (SIGTERM received). */
let shuttingDown = false;
let server: FastifyInstance | null = null;
let closePromise: Promise<void> | null = null;

const openStreams = new Set<() => void>();

export const isShuttingDown = () => shuttingDown;

export const setShuttingDown = () => {
  shuttingDown = true;
};

export const registerServer = (app: FastifyInstance) => {
  server = app;
};

/**
 * Registers a function that cleanly ends a long-lived response (e.g. an event stream) on shutdown.
 * Returns a function that unregisters it.
 */
export const registerOpenStream = (end: () => void): (() => void) => {
  if (shuttingDown) {
    end();

    return () => undefined;
  }

  openStreams.add(end);

  return () => {
    openStreams.delete(end);
  };
};

/**
 * Cleanly ends open event streams and waits for in-flight requests.
 * Exiting with open responses cuts them, which Wonderwall logs as "unexpected EOF".
 */
export const closeServer = (): Promise<void> => {
  setShuttingDown();
  closePromise ??= close();

  return closePromise;
};

const close = async () => {
  if (openStreams.size > 0) {
    log.info({ msg: `${LOG_PREFIX}: Ending ${openStreams.size} open event streams` });

    for (const end of openStreams) {
      end();
    }

    openStreams.clear();
  }

  if (server === null) {
    return;
  }

  try {
    const result = await Promise.race([
      server.close().then(() => CloseResult.CLOSED),
      sleep(CLOSE_TIMEOUT_MS, CloseResult.TIMEOUT, { ref: false }),
    ]);

    if (result === CloseResult.TIMEOUT) {
      log.warn({ msg: `${LOG_PREFIX}: Server did not close within ${CLOSE_TIMEOUT_MS}ms` });
    } else {
      log.info({ msg: `${LOG_PREFIX}: Server closed` });
    }
  } catch (error) {
    log.error({ msg: `${LOG_PREFIX}: Failed to close server`, error });
  }
};

/** Shutdown state is global, and Bun shares modules between test files. Only for tests. */
export const resetShutdownState = () => {
  shuttingDown = false;
  server = null;
  closePromise = null;
  openStreams.clear();
};
